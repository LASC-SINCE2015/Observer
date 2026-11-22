'use strict';
/* ===================================================================
   ゲームの進行
   - 台本（Observer.scripts）の命令を上から順に実行する。命令の一覧は OPS。
   - 画面（監視モニター・モニター壁・タイムライン・テキスト・選択肢）を動かす。
   - セーブ（場面のセーブ）と、章をまたぐ記録（progress）を localStorage に残す。
   =================================================================== */

(function () {
  const GAME_VERSION = '0.3.1';
  const SAVE_KEY = 'observer.save.v2';          // 場面のセーブ。形式を変えたら v を上げる
  const PROGRESS_KEY = 'observer.progress.v2';  // 章をまたぐ記録
  const DATA_VERSION = 2;
  const TYPE_MS = 32;                 // 1 文字を表示する間隔
  const PAST_WINDOW = 72 * 60;        // さかのぼれる長さ（分）
  const DEBUG = /[?&]debug/.test(location.search);
  const R = Observer.renderer;
  const WAIT = {};                    // 命令が「あとで続きを実行する」ときに返す印

  /* ===================================================================
     時刻（分で持つ。1日目 0:00 = 0）
     =================================================================== */
  function pad(n) { return String(n).padStart(2, '0'); }
  // 「日/時:分」か、@settime で覚えた時刻からの相対（「N」「N+3」。N+3 は N の 3 分後）
  function parseTime(s) {
    const r = String(s).match(/^([A-Za-z_]\w*)(?:\+(\d+))?$/);
    if (r) {
      if (state.vars[r[1]] === undefined) throw new Error(`時刻「${r[1]}」は、まだ @settime で覚えていません`);
      return state.vars[r[1]] + (+(r[2] || 0));
    }
    const m = String(s).match(/^(\d+)\/(\d{1,2}):(\d{2})$/);
    if (!m) throw new Error(`時刻「${s}」は「日/時:分」（例: 2/01:30）か「N+3」で書いてください`);
    return (m[1] - 1) * 1440 + (+m[2]) * 60 + (+m[3]);
  }
  function parseRange(s) {
    const [a, b] = String(s).split('-');
    if (!b) throw new Error(`時間帯「${s}」は「日/時:分-日/時:分」で書いてください`);
    return [parseTime(a), parseTime(b)];
  }
  function fmtTime(min) {
    const d = Math.floor(min / 1440) + 1;
    const r = ((min % 1440) + 1440) % 1440;
    return `${d}日目 ${pad(Math.floor(r / 60))}:${pad(r % 60)}`;
  }

  /* ===================================================================
     状態
     - state: いまの章の中の状態（場面のセーブに入る）
     - progress: 章をまたぐ記録
     =================================================================== */
  function newWorld() {
    const cams = {};
    Observer.cameraOrder.forEach((id) => {
      cams[id] = { status: 'ok', statusText: '', actors: [], img: null, look: null, open: false };
    });
    return {
      chapter: 1, script: null, label: null,
      now: 0, pastAt: null, mode: 'live', cam: Observer.cameraOrder[0], power: false,
      outside: null, flags: {}, items: [], logs: [], burned: [],
      cams, events: [], hotspots: [], marks: {}, wall: Observer.cameraOrder.slice(),
      relay: null, splash: false, black: null, lastHotspot: null,
      portraits: {},   // 立ち絵 { right: { name, face }, left: … }
      notebook: [],    // 八島の手帳（この周回で書いたもの）。{ id, ch, at, where, text, unread }
      clockHidden: false,   // @time - で、ステータスの時刻を隠す（月末・数か月後など、章の外の時間）
      cinema: false,        // @cinema on で、予告のあいだだけ画面の枠（時刻・モニター壁・操作ボタン・文章）を隠す
      vars: {},        // @settime で覚えた時刻（相対の時刻「N+3」に使う）
    };
  }

  // chapterNotes: 章を通常解決で終えたときの手帳（章を選んで始めるとき、前の章までの分を手帳に入れる）
  function newProgress() {
    // noIdle: 「時間切れなし」（メニューで切り替える。オンのとき、台本の @idle は無視する）
    return { chapters: {}, flags: {}, endings: {}, read: {}, unlocked: {}, shown: {}, sound: false, chapterNotes: {}, noIdle: false };
  }

  let state = newWorld();
  let progress = loadProgress();
  let checkpoint = null;
  // reading: 探索中に読んでいる @look・@event（カメラを切り替えたら打ち切る）
  const run = { script: null, pc: 0, choice: null, lastChoice: null, waitWipe: false, reading: null, pauseTimer: null };
  const history = [];
  let skipping = false;
  let glitch = 0;
  const lamps = {};
  let labelSnaps = {};   // ラベルごとの、入ったときの状態（バッドエンドからのやり直しに使う）

  function clone(o) { return JSON.parse(JSON.stringify(o)); }

  /* ===================================================================
     条件（選択肢の if、@if）
     - 「flag」「!flag」「item:ID」「g:flag（章をまたぐフラグ）」を & か空白でつなぐ（すべて満たすとき真）
     =================================================================== */
  function test(cond) {
    if (!cond) return true;
    return cond.split(/[\s&]+/).filter(Boolean).every((raw) => {
      const neg = raw.startsWith('!');
      const term = neg ? raw.slice(1) : raw;
      let v;
      if (term.startsWith('item:')) v = state.items.some((i) => i.id === term.slice(5));
      else if (term.startsWith('g:')) v = !!progress.flags[term.slice(2)];
      else v = !!state.flags[term];
      return neg ? !v : v;
    });
  }

  /* ===================================================================
     画面の要素
     =================================================================== */
  const $ = (id) => document.getElementById(id);
  const el = {
    stChapter: $('st-chapter'), stTime: $('st-time'), stVersion: $('st-version'),
    monitor: $('monitor'), main: $('main'), rec: $('rec'), splash: $('splash'), black: $('mon-black'),
    wipeHint: $('wipe-hint'), placeTag: $('place-tag'),
    timeline: $('timeline'), tlRange: $('tl-range'), tlLabel: $('tl-label'), tlMarks: $('tl-marks'), tlRemain: $('tl-remain'),
    wallWrap: $('wall-wrap'), wall: $('wall'),
    btnLive: $('btn-live'), btnPast: $('btn-past'), btnLog: $('btn-log'), btnItems: $('btn-items'),
    btnHistory: $('btn-history'), btnSkip: $('btn-skip'), btnAuto: $('btn-auto'), btnSave: $('btn-save'), btnMenu: $('btn-menu'),
    btnNote: $('btn-note'),
    textbox: $('textbox'), speaker: $('speaker'), message: $('message'), choices: $('choices'),
    panel: $('panel'), panelTitle: $('panel-title'), panelBody: $('panel-body'), panelClose: $('panel-close'),
    card: $('card'), cardSub: $('card-sub'), cardTitle: $('card-title'), cardNote: $('card-note'), cardButtons: $('card-buttons'),
    hotmenu: $('hotmenu'), flash: $('fx-flash'), toast: $('toast'), errors: $('errors'), debug: $('debug'),
    chapterList: $('chapter-list'),
  };
  const mainCtx = el.main.getContext('2d');

  function showScreen(name) {
    // ゲームの画面を離れたら、進行中の待ち（文字送り・間・時間切れ・スキップ）をすべて止める
    if (name !== 'game') {
      resetRun();
      // ゲームの画面の見た目（過去の色・映像だけの表示・揺れ）を、タイトルなどに持ち越さない
      document.body.classList.remove('cinema', 'mode-past', 'outside', 'shake');
    }
    // ブラウザの戻るボタンは、タイトル以外では、ゲームを閉じずに「ひとつ戻る」に使う
    if (name === 'title') releaseBack(); else trapBack();
    document.body.classList.remove('screen-title', 'screen-select', 'screen-game', 'screen-about');
    document.body.classList.add(`screen-${name}`);
    if (name === 'title') renderTitle();
    if (name === 'select') renderSelect();
    window.scrollTo(0, 0);
  }

  /* ===================================================================
     テキストウィンドウ
     =================================================================== */
  const typer = { item: null, i: 0, timer: null, auto: null, onDone: null, doneAt: 0 };
  // オート: 文を読み終えたころに、自動で次へ進む（選択肢・探索・パネルが出ているあいだは止まる）
  let autoPlay = false;
  let autoTimer = null;
  const AUTO_BASE_MS = 900;
  const AUTO_PER_CHAR_MS = 55;

  function isTyping() { return !!typer.item; }

  function showText(t, onDone) {
    stopTyping();
    typer.item = t;
    typer.i = 0;
    typer.onDone = onDone;
    el.textbox.classList.remove('waiting', 'hint');
    el.speaker.textContent = t.name ? `【${t.name}】` : '';
    el.message.textContent = '';
    history.push({ name: t.name, text: t.text });
    if (history.length > 200) history.shift();
    keepInView(el.textbox);

    const key = run.script && t.ln ? `${run.script.name}:${t.ln}` : null;
    const wasRead = key && progress.read[key];
    if (key) progress.read[key] = 1;
    if (skipping && wasRead) {
      el.message.textContent = t.text;
      el.textbox.classList.add('waiting');
      typer.auto = setTimeout(advanceText, 45);
      return;
    }
    if (skipping) setSkip(false);
    typer.timer = setInterval(() => {
      typer.i += 1;
      el.message.textContent = t.text.slice(0, typer.i);
      if (typer.i >= t.text.length) finishLine();
    }, TYPE_MS);
  }

  function finishLine() {
    if (typer.timer) clearInterval(typer.timer);
    typer.timer = null;
    typer.doneAt = performance.now();
    if (typer.item) el.message.textContent = typer.item.text;
    el.textbox.classList.add('waiting');
    scheduleAuto();
  }

  // 人の操作（クリック・タップ・Enter）で次へ。連打（二重クリック）で、読んでいない文を飛ばさないよう、
  // 文を出し切った直後の 0.16 秒は、次へ進める操作を受け付けない
  function userAdvance() {
    if (!typer.timer && performance.now() - typer.doneAt < 160) return;
    advanceText();
  }

  function scheduleAuto() {
    clearTimeout(autoTimer);
    autoTimer = null;
    if (!autoPlay || !typer.item) return;
    const wait = AUTO_BASE_MS + typer.item.text.length * AUTO_PER_CHAR_MS;
    const tick = () => {
      autoTimer = null;
      if (!autoPlay || !typer.item || typer.timer) return;
      // 履歴・手帳などを開いているあいだは待つ
      if (el.card.classList.contains('on') || el.panel.classList.contains('on')) { autoTimer = setTimeout(tick, 600); return; }
      advanceText();
    };
    autoTimer = setTimeout(tick, wait);
  }

  function setAuto(on, quiet) {
    autoPlay = on;
    el.btnAuto.classList.toggle('active', on);
    if (on) setSkip(false);
    else { clearTimeout(autoTimer); autoTimer = null; }
    progress.auto = on;
    saveProgress();
    if (on && typer.item && !typer.timer) scheduleAuto();
    if (!quiet) toast(on ? 'オート: 文章が自動で進みます' : 'オートをやめました');
  }

  function stopTyping() {
    if (typer.timer) clearInterval(typer.timer);
    if (typer.auto) clearTimeout(typer.auto);
    clearTimeout(autoTimer);
    autoTimer = null;
    typer.timer = null;
    typer.auto = null;
  }

  // クリック: 表示中なら全文を出す / 表示し終わっていたら次へ
  function advanceText() {
    if (el.card.classList.contains('on') || el.panel.classList.contains('on')) return;
    if (typer.timer) { finishLine(); return; }
    if (!typer.item) return;
    stopTyping();
    const done = typer.onDone;
    typer.item = null;
    typer.onDone = null;
    el.textbox.classList.remove('waiting');
    if (done) done();
  }

  // 本文を順に読む。本文の中の「@note 文」は、読む流れの中で手帳に書き留める
  function showLines(lines, onDone) {
    let i = 0;
    const next = () => {
      // 文章ではない行（手帳に書き留める行・演出の命令）は、表示せずにその場で実行する
      while (i < lines.length && (lines[i].note || lines[i].cmd)) {
        const ln = lines[i];
        if (ln.note) addNote(ln.note, ln.ln);
        else runBodyCommand(ln);
        i += 1;
      }
      if (i >= lines.length) { if (onDone) onDone(); return; }
      showText(lines[i++], next);
    };
    next();
  }

  // @look・@event の本文の中の演出の命令（@show・@hide・@sound・@fx）を実行する
  function runBodyCommand(ln) {
    try {
      OPS[ln.cmd]({ op: ln.cmd, arg: ln.arg, ln: ln.ln });
    } catch (e) {
      reportError(`${run.script ? run.script.name : ''} ${ln.ln} 行目: ${e.message}`);
    }
    renderStatic();
  }

  // 高さの低い画面で、文章や選択肢が画面の外に出たら、見えるところまで動かす
  function keepInView(elm) {
    if (!elm.getBoundingClientRect || !elm.scrollIntoView) return;
    const r = elm.getBoundingClientRect();
    if (r.bottom > window.innerHeight || r.top < 0) elm.scrollIntoView({ block: 'nearest' });
  }

  function showHint(text, name) {
    stopTyping();
    typer.item = null;
    el.textbox.classList.remove('waiting');
    el.textbox.classList.toggle('hint', !name);
    el.speaker.textContent = name ? `【${name}】` : '';
    el.message.textContent = text || '';
  }

  function setSkip(on) {
    skipping = on;
    if (on && autoPlay) setAuto(false, true);
    el.btnSkip.classList.toggle('active', on);
    if (on && typer.item && !typer.timer && !typer.auto) advanceText();
  }

  /* ===================================================================
     台本の実行
     =================================================================== */
  function go(label) {
    const idx = run.script.labels[label];
    if (idx === undefined) {
      reportError(`ラベル ${label} が見つかりません`);
      // 固まらないように、直前の選択肢があればそこへ戻し、なければ次の命令から続ける（プレイヤーには何も出さない）
      if (run.lastChoice) { run.choice = run.lastChoice; renderChoices(); armIdle(); checkExplore(); } else step();
      return;
    }
    run.pc = idx;
    run.choice = null;
    clearIdle();   // 場面が変わったら、時間切れの設定は解除する
    clearChoices();
    step();
  }

  /* ---------- 時間切れ（@idle） ----------
     - 「@idle ミリ秒 *ラベル」のあとの選択肢で、何も押されないまま時間がたつと、ラベルへ飛ぶ。
     - 押された（画面・キー）たびに、数え直す。文章を表示しているあいだや、パネルを開いているあいだは待つ。
     - 選択された・場面が変わった（go）・「@idle off」で解除する。セーブには入れない（ラベルの先頭から読み直すと、また設定される）。 */
  const idle = { spec: null, timer: null };
  function clearIdle() {
    clearTimeout(idle.timer);
    idle.timer = null;
    idle.spec = null;
  }
  function armIdle() {
    clearTimeout(idle.timer);
    idle.timer = null;
    if (!idle.spec || progress.noIdle || !run.choice) return;
    idle.timer = setTimeout(() => {
      idle.timer = null;
      if (!idle.spec || !run.choice) return;
      const busy = isTyping() || run.waitWipe
        || el.card.classList.contains('on') || el.panel.classList.contains('on') || el.hotmenu.classList.contains('on');
      if (busy) { armIdle(); return; }
      const label = idle.spec.label;
      run.choice = null;
      clearChoices();
      closeHotMenu();
      go(label);
    }, idle.spec.ms);
  }
  function setNoIdle(on) {
    progress.noIdle = !!on;
    saveProgress();
    if (on) { clearTimeout(idle.timer); idle.timer = null; } else armIdle();
  }

  function step() {
    // 台本の @goto が輪になっていても、タブごと固まらないように、一度に実行する命令の数に上限を置く
    let guard = 0;
    for (;;) {
      if (++guard > 20000) { reportError(`${run.script.name}: 命令が止まらないため、実行をやめました`); showHint('（進めなくなりました。メニューから、章を選び直してください）'); return; }
      const ins = run.script.code[run.pc++];
      if (!ins) { showHint('（台本の終わりです）'); return; }
      const op = OPS[ins.op];
      if (!op) { reportError(`${run.script.name} ${ins.ln} 行目: @${ins.op} という命令はありません`); continue; }
      let r;
      try {
        r = op(ins);
      } catch (e) {
        reportError(`${run.script.name} ${ins.ln} 行目: ${e.message}`);
        continue;
      }
      renderStatic();
      if (r === WAIT) return;
    }
  }

  // 「名前=値」の形の引数を取り出す
  function takeOpt(words, key) {
    const i = words.findIndex((w) => w.startsWith(`${key}=`));
    if (i < 0) return null;
    const v = words[i].slice(key.length + 1);
    words.splice(i, 1);
    return v;
  }
  function splitBar(s) { return s.split('|').map((x) => x.trim()); }
  function words(s) { return s.split(/\s+/).filter(Boolean); }
  function needCam(id) {
    if (!state.cams[id]) throw new Error(`カメラ ${id} がありません（data/cameras.js）`);
    return state.cams[id];
  }
  function parseStill(s) {
    // 「CAM-07 6/02:20 img:パス woman@100 ...」
    const w = words(s);
    return Object.assign({ cam: w[0], at: parseTime(w[1]) }, R.parseScene(w.slice(2).join(' ')));
  }

  const OPS = {
    label(ins) {
      state.label = ins.name;
      checkpoint = clone(state);
      labelSnaps[ins.name] = checkpoint;
      autosave();
      renderDebug();
    },
    text(ins) { showText(ins, step); return WAIT; },

    /* ----- 流れ ----- */
    choice(ins) {
      run.choice = ins;
      run.lastChoice = ins;
      renderChoices();
      armIdle();
      checkExplore();
      return WAIT;
    },
    // @idle ミリ秒 *ラベル: 直後の選択肢で、何も押されないまま時間がたったら、ラベルへ飛ぶ。@idle off で解除
    idle(ins) {
      const a = ins.arg.trim();
      if (a === 'off') { clearIdle(); return; }
      const m = a.match(/^(\d+)\s+(\*\S+)$/);
      if (!m) throw new Error('@idle は「@idle ミリ秒 *ラベル」か「@idle off」で書いてください');
      idle.spec = { ms: +m[1], label: m[2] };
    },
    goto(ins) { jumpInline(ins.arg.trim()); },
    if(ins) {
      const m = ins.arg.match(/^(.*?)\s*->\s*(\*\S+)$/);
      if (!m) throw new Error('@if は「@if 条件 -> *ラベル」で書いてください');
      if (test(m[1])) jumpInline(m[2]);
    },
    set(ins) { words(ins.arg).forEach((f) => { state.flags[f] = true; }); },
    unset(ins) { words(ins.arg).forEach((f) => { delete state.flags[f]; }); },
    gset(ins) { words(ins.arg).forEach((f) => { progress.flags[f] = true; }); saveProgress(); },
    gunset(ins) { words(ins.arg).forEach((f) => { delete progress.flags[f]; }); saveProgress(); },
    // 既読を飛ばしているあいだは、間を短くする（読み返しで間延びさせない）
    // （待ちの途中で章を離れたら止める。run.pauseTimer は resetRun で消す）
    pause(ins) {
      const ms = +ins.arg || 800;
      clearTimeout(run.pauseTimer);
      run.pauseTimer = setTimeout(() => { run.pauseTimer = null; step(); }, skipping ? Math.min(ms, 120) : ms);
      return WAIT;
    },

    /* ----- 時刻・モニター ----- */
    time(ins) {
      if (ins.arg.trim() === '-') { state.clockHidden = true; return; }
      state.clockHidden = false;
      state.now = parseTime(ins.arg);
      if (state.pastAt !== null) clampPast();
    },
    pasttime(ins) { state.pastAt = parseTime(ins.arg); },
    // @settime 名前 [時刻]: 時刻を覚える（書かなければ、いま過去で見ている時刻）。「名前+3」で使う
    settime(ins) {
      const w = words(ins.arg);
      if (!/^[A-Za-z_]\w*$/.test(w[0] || '')) throw new Error('@settime は「@settime 名前 [日/時:分]」で書いてください');
      const at = w[1] ? parseTime(w[1]) : state.pastAt;
      if (at === null) throw new Error('@settime: 過去の時刻がまだありません');
      state.vars[w[0]] = at;
    },
    cam(ins) {
      const [id, mode] = words(ins.arg);
      needCam(id);
      state.cam = id;
      if (mode) state.mode = mode;
      glitch = 8;
    },
    mode(ins) { state.mode = ins.arg.trim(); glitch = 8; },
    // @cinema on|off: 予告のあいだだけ、画面の枠を隠して、映像だけを見せる
    cinema(ins) { state.cinema = ins.arg.trim() !== 'off'; },
    power(ins) { state.power = ins.arg.trim() !== 'off'; if (!state.power) state.mode = 'live'; },
    open(ins) {
      const w = words(ins.arg);
      Object.keys(state.cams).forEach((id) => { state.cams[id].open = w.includes('all') || w.includes(id); });
    },
    cameras(ins) {
      const w = words(ins.arg);
      if (w.includes('none')) state.wall = [];
      else state.wall = w.includes('all') ? Observer.cameraOrder.slice() : w.filter((id) => needCam(id));
      buildWall();
    },
    status(ins) {
      const w = words(ins.arg);
      const c = needCam(w[0]);
      c.status = w[1] || 'ok';
      c.statusText = w.slice(2).join(' ');
    },
    feed(ins) {
      const w = words(ins.arg);
      const sc = R.parseScene(w.slice(1).join(' '));
      const c = needCam(w[0]);
      c.actors = sc.actors;
      c.img = sc.img;
    },
    look(ins) {
      const w = words(ins.arg);
      const c = needCam(w[0]);
      if (w[1] === 'off') { c.look = null; return; }
      c.look = { flag: takeOpt(w, 'flag'), body: ins.body, seen: false };
    },
    event(ins) {
      const [head, actors] = splitBar(ins.arg);
      const w = words(head);
      needCam(w[0]);
      const flag = takeOpt(w, 'flag');
      // noise: その時間帯の過去は、ノイズで映らない（本文は読める）
      const ni = w.indexOf('noise');
      const noise = ni >= 0;
      if (noise) w.splice(ni, 1);
      const [from, to] = parseRange(w[1]);
      const sc = R.parseScene(actors || '');
      state.events.push({ cam: w[0], from, to, flag, noise, actors: sc.actors, img: sc.img, body: ins.body, seen: false });
    },
    noevents(ins) {
      const id = ins.arg.trim();
      state.events = id === 'all' ? [] : state.events.filter((e) => e.cam !== id);
    },
    hotspot(ins) {
      const parts = splitBar(ins.arg);
      const head = parts.shift();
      const m = head.match(/^(\S+)\s+(\S+)\s+(\d+),(\d+)\s+(.+?)(?:\s+if\s+(.+))?$/);
      if (!m) throw new Error('@hotspot は「@hotspot カメラ 時間帯|live x,y 名前 [if 条件] | 動作=*ラベル」で書いてください');
      needCam(m[1]);
      const range = m[2] === 'live' ? null : parseRange(m[2]);
      const actions = parts.map((p) => {
        const a = p.match(/^(.+?)=(\*\S+)$/);
        if (!a) throw new Error(`動作「${p}」は「動作=*ラベル」で書いてください`);
        return { text: a[1], target: a[2] };
      });
      // 同じカメラ・同じ名前・同じ時間帯の機器は、書き直しとして置き換える（時間帯が違えば、別の機器として並ぶ）
      const sameRange = (h) => String(h.range) === String(range);
      state.hotspots = state.hotspots.filter((h) => !(h.cam === m[1] && h.name === m[5] && sameRange(h)));
      state.hotspots.push({ cam: m[1], range, x: +m[3], y: +m[4], name: m[5], cond: m[6] || '', actions });
    },
    nohotspots(ins) {
      const id = ins.arg.trim();
      state.hotspots = !id || id === 'all' ? [] : state.hotspots.filter((h) => h.cam !== id && h.name !== id);
    },
    burn(ins) {
      const a = ins.arg.trim();
      const w = words(a);
      if (a === 'here') {
        // 焼き付くのは、干渉したカメラの、その時間だけ（ほかのカメラの同じ時刻は、そのまま見られる）
        if (state.lastHotspot && state.lastHotspot.range) state.burned.push([...state.lastHotspot.range, state.lastHotspot.cam]);
      } else if (w[0] === 'now') {
        // @burn now [幅]: いま過去で見ている時刻（幅を書くと、その前後の分も。書かなければ、その 1 分だけ）
        if (state.pastAt === null) throw new Error('@burn now: 過去の時刻がまだありません');
        const k = w[1] !== undefined ? +w[1] : 0;
        state.burned.push([state.pastAt - k, state.pastAt + k, state.cam]);
      } else {
        // @burn カメラ 時間帯（例: @burn CAM-04 3/03:00-3/03:00）。カメラを書かなければ、全カメラ
        const cam = /^CAM-[0-9]+$/.test(w[0]) ? w.shift() : null;
        const range = parseRange(w.join(' '));
        state.burned.push(cam ? [...range, cam] : range);
      }
    },
    relay(ins) {
      const [id, caption, still] = splitBar(ins.arg);
      if (id === 'off') { state.relay = null; return; }
      needCam(id);
      state.relay = { cam: id, caption: caption || '', still: parseStill(still || '') };
    },

    /* ----- アイテム・ログ ----- */
    item(ins) {
      const [head, desc, still] = splitBar(ins.arg);
      const w = words(head);
      const id = w.shift();
      state.items = state.items.filter((i) => i.id !== id);
      const it = { id, name: w.join(' '), desc: desc || '' };
      if (still) it.still = parseStill(still.replace(/^still=/, ''));
      state.items.push(it);
      toast(`アイテム「${it.name}」を手に入れた`);
    },
    drop(ins) { state.items = state.items.filter((i) => i.id !== ins.arg.trim()); },
    log(ins) {
      const [kind, text] = splitBar(ins.arg);
      state.logs.push({ kind, text: text || '' });
    },
    note(ins) { addNote(ins.arg, ins.ln); },
    // @strike キー …: @note #キー で書いた手帳の行に、取り消し線を引く（その行がなければ、何もしない）
    strike(ins) { words(ins.arg).forEach((k) => strikeNote(k.replace(/^#/, ''))); },

    /* ----- 場面・演出 ----- */
    outside(ins) {
      const [head, actors] = splitBar(ins.arg);
      const w = words(head);
      const sc = R.parseScene(actors || '');
      state.outside = { bg: w[0], place: w.slice(1).join(' '), actors: sc.actors, img: sc.img };
      state.portraits = {};   // 場所が変わったら、立ち絵は消す
    },
    inside() { state.outside = null; state.portraits = {}; },
    fx(ins) {
      const w = words(ins.arg);
      const name = w[0];
      if (name === 'flash') { el.flash.classList.remove('on'); void el.flash.offsetWidth; el.flash.classList.add('on'); }
      else if (name === 'shake') { document.body.classList.add('shake'); setTimeout(() => document.body.classList.remove('shake'), 520); }
      else if (name === 'glitch') glitch = 14;
      else if (name === 'splash') state.splash = true;
      else if (name === 'clean') state.splash = false;
      else if (name === 'black') state.black = 'black';
      else if (name === 'white') state.black = 'white';
      else if (name === 'unblack') state.black = null;
      else if (name === 'lamp') { lamps[w[1]] = performance.now() + 1600; }
      else throw new Error(`@fx ${name} という演出はありません`);
    },
    sound(ins) { Observer.audio.play(ins.arg.trim()); },
    // 立ち絵: @show 名前 [表情] [left]  /  @hide [名前|all]
    show(ins) {
      const w = words(ins.arg);
      if (!Observer.characters[w[0]]) throw new Error(`人物 ${w[0]} が data/characters.js にありません`);
      const side = w.includes('left') ? 'left' : 'right';
      const face = w.slice(1).find((x) => x !== 'left' && x !== 'right') || 'normal';
      state.portraits[side] = { name: w[0], face };
    },
    hide(ins) {
      const name = ins.arg.trim();
      Object.keys(state.portraits).forEach((side) => {
        if (!name || name === 'all' || state.portraits[side].name === name) delete state.portraits[side];
      });
    },
    wipe(ins) {
      run.waitWipe = true;
      el.wipeHint.textContent = ins.arg || '画面をなぞって拭く';
      el.wipeHint.classList.add('on');
      el.monitor.classList.add('wiping');
      renderLocks();
      showHint('モニターの上を、指（マウス）で左右になぞる。');
      return WAIT;
    },
    title(ins) {
      const [sub, title, note] = splitBar(ins.arg);
      showCard({ sub, title: title || '', note, kind: '', onClick: () => { hideCard(); step(); } });
      return WAIT;
    },
    ending(ins) {
      const [head, retry, retryText] = splitBar(ins.arg);
      const w = words(head);
      const kind = w[0];
      const title = w.slice(1).join(' ');
      progress.endings[title] = true;
      saveProgress();
      const sub = { bad: 'BAD END', normal: '通常解決', true: '真解決' }[kind] || 'END';
      const buttons = [];
      if (retry) buttons.push({ text: retryText || 'もう一度', fn: () => { hideCard(); retryFrom(retry); } });
      // 真解決のあとは、集めた結末の記録へ（全章の真解決を終えた人への、見返す場所）
      if (kind === 'true') buttons.push({ text: '記録を見る', fn: () => { hideCard(); showScreen('select'); openRecord(); } });
      buttons.push({ text: '章を選ぶ', fn: () => { hideCard(); showScreen('select'); } });
      showCard({ sub, title, kind, buttons });
      return WAIT;
    },
    // @miss 文 | *やり直すラベル [| ボタンの文]: 失敗のカード。エンディングには数えない
    miss(ins) {
      const [title, retry, retryText] = splitBar(ins.arg);
      if (!retry) throw new Error('@miss は「@miss 文 | *ラベル [| ボタンの文]」で書いてください');
      showCard({
        sub: 'やり直し', title, kind: 'bad',
        buttons: [{ text: retryText || 'もう一度', fn: () => { hideCard(); retryFrom(retry); } }],
      });
      return WAIT;
    },

    /* ----- 章 ----- */
    chapter(ins) { state.chapter = +ins.arg; },
    result(ins) {
      const [no, kind] = words(ins.arg);
      const c = progress.chapters[no] = progress.chapters[no] || {};
      c.normal = true;
      if (kind === 'true') {
        c.true = true;
        // 最後の章の真解決では、全章ぶんの手帳を残す（記録の画面から読み返せる）
        if (+no === 5) progress.chapterNotes[5] = clone(state.notebook);
      } else progress.chapterNotes[no] = clone(state.notebook.filter((n) => n.ch === +no));
      saveProgress();
    },
    trueready(ins) {
      const no = words(ins.arg)[0];
      const c = progress.chapters[no] = progress.chapters[no] || {};
      c.ready = true;
      saveProgress();
    },
    unlock(ins) { progress.unlocked[words(ins.arg)[0]] = true; saveProgress(); },
    next(ins) {
      const no = +ins.arg;
      clearSave();
      if (!startChapter(no, true)) {
        showCard({
          sub: `第${no}章`, title: '準備中です', kind: '',
          buttons: [{ text: '章を選ぶ', fn: () => { hideCard(); showScreen('select'); } }],
        });
      }
      return WAIT;
    },
    select() { clearSave(); showScreen('select'); return WAIT; },
  };

  // バッドエンドから、ラベルに入ったときの状態に戻してやり直す
  function retryFrom(label) {
    if (labelSnaps[label]) state = Object.assign(newWorld(), clone(labelSnaps[label]));
    run.waitWipe = false;
    run.reading = null;
    buildWall();
    go(label);
  }

  // @goto・@if の飛び先へ（実行は step のループがそのまま続ける）
  function jumpInline(label) {
    const idx = run.script.labels[label];
    if (idx === undefined) throw new Error(`ラベル ${label} が見つかりません`);
    run.pc = idx;
  }

  /* ===================================================================
     選択肢と探索
     - @choice で止まっている間は、カメラを切り替えたり、過去の時刻を動かしたりできる。
     - そのとき、見たことのない @look・@event の本文があれば読む。
     =================================================================== */
  function clearChoices() { el.choices.innerHTML = ''; }

  function renderChoices() {
    clearChoices();
    if (!run.choice) return;
    const opts = run.choice.options.filter((o) => test(o.cond));
    // 問いかけの文がない選択肢では、直前の文を残す（何に答えるのかが見えるように）
    const last = history[history.length - 1];
    if (run.choice.arg || !opts.length || !last) showHint(run.choice.arg || 'モニターを見て回ろう。');
    else showHint(last.text, last.name);
    const shown = run.choice;
    const shownAt = performance.now();
    opts.forEach((o) => {
      const b = document.createElement('button');
      b.textContent = o.text;
      b.addEventListener('click', () => {
        // 連打（二重クリック）で、続けて出た次の選択肢まで押してしまわないよう、
        // 出た直後の 0.2 秒と、すでに別の場面へ進んだあとの押下は受け付けない
        if (run.choice !== shown || performance.now() - shownAt < 200) return;
        run.choice = null;
        clearChoices();
        go(o.target);
      });
      el.choices.appendChild(b);
    });
    if (opts.length) keepInView(el.choices);
    renderWallMarks();
  }

  function exploring() { return !!run.choice && !isTyping() && !run.waitWipe; }

  function activeEvent(cam, at) {
    for (let i = state.events.length - 1; i >= 0; i--) {
      const e = state.events[i];
      if (e.cam === cam && e.from <= at && at <= e.to) return e;
    }
    return null;
  }

  // カメラごとに調べる（古いセーブのように、カメラが書かれていない焼き付きは、全カメラに効く）
  function isBurned(at, cam) { return state.burned.some(([a, b, c]) => a <= at && at <= b && (!c || !cam || c === cam)); }

  // いま映っているもので、まだ読んでいない @look・@event
  function unreadHere() {
    const cam = state.cams[state.cam];
    if (state.mode === 'live') return cam.look && !cam.look.seen && cam.status === 'ok' ? cam.look : null;
    if (!cam.open || state.pastAt === null) return null;
    const e = activeEvent(state.cam, state.pastAt);
    if (e) addMark(state.cam, e.from);
    return e && !e.seen ? e : null;
  }

  function checkExplore() {
    if (!exploring() || state.outside) return;
    const target = unreadHere();
    if (!target) return;
    // 読み終えたときに「見た」にする（途中でカメラを切り替えたら、あとで読み直せる）
    const done = () => {
      target.seen = true;
      if (target.flag) state.flags[target.flag] = true;
    };
    if (!target.body.length) { done(); renderChoices(); return; }
    clearChoices();
    run.reading = target;
    run.portraitsBefore = clone(state.portraits);   // 途中で打ち切ったら、本文の中で出した立ち絵を元に戻す
    showLines(target.body, () => { run.reading = null; run.portraitsBefore = null; done(); renderChoices(); checkExplore(); });
  }

  // 探索の文章を読んでいる途中で、映すものが変わったら、その文章を打ち切る
  function abortReading() {
    if (!run.reading) return;
    stopTyping();
    typer.item = null;
    typer.onDone = null;
    run.reading = null;
    if (run.portraitsBefore) { state.portraits = run.portraitsBefore; run.portraitsBefore = null; renderStatic(); }
    renderChoices();
  }

  function addMark(cam, at) {
    const list = state.marks[cam] = state.marks[cam] || [];
    if (!list.includes(at)) { list.push(at); renderTimeline(); }
  }

  /* ===================================================================
     カメラ・映像モード・タイムライン
     =================================================================== */
  function switchCam(id) {
    if (cameraLocked()) return;
    if (state.cam === id) return;
    abortReading();
    state.cam = id;
    glitch = 8;
    Observer.audio.play('glitch');
    renderStatic();
    checkExplore();
  }

  function switchMode(mode) {
    if (cameraLocked() || state.mode === mode) return;
    if (mode === 'past' && !state.power) return;
    abortReading();
    state.mode = mode;
    if (mode === 'past') {
      if (state.pastAt === null) state.pastAt = state.now - 30;
      clampPast();
    }
    glitch = 8;
    Observer.audio.play('glitch');
    renderStatic();
    checkExplore();
  }

  // 時刻つまみの左端。さかのぼれるのは 72 時間前までだが、つまみの幅は「過去が開いているカメラの、
  // いちばん早い出来事の 1 時間前」までにしぼる（30 分戻すだけで、つまみがほとんど動かないのを防ぐ）
  function pastMin() {
    const limit = state.now - PAST_WINDOW;
    const froms = state.events.filter((e) => state.cams[e.cam] && state.cams[e.cam].open && e.to >= limit).map((e) => e.from);
    if (!froms.length) return limit;
    return Math.max(limit, Math.min(...froms, state.pastAt === null ? state.now : state.pastAt) - 60);
  }

  function clampPast() {
    state.pastAt = Math.max(pastMin(), Math.min(state.now, state.pastAt));
  }

  let exploreTimer = null;
  function setPast(at) {
    state.pastAt = at;
    clampPast();
    if (run.reading && unreadHereAt(state.pastAt) !== run.reading) abortReading();
    renderTimeline();
    clearTimeout(exploreTimer);
    exploreTimer = setTimeout(checkExplore, 220);
  }
  function unreadHereAt(at) { return state.mode === 'past' ? activeEvent(state.cam, at) : null; }

  function renderTimeline() {
    const on = state.power;
    el.timeline.classList.toggle('enabled', on);
    if (!on || state.pastAt === null) return;
    const min = pastMin();
    const span = Math.max(1, state.now - min);
    const pos = (m) => `${((m - min) / span) * 100}%`;
    el.tlRange.min = min;
    el.tlRange.max = state.now;
    el.tlRange.value = state.pastAt;
    const ago = state.now - state.pastAt;
    el.tlLabel.textContent = `${fmtTime(state.pastAt)}（${Math.floor(ago / 60)}時間${ago % 60}分前）`;
    el.tlRemain.textContent = isBurned(state.pastAt, state.cam) ? '動かせない時間' : '';
    el.tlMarks.innerHTML = '';
    // 焼き付いた時間帯（白い帯）
    state.burned.forEach(([a, b, c]) => {
      if (b < min || a > state.now || (c && c !== state.cam)) return;
      const s = document.createElement('i');
      s.className = 'band';
      s.style.left = pos(Math.max(a, min));
      s.style.width = `${Math.max(0.6, ((Math.min(b, state.now) - Math.max(a, min) + 1) / span) * 100)}%`;
      s.title = `動かせない時間 ${fmtTime(a)}〜${fmtTime(b)}`;
      el.tlMarks.appendChild(s);
    });
    // このカメラの出来事の印（見たものは塗り、まだ見ていないものは白抜き）
    const seenMarks = state.marks[state.cam] || [];
    const cam = state.cams[state.cam];
    const unseen = cam && cam.open ? state.events.filter((e) => e.cam === state.cam && !e.seen && (e.body.length || e.flag)).map((e) => e.from) : [];
    [...new Set([...seenMarks, ...unseen])].forEach((m) => {
      if (m < min || m > state.now) return;
      const s = document.createElement('span');
      s.style.left = pos(m);
      s.title = fmtTime(m);
      if (!seenMarks.includes(m)) s.classList.add('unseen');
      if (isBurned(m, state.cam)) s.classList.add('burned');
      s.addEventListener('click', () => setPast(m));
      el.tlMarks.appendChild(s);
    });
  }

  /* ---------- モニター壁 ----------
     - カメラの名前だけのボタンを並べる（映像は出さない。スマホでも場所をとらない）
     - 監視室の外の場面・画面を拭くあいだなど、カメラを切り替えられないときは、消さずにグレーにする */
  const tiles = [];
  function buildWall() {
    el.wall.innerHTML = '';
    tiles.length = 0;
    state.wall.forEach((id) => {
      const b = document.createElement('button');
      b.className = 'tile';
      const num = document.createElement('span');
      num.className = 'tnum';
      num.textContent = id.replace('CAM-', '');
      const lab = document.createElement('span');
      lab.className = 'tlabel';
      lab.textContent = Observer.cameras[id].place;
      b.appendChild(num); b.appendChild(lab);
      b.addEventListener('click', () => switchCam(id));
      el.wall.appendChild(b);
      tiles.push({ id, btn: b });
    });
    el.wallWrap.classList.toggle('empty', !state.wall.length);
    renderWallMarks();
  }

  // まだ見ていないものがあるカメラの枠に、印を付ける（たたんで見えないときは、ひろげるボタンにも）
  function hasUnseen(id) {
    const c = state.cams[id];
    if (!c || !run.choice) return false;
    if (state.mode === 'live') return !!(c.look && !c.look.seen && c.status === 'ok');
    const limit = state.now - PAST_WINDOW;
    return c.open && state.events.some((e) => e.cam === id && !e.seen && (e.body.length || e.flag) && e.to >= limit && e.from <= state.now);
  }
  function renderWallMarks() {
    tiles.forEach((t) => t.btn.classList.toggle('new', hasUnseen(t.id)));
  }

  // カメラを切り替えられないあいだ（監視室の外の場面・画面を拭くあいだ）は、モニター壁と「現在／過去」をグレーにする
  function cameraLocked() { return !!state.outside || run.waitWipe; }
  function renderLocks() {
    const locked = cameraLocked();
    el.wall.classList.toggle('locked', locked);
    tiles.forEach((t) => { t.btn.disabled = locked; });
    el.btnLive.disabled = locked;
    el.btnPast.disabled = locked || !state.power;
  }

  /* ---------- 状態が変わったときに、画面の文字やボタンを合わせる ---------- */
  function renderStatic() {
    const ch = Observer.chapters.find((c) => c.no === state.chapter);
    el.stChapter.textContent = ch ? `第${ch.no}章　${ch.title}` : '';
    el.stTime.textContent = state.clockHidden ? '' : fmtTime(state.now);
    document.body.classList.toggle('mode-past', state.mode === 'past' && !state.outside);
    document.body.classList.toggle('outside', !!state.outside);
    document.body.classList.toggle('cinema', !!state.cinema);
    el.rec.textContent = state.mode === 'past' ? '◀◀ PLAYBACK' : '● REC';
    el.btnLive.classList.toggle('active', state.mode === 'live');
    el.btnPast.classList.toggle('active', state.mode === 'past');
    el.btnItems.textContent = state.items.length ? `アイテム(${state.items.length})` : 'アイテム';
    el.btnNote.classList.toggle('new', state.notebook.some((n) => n.unread));
    el.placeTag.textContent = state.outside ? state.outside.place : '';
    el.placeTag.classList.toggle('on', !!(state.outside && state.outside.place));
    renderWallMarks();
    renderLocks();
    el.monitor.classList.toggle('has-mic', !!Observer.cameras[state.cam].mic && !state.outside);
    el.splash.classList.toggle('on', state.splash);
    el.black.classList.toggle('on', !!state.black);
    el.black.classList.toggle('white', state.black === 'white');
    tiles.forEach((t) => t.btn.classList.toggle('active', t.id === state.cam && !state.outside));
    renderTimeline();
    renderPortraits();
  }

  /* ---------- 立ち絵 ----------
     - 絵のファイルがまだないときは、何も出さない（デバッグのときだけ名前の枠を出す） */
  const portraitEls = {};
  // 立ち絵の高さを、テキストウィンドウより上の空きに収まるように合わせる（CSS の高さが上限）
  function fitPortraits() {
    const talk = document.querySelector('.talk');
    if (!talk) return;
    const room = document.querySelector('.monitor-frame').getBoundingClientRect().top;
    const space = talk.getBoundingClientRect().top - room;
    ['left', 'right'].forEach((side) => {
      const box = $(`portrait-${side}`);
      box.style.height = '';
      const css = box.getBoundingClientRect().height;
      const overlap = window.innerWidth < 600 ? 50 : 70;
      box.style.height = `${Math.max(120, Math.min(css, space + overlap - 4))}px`;
    });
  }
  window.addEventListener('resize', fitPortraits);

  function renderPortraits() {
    fitPortraits();
    ['right', 'left'].forEach((side) => {
      const box = $(`portrait-${side}`);
      const p = state.portraits[side];
      const key = p ? `${p.name}/${p.face}` : '';
      if (portraitEls[side] === key) return;
      const sameName = !!(p && portraitEls[side] && portraitEls[side].split('/')[0] === p.name && box.classList.contains('on'));
      portraitEls[side] = key;
      if (!sameName) { box.innerHTML = ''; box.classList.remove('on'); }
      if (!p) return;
      const ch = Observer.characters[p.name];
      // その表情の絵がまだなければ、normal → smile の順に、同じ人物のふだんの絵で代わりに出す
      // （密会の場面などの特別な表情は、代わりには使わない）
      const files = [ch.faces[p.face], ch.faces.normal, ch.faces.smile].filter((f, i, a) => f && a.indexOf(f) === i);
      const img = document.createElement('img');
      img.alt = p.name;
      let n = 0;
      // 読み込めてから入れ替える（同じ人物なら、前の表情を出したまま待つ）
      img.onload = () => {
        if (portraitEls[side] !== key) return;
        if (sameName) box.replaceChildren(img);
        box.classList.add('on');
      };
      img.onerror = () => {
        n += 1;
        if (n < files.length) { img.src = `assets/${files[n]}`; return; }
        if (!DEBUG) return;
        box.innerHTML = '';
        box.appendChild(div('portrait-missing', `${p.name}（${p.face}）
${files[0]}`));
        box.classList.add('on');
      };
      img.src = `assets/${files[0]}`;
      if (!sameName) box.appendChild(img);
    });
  }

  /* ===================================================================
     映像を組み立てる
     =================================================================== */
  function liveView(id, small) {
    const c = state.cams[id];
    const def = Observer.cameras[id];
    const tint = R.TINTS.live;
    if (state.relay && state.relay.cam === id) {
      const s = state.relay.still;
      return {
        kind: 'feed', bg: Observer.cameras[s.cam] ? Observer.cameras[s.cam].bg : 'dark', actors: s.actors,
        img: s.img, bgimg: Observer.cameras[s.cam] ? Observer.cameras[s.cam].bgimg : null,
        tint: R.TINTS.past, still: true,
        caption: ['― INCOMING ―', state.relay.caption],
      };
    }
    if (c.status === 'broken') return { kind: 'nosignal', status: c.statusText || 'NO SIGNAL', tint, lamp: lampOn(id) };
    if (c.status === 'paused') return { kind: 'paused', status: c.statusText || '停止中', tint };
    const hotspots = small || !exploring() ? [] : state.hotspots.filter((h) => h.cam === id && !h.range && test(h.cond));
    return {
      kind: 'feed', bg: def.bg, bgimg: def.bgimg, img: c.img, actors: c.actors, tint, hotspots, lamp: lampOn(id),
      caption: [`${id}  ${def.place}`, `LIVE  ${fmtTime(state.now)}`],
    };
  }

  function pastView(id) {
    const c = state.cams[id];
    const def = Observer.cameras[id];
    const tint = R.TINTS.past;
    const caption = [`${id}  ${def.place}`, `PAST  ${fmtTime(state.pastAt)}`];
    if (!c.open) return { kind: 'closed', tint, caption };
    const e = activeEvent(id, state.pastAt);
    if (e && e.noise) return { kind: 'closed', tint, caption };
    const burned = isBurned(state.pastAt, id);
    const hotspots = !exploring() || burned ? [] : state.hotspots.filter((h) => h.cam === id && h.range
      && h.range[0] <= state.pastAt && state.pastAt <= h.range[1] && test(h.cond));
    return { kind: 'feed', bg: def.bg, bgimg: def.bgimg, img: e ? e.img : null, actors: e ? e.actors : [], tint, burned, hotspots, caption };
  }

  function mainView() {
    if (state.outside) {
      // 場面の絵がないときは、同じ背景の種類のカメラの背景の絵を使う（監視室なら CAM-00 の絵）
      const same = Observer.cameraOrder.map((id) => Observer.cameras[id]).find((c) => c.bg === state.outside.bg && c.bgimg);
      return {
        kind: 'feed', bg: state.outside.bg, img: state.outside.img, bgimg: same ? same.bgimg : null,
        actors: state.outside.actors, tint: R.TINTS.outside, caption: null,
      };
    }
    return state.mode === 'past' ? pastView(state.cam) : liveView(state.cam, false);
  }

  function lampOn(id) { return (lamps[id] || 0) > performance.now(); }

  /* ---------- 描画の繰り返し ---------- */
  let lastFrame = 0;
  let currentHotspots = [];
  function loop(now) {
    requestAnimationFrame(loop);
    if (!document.body.classList.contains('screen-game')) return;
    if (now - lastFrame < 33) return;
    lastFrame = now;
    const t = now / 1000;
    const view = mainView();
    currentHotspots = view.hotspots || [];
    view.bigCaption = el.main.clientWidth < 560;
    R.render(mainCtx, view, t, false);
    // 監視室の外の場面は、カメラ越しではなく八島の目で見ているので、ノイズをかけない（切り替えの一瞬だけ乱す）
    if (!state.outside || glitch > 0) R.postEffects(mainCtx, el.main, view.tint, glitch);
    if (glitch > 0) glitch -= 1;
  }

  /* ===================================================================
     モニターへの操作（干渉する機器を押す・画面を拭く）
     =================================================================== */
  function monitorPoint(e) {
    const r = el.main.getBoundingClientRect();
    return { x: ((e.clientX - r.left) / r.width) * R.W, y: ((e.clientY - r.top) / r.height) * R.H };
  }

  function onMonitorClick(e) {
    if (run.waitWipe || !exploring()) return;
    const p = monitorPoint(e);
    const hit = currentHotspots.find((h) => Math.hypot(h.x - p.x, h.y - p.y) < 22);
    if (hit) openHotMenu(hit, e.clientX, e.clientY); else closeHotMenu();
  }

  let hotMenuAt = 0;
  function openHotMenu(h, cx, cy) {
    const m = el.hotmenu;
    hotMenuAt = performance.now();
    m.innerHTML = '';
    const title = document.createElement('div');
    title.className = 'hm-title';
    title.textContent = h.name;
    m.appendChild(title);
    h.actions.forEach((a) => {
      const b = document.createElement('button');
      b.textContent = a.text;
      b.addEventListener('click', () => {
        // 機器を二度たたいた指が、出たばかりの動作の項目に当たらないようにする。場面が進んだあとの押下も受け付けない
        if (!run.choice || performance.now() - hotMenuAt < 250) return;
        closeHotMenu();
        state.lastHotspot = h;
        run.choice = null;
        clearChoices();
        go(a.target);
      });
      m.appendChild(b);
    });
    const cancel = document.createElement('button');
    cancel.textContent = 'やめる';
    cancel.addEventListener('click', closeHotMenu);
    m.appendChild(cancel);
    m.classList.add('on');
    const w = m.offsetWidth;
    const hgt = m.offsetHeight;
    m.style.left = `${Math.max(8, Math.min(window.innerWidth - w - 8, cx - w / 2))}px`;
    m.style.top = `${Math.max(8, Math.min(window.innerHeight - hgt - 8, cy + 10))}px`;
  }
  function closeHotMenu() { el.hotmenu.classList.remove('on'); }

  // 画面を拭く: なぞった長さが画面の幅の 1.5 倍を超えたら終わり
  const wipe = { down: false, x: 0, y: 0, dist: 0 };
  function wipeStart(e) { if (!run.waitWipe) return; wipe.down = true; wipe.x = e.clientX; wipe.y = e.clientY; }
  function wipeMove(e) {
    if (!run.waitWipe || !wipe.down) return;
    // マウスのボタンを、画面の外などで離してしまったら、そこで終わりにする
    if (e.pointerType === 'mouse' && e.buttons === 0) { wipe.down = false; return; }
    wipe.dist += Math.hypot(e.clientX - wipe.x, e.clientY - wipe.y);
    wipe.x = e.clientX; wipe.y = e.clientY;
    el.splash.style.opacity = String(Math.max(0, 1 - wipe.dist / (el.main.clientWidth * 1.5)));
    if (wipe.dist > el.main.clientWidth * 1.5) {
      run.waitWipe = false;
      wipe.down = false;
      wipe.dist = 0;
      state.splash = false;
      el.splash.style.opacity = '';
      el.wipeHint.classList.remove('on');
      el.monitor.classList.remove('wiping');
      renderLocks();
      showHint('');
      step();
    }
  }
  function wipeEnd() { wipe.down = false; }

  /* ===================================================================
     重ねて出す画面（ログ・アイテム・履歴・メニュー・カード）
     =================================================================== */
  function openPanel(title, fill) {
    el.panelTitle.textContent = title;
    el.panelBody.innerHTML = '';
    el.panelBody.className = 'panel-body';
    fill(el.panelBody);
    el.panel.classList.add('on');
  }
  function closePanel() {
    el.panel.classList.remove('on');
    // スキップ中にパネルを開いて、文が出たまま止まっていたら、閉じたところから再開する
    if (skipping && typer.item && !typer.timer) { clearTimeout(typer.auto); typer.auto = setTimeout(advanceText, 45); }
  }
  function div(cls, text) { const d = document.createElement('div'); if (cls) d.className = cls; if (text !== undefined) d.textContent = text; return d; }

  function openLog() {
    openPanel('ログ', (b) => {
      if (!state.logs.length) b.appendChild(div('empty', '記録はありません。'));
      state.logs.forEach((l) => {
        const d = div('logline');
        d.appendChild(Object.assign(document.createElement('span'), { className: 'kind', textContent: `［${l.kind}］` }));
        d.appendChild(document.createTextNode(l.text));
        b.appendChild(d);
      });
    });
  }

  function openItems() {
    openPanel('アイテム', (b) => {
      if (!state.items.length) b.appendChild(div('empty', '何も持っていない。'));
      state.items.forEach((it) => {
        const d = div('item');
        d.appendChild(div('iname', it.name));
        if (it.still) {
          const cv = document.createElement('canvas');
          cv.width = R.W; cv.height = R.H;
          const def = Observer.cameras[it.still.cam];
          R.render(cv.getContext('2d'), {
            kind: 'feed', bg: def ? def.bg : 'dark', bgimg: def ? def.bgimg : null, img: it.still.img, actors: it.still.actors, tint: R.TINTS.past, still: true,
            caption: [`${it.still.cam}  ${def ? def.place : ''}`, `${fmtTime(it.still.at)}`],
          }, 1, false);
          d.appendChild(cv);
        }
        d.appendChild(div('', it.desc));
        b.appendChild(d);
      });
    });
  }

  /* ---------- 八島の手帳 ----------
     - 台本の「@note 文」（@look・@event の本文の中にも書ける）で、一行ずつ増える。
     - 章をまたいで残る（progress.notebook）。同じ行を二度は書かない。 */
  function addNote(text, ln) {
    const id = `${run.script ? run.script.name : ''}:${ln}`;
    // 「#キー 本文」「#キー 場所 | 本文」と書けば、その行に名前を付けられる（あとで @strike キー で線を引く）
    let key = null;
    const km = /^#(\S+)\s+([\s\S]+)$/.exec(text);
    if (km) { key = km[1]; text = km[2]; }
    // 「場所 | 本文」と書けば、場所を台本で決められる（書かなければ、いま映っているカメラ）
    const m = /^(.+?)\s*\|\s*(.+)$/.exec(text);
    if (m) text = m[2];
    if (state.notebook.some((n) => n.id === id || n.text === text)) return;
    const past = !state.outside && state.mode === 'past' && state.pastAt !== null;
    const at = past ? state.pastAt : state.now;
    const where = m ? m[1] : state.outside ? state.outside.place.replace(/^\S*日目\s*\S*\s*/, '') : `${state.cam}  ${Observer.cameras[state.cam].place}`;
    const note = { id, ch: state.chapter, at, where, text, unread: true };
    if (key) note.key = key;
    state.notebook.push(note);
    el.btnNote.classList.add('new');
    toast('手帳に書き留めた');
  }

  // キーを付けた手帳の行に、取り消し線を引く（同じキーの行すべて。まだ線がない行だけ）
  function strikeNote(key) {
    let hit = false;
    state.notebook.forEach((n) => {
      if (n.key !== key || n.struck) return;
      n.struck = true;
      n.unread = true;
      hit = true;
    });
    if (!hit) return;
    el.btnNote.classList.add('new');
    toast('手帳の一行に、線を引いた');
  }

  function openNote() {
    openPanel('八島の手帳', (b) => {
      b.classList.add('notebook');
      // 先頭の日報の行は、最後に書いた日報（@log 日報 | …）。なければ「異常なし」
      const daily = state.logs.filter((l) => l.kind === '日報').pop();
      b.appendChild(div('note-daily', `日報: ${daily ? daily.text.replace(/^\S*日目\s*/, '') : '異常なし'}`));
      if (!state.notebook.length) b.appendChild(div('empty', 'まだ何も書いていない。'));
      let ch = null;
      // 章ごと・時刻順に並べる
      state.notebook.slice().sort((a, b2) => a.ch - b2.ch || a.at - b2.at).forEach((n) => {
        if (n.ch !== ch) {
          ch = n.ch;
          const c = Observer.chapters.find((x) => x.no === ch);
          b.appendChild(div('note-ch', c ? `第${c.no}章　${c.title}` : ''));
        }
        const d = div(`note${n.unread ? ' unread' : ''}${n.struck ? ' struck' : ''}`);
        d.appendChild(div('note-head', `${fmtTime(n.at)}　${n.where || ''}`));
        d.appendChild(div('note-text', n.text));
        b.appendChild(d);
        n.unread = false;
      });
      el.btnNote.classList.remove('new');
      setTimeout(() => { b.scrollTop = b.scrollHeight; }, 0);
    });
  }

  function openHistory() {
    openPanel('文章の履歴', (b) => {
      history.slice(-80).forEach((h) => {
        const d = div('hist');
        if (h.name) d.appendChild(div('hname', `【${h.name}】`));
        d.appendChild(div('', h.text));
        b.appendChild(d);
      });
      setTimeout(() => { b.scrollTop = b.scrollHeight; }, 0);
    });
  }

  function openMenu() {
    openPanel('メニュー', (b) => {
      const box = div('menu-buttons');
      const add = (text, fn) => {
        const x = document.createElement('button');
        x.textContent = text;
        x.addEventListener('click', fn);
        box.appendChild(x);
      };
      add(`音: ${Observer.audio.enabled ? 'あり' : 'なし'}`, () => { toggleSound(); closePanel(); });
      add(`時間切れ: ${progress.noIdle ? 'なし' : 'あり'}`, () => { setNoIdle(!progress.noIdle); toast(progress.noIdle ? '時間切れをなしにしました（待たされることはありません）' : '時間切れをありにしました'); closePanel(); });
      add('この章を最初から', () => {
        if (!confirm('この章を最初からやり直しますか？')) return;
        closePanel(); startChapter(state.chapter);
      });
      add('章を選ぶ', () => { closePanel(); showScreen('select'); });
      add('タイトルへ', () => { closePanel(); showScreen('title'); });
      b.appendChild(box);
      b.appendChild(div('empty', '進み具合は、場面が変わるたびに自動で保存されます。'));
    });
  }

  let cardButtons = [];
  function showCard({ sub, title, note, kind, buttons, onClick }) {
    cardButtons = buttons || [];
    el.cardSub.textContent = sub || '';
    el.cardTitle.textContent = title || '';
    el.cardNote.textContent = note || '';
    el.card.className = `card on ${kind || ''}`;
    el.cardButtons.innerHTML = '';
    (buttons || []).forEach((bt) => {
      const x = document.createElement('button');
      x.textContent = bt.text;
      x.addEventListener('click', (e) => { e.stopPropagation(); bt.fn(); });
      el.cardButtons.appendChild(x);
    });
    el.card.onclick = onClick || null;
  }
  function hideCard() { el.card.className = 'card'; el.card.onclick = null; }

  let toastTimer = null;
  function toast(text) {
    el.toast.textContent = text;
    el.toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.toast.classList.remove('show'), 2200);
  }

  const errorList = [];
  // 台本の誤り（未定義のラベル・名前など）は、遊ぶ人には見せず、ゲームを止めずに進める。
  // 開発のための表示は、コンソールの警告と、URL に ?debug を付けたときの画面の表示だけ
  function reportError(msg) {
    errorList.push(msg);
    console.warn(msg);
    if (!DEBUG) return;
    el.errors.textContent = `台本のエラー（ここを押すと閉じます）\n${errorList.join('\n')}`;
    el.errors.classList.add('on');
  }

  // 進行中の待ち（文字送り・オート・スキップ・@pause・@idle・拭く操作・機器のメニュー）を、すべて止める。
  // 章を最初から始めるとき・保存から再開するとき・ゲームの画面を離れるときに呼ぶ
  // （残すと、離れたあとで古い台本が勝手に進んだり、新しい章に古い待ちが割り込んだりする）
  function resetRun() {
    stopTyping();
    typer.item = null;
    typer.onDone = null;
    clearTimeout(run.pauseTimer);
    run.pauseTimer = null;
    clearTimeout(exploreTimer);
    clearIdle();
    run.choice = null;
    run.lastChoice = null;
    run.reading = null;
    run.portraitsBefore = null;
    run.waitWipe = false;
    wipe.down = false;
    wipe.dist = 0;
    el.wipeHint.classList.remove('on');
    el.monitor.classList.remove('wiping');
    el.splash.style.opacity = '';
    clearChoices();
    closeHotMenu();
    setSkip(false);
  }

  /* ---------- ブラウザの戻るボタン ----------
     - タイトル以外にいるあいだは、履歴を 1 つ余分に積んでおき、戻るボタンを「ページを離れる」ではなく
       「ひとつ戻る」に使う（カード→そのまま、パネル→閉じる、ゲーム→メニュー、章選択・このゲームについて→タイトル）。 */
  let trapped = false;
  let ignorePop = 0;
  function trapBack() {
    if (trapped) return;
    try { window.history.pushState({ observer: 1 }, ''); trapped = true; } catch (e) { /* 履歴が使えなければ、何もしない */ }
  }
  function releaseBack() {
    if (!trapped) return;
    trapped = false;
    ignorePop += 1;
    try { window.history.back(); } catch (e) { ignorePop -= 1; }
  }
  function onPopState() {
    if (ignorePop > 0) { ignorePop -= 1; return; }
    if (!trapped) return;
    trapped = false;
    const cls = document.body.classList;
    if (el.card.classList.contains('on')) { trapBack(); return; }
    if (el.hotmenu.classList.contains('on')) { closeHotMenu(); trapBack(); return; }
    if (el.panel.classList.contains('on')) { closePanel(); trapBack(); return; }
    if (cls.contains('screen-game')) { openMenu(); trapBack(); return; }
    showScreen('title');
  }

  /* ===================================================================
     セーブと章をまたぐ記録
     =================================================================== */
  // 保存できない環境（プライベートウィンドウ・容量超過・保存の禁止）でも、遊びは続ける。成功したかどうかを返す
  function autosave() {
    let ok = true;
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify({ version: DATA_VERSION, savedAt: new Date().toISOString(), state: checkpoint }));
    } catch (e) { ok = false; }
    return saveProgress() && ok;
  }
  function manualSave() {
    if (!checkpoint) return;
    toast(autosave()
      ? '保存しました（この場面の始めから再開できます）'
      : 'このブラウザでは保存できません（プライベートモードなど）。このまま遊べますが、閉じると進み具合は残りません');
  }
  function loadSave() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return null;
      const d = JSON.parse(raw);
      if (!d || d.version !== DATA_VERSION || !d.state || typeof d.state !== 'object') return null;
      return d.state;
    } catch (e) { return null; }
  }

  // 保存した場面を、いまの形に直す。古い保存（項目が足りない・カメラが増えた）や、壊れた項目でも、
  // 落ちないように、足りない・型の合わない項目は初期値で補う
  function restoreState(saved) {
    const base = newWorld();
    const s = base;
    Object.keys(base).forEach((k) => {
      const v = saved[k];
      const b = base[k];
      if (v === undefined) return;
      if (b !== null && (v === null || typeof v !== typeof b || Array.isArray(v) !== Array.isArray(b))) return;
      s[k] = v;
    });
    const baseCams = newWorld().cams;
    const cams = {};
    Observer.cameraOrder.forEach((id) => {
      const c = s.cams && typeof s.cams[id] === 'object' && s.cams[id] ? s.cams[id] : {};
      cams[id] = Object.assign({}, baseCams[id], c);
    });
    s.cams = cams;
    s.wall = s.wall.filter((id) => Observer.cameras[id]);
    if (!Observer.cameras[s.cam]) s.cam = Observer.cameraOrder[0];
    if (s.mode !== 'live' && s.mode !== 'past') s.mode = 'live';
    s.hotspots = s.hotspots.filter((h) => h && Observer.cameras[h.cam]);
    s.events = s.events.filter((e) => e && Observer.cameras[e.cam] && Array.isArray(e.body));
    s.burned = s.burned.filter((b) => Array.isArray(b));
    s.notebook = s.notebook.filter((n) => n && typeof n.text === 'string');
    s.items = s.items.filter((i) => i && typeof i.id === 'string');
    if (s.relay && !Observer.cameras[s.relay.cam]) s.relay = null;
    if (s.outside && typeof s.outside !== 'object') s.outside = null;
    return s;
  }
  function clearSave() { try { localStorage.removeItem(SAVE_KEY); } catch (e) { /* 何もしない */ } }

  function loadProgress() {
    try {
      const raw = localStorage.getItem(PROGRESS_KEY);
      if (raw) {
        const d = JSON.parse(raw);
        if (d && d.version === DATA_VERSION && d.progress && typeof d.progress === 'object') {
          // 古い記録に無い項目（noIdle・chapterNotes・endings など）は初期値で補い、型の合わない項目は捨てる
          const p = newProgress();
          Object.keys(p).forEach((k) => {
            const v = d.progress[k];
            if (v !== undefined && v !== null && typeof v === typeof p[k] && Array.isArray(v) === Array.isArray(p[k])) p[k] = v;
          });
          if (d.progress.auto !== undefined) p.auto = !!d.progress.auto;
          return p;
        }
      }
    } catch (e) { /* 読めなければ新しく始める */ }
    return newProgress();
  }
  function saveProgress() {
    try { localStorage.setItem(PROGRESS_KEY, JSON.stringify({ version: DATA_VERSION, progress })); return true; } catch (e) { return false; }
  }

  /* ===================================================================
     章の開始・再開
     =================================================================== */
  function chapterDef(no) { return Observer.chapters.find((c) => c.no === no); }

  function startChapter(no, fromScript) {
    const c = chapterDef(no);
    if (!c || !c.script || !Observer.scripts[c.script]) {
      if (!fromScript) toast(`第${no}章は準備中です`);
      return false;
    }
    hideCard();
    closePanel();
    const notes = fromScript ? state.notebook
      : Object.keys(progress.chapterNotes).filter((k) => +k < no).sort((a, b) => a - b).flatMap((k) => (Array.isArray(progress.chapterNotes[k]) ? progress.chapterNotes[k] : []));
    resetRun();
    state = newWorld();
    state.notebook = clone(notes).filter((n) => n && typeof n.text === 'string').map((n) => Object.assign(n, { unread: false }));
    state.chapter = no;
    state.script = c.script;
    run.script = Observer.scripts[c.script];
    run.waitWipe = false;
    run.reading = null;
    history.length = 0;
    labelSnaps = {};
    buildWall();
    preloadScript(run.script);
    showScreen('game');
    go(c.start);
    return true;
  }

  // 台本で使う場面の絵と、登場する人物の立ち絵を、先に読み込んでおく（初めて出るときの遅れと、線画の一瞬を防ぐ）
  function preloadScript(script) {
    const src = JSON.stringify(script.code);
    const paths = new Set();
    (src.match(/img:[\w/.,-]+/g) || []).forEach((s) => s.slice(4).split(',').forEach((p) => paths.add(p)));
    Object.values(Observer.cameras).forEach((c) => { if (c.bgimg) paths.add(c.bgimg); });
    paths.forEach((p) => R.preload(p));
    // @show 名前 表情 で使う立ち絵（本文の中の @show も含む）
    const faces = new Set();
    const walk = (o) => {
      if (Array.isArray(o)) { o.forEach(walk); return; }
      if (!o || typeof o !== 'object') return;
      if ((o.op === 'show' || o.cmd === 'show') && o.arg) {
        const w = words(o.arg);
        const ch = Observer.characters[w[0]];
        const face = w[1] && w[1] !== 'left' ? w[1] : 'normal';
        if (ch) faces.add(ch.faces[face] || ch.faces.normal || ch.faces.smile);
      }
      Object.values(o).forEach(walk);
    };
    walk(script.code);
    faces.forEach((f) => { if (f) { const i = new Image(); i.src = `assets/${f}`; } });
  }

  function resume() {
    const saved = loadSave();
    if (!saved || !Observer.scripts[saved.script]) { toast('保存したデータがありません'); return; }
    const script = Observer.scripts[saved.script];
    let restored;
    try { restored = restoreState(saved); } catch (e) {
      // 壊れた保存は捨てて、タイトルに留まる
      console.warn(e);
      clearSave();
      renderTitle();
      toast('保存したデータを読み込めませんでした');
      return;
    }
    resetRun();
    state = restored;
    run.script = script;
    buildWall();
    preloadScript(script);
    showScreen('game');
    if (script.labels[state.label] === undefined) {
      toast('台本が変わったため、章の始めから再開します');
      startChapter(state.chapter);
      return;
    }
    toast('保存した場面から再開します');
    go(state.label);
  }

  /* ===================================================================
     タイトルと章選択
     =================================================================== */
  function anyCleared() { return Object.values(progress.chapters).some((c) => c && c.normal); }
  function finalCleared() { return !!(progress.chapters[5] && progress.chapters[5].true); }
  // 第4章には単独の真解決がない。第5章の真解決が、第4章の真解決にあたる
  function chapterDone(no, kind) {
    const p = progress.chapters[no] || {};
    if (kind === 'true') return !!(p.true || (no === 4 && finalCleared()));
    return !!p.normal;
  }
  // 真解決ができる（リレーの一枚が届いている）のに、まだ遊んでいない章
  function readyChapters() { return Observer.chapters.filter((c) => (progress.chapters[c.no] || {}).ready && !chapterDone(c.no, 'true')); }
  function allTrue() { return [1, 2, 3, 5].every((n) => chapterDone(n, 'true')); }

  function renderTitle() {
    $('btn-continue').disabled = !loadSave();
    $('btn-select').disabled = !anyCleared() && !DEBUG;
    $('btn-record').disabled = !anyCleared() && !DEBUG;
    // 最後の真解決を終えたあとは、タイトルの一行と赤いランプが変わる
    const fin = finalCleared();
    $('title-sub').textContent = fin ? '深夜、地下2階。日報の一番上には、「異常あり」。' : '深夜、地下2階。監視モニターの前で。';
    $('title-logo').classList.toggle('cleared', fin);
    // 通常解決のまま残した章に、届いた一枚が使われていないとき、「章を選ぶ」を橙にして知らせる
    const ready = readyChapters().length > 0;
    $('btn-select').classList.toggle('hint', ready);
    $('title-clear').textContent = allTrue() ? '― 見ているのは、あなただった ―' : (ready ? '未来から届いた一枚が、まだ、使われていない。' : '');
    $('title-clear').classList.toggle('ready', ready && !allTrue());
    $('btn-sound-title').textContent = `音: ${Observer.audio.enabled ? 'あり' : 'なし'}`;
  }

  function chapterStatus(c) {
    const p = progress.chapters[c.no] || {};
    if (chapterDone(c.no, 'true')) return { cls: 'st-true', mark: '真解決 ✔' };
    if (p.ready) return { cls: 'st-ready', mark: '通常解決 ✔　真解決ができる' };
    if (p.normal) return { cls: 'st-normal', mark: '通常解決 ✔' };
    const prev = progress.chapters[c.no - 1];
    if (c.no === 1 || (prev && prev.normal) || DEBUG) return { cls: 'st-new', mark: c.script ? (c.hidden ? '最後の夜' : '') : '準備中' };
    return { cls: 'st-locked', mark: '' };
  }

  function renderSelect() {
    el.chapterList.innerHTML = '';
    // 次に遊ぶ章への案内（橙の章があるときだけ）
    $('select-hint').textContent = readyChapters().length
      ? '橙色の章に、未来から届いた一枚を持って戻れる。最初から遊び直すと、途中で一枚が届く。（読んだ文章は、既読スキップで飛ばせる）'
      : '';
    Observer.chapters.forEach((c) => {
      if (c.hidden && !progress.unlocked[c.no]) return;
      const st = chapterStatus(c);
      const b = document.createElement('button');
      b.className = st.cls;
      const locked = st.cls === 'st-locked';
      b.appendChild(Object.assign(document.createElement('span'), { textContent: locked ? `第${c.no}章　？？？` : `第${c.no}章　${c.title}` }));
      b.appendChild(Object.assign(document.createElement('span'), { className: 'mark', textContent: c.script || locked ? st.mark : '準備中' }));
      b.disabled = locked;
      if (progress.shown[c.no] !== st.cls) {
        b.classList.add('st-appear');
        if (c.hidden && progress.shown[c.no] === undefined) toast('章の一覧に、新しい章が現れた');
        progress.shown[c.no] = st.cls;
      }
      b.addEventListener('click', () => {
        if (loadSave() && !confirm('保存した場面は、この章を始めると消えます。始めますか？')) return;
        startChapter(c.no);
      });
      el.chapterList.appendChild(b);
    });
    saveProgress();
  }

  // 記録: 章ごとの結末（通常解決・真解決・バッドエンド）と、集めた数
  function openRecord() {
    openPanel('記録', (b) => {
      const list = Observer.endings || [];
      const bads = list.filter((e) => e.kind === 'bad');
      const normals = [1, 2, 3, 4].filter((n) => chapterDone(n, 'normal')).length;
      const trues = [1, 2, 3, 4, 5].filter((n) => chapterDone(n, 'true')).length;
      const badSeen = bads.filter((e) => progress.endings[e.title]).length;
      b.appendChild(div('rec-sum', `通常解決 ${normals} / 4　　真解決 ${trues} / 5　　BAD END ${badSeen} / ${bads.length}`));
      Observer.chapters.forEach((c) => {
        if (c.hidden && !progress.unlocked[c.no]) return;
        const box = div('rec-ch');
        box.appendChild(div('rec-name', `第${c.no}章　${c.title}`));
        const st = [];
        if (c.no !== 5) st.push(`通常解決 ${chapterDone(c.no, 'normal') ? '✔' : '―'}`);
        st.push(`真解決 ${chapterDone(c.no, 'true') ? '✔' : '―'}`);
        box.appendChild(div('rec-st', st.join('　')));
        bads.filter((e) => e.ch === c.no).forEach((e) => {
          const got = !!progress.endings[e.title];
          box.appendChild(div(`rec-end bad${got ? '' : ' none'}`, `BAD END　${got ? e.title : '？？？'}`));
        });
        b.appendChild(box);
      });
      if (finalCleared()) {
        b.appendChild(div('rec-daily', '最後の日報　12日目　異常あり'));
        const nb = document.createElement('button');
        nb.textContent = '八島の手帳を、読み返す';
        nb.addEventListener('click', openFinalNote);
        b.appendChild(nb);
      }
      if (allTrue()) {
        b.appendChild(div('rec-thanks', badSeen === bads.length
          ? 'すべての結末を、見届けました。遊んでくれて、ありがとう。'
          : '全章の真解決を、見届けました。遊んでくれて、ありがとう。'));
      }
    });
  }

  // 最後の手帳（全章ぶん）を、読むだけで開く
  function openFinalNote() {
    const notes = progress.chapterNotes[5] || [];
    openPanel('八島の手帳（最後の一冊）', (b) => {
      b.classList.add('notebook');
      b.appendChild(div('note-daily', '日報: 異常あり'));
      let ch = null;
      notes.slice().sort((a, b2) => a.ch - b2.ch || a.at - b2.at).forEach((n) => {
        if (n.ch !== ch) {
          ch = n.ch;
          const c = Observer.chapters.find((x) => x.no === ch);
          b.appendChild(div('note-ch', c ? `第${c.no}章　${c.title}` : ''));
        }
        const d = div(`note${n.struck ? ' struck' : ''}`);
        d.appendChild(div('note-head', `${fmtTime(n.at)}　${n.where || ''}`));
        d.appendChild(div('note-text', n.text));
        b.appendChild(d);
      });
    });
  }

  function toggleSound() {
    Observer.audio.setEnabled(!Observer.audio.enabled);
    progress.sound = Observer.audio.enabled;
    saveProgress();
    renderTitle();
    toast(Observer.audio.enabled ? '音を出します' : '音を消しました');
  }

  /* ===================================================================
     デバッグ（URL の末尾に ?debug を付けたときだけ）
     =================================================================== */
  function renderDebug() {
    if (!DEBUG) return;
    const d = el.debug;
    d.classList.add('on');
    d.innerHTML = '';
    d.appendChild(div('', `DEBUG  ${state.script || '-'}  ${state.label || ''}`));
    const sel = document.createElement('select');
    Object.keys((run.script && run.script.labels) || {}).forEach((l) => {
      sel.appendChild(Object.assign(document.createElement('option'), { value: l, textContent: l, selected: l === state.label }));
    });
    d.appendChild(sel);
    const input = Object.assign(document.createElement('input'), { placeholder: 'フラグ（g:名前 で章をまたぐフラグ）' });
    d.appendChild(input);
    const row = div('row');
    const btn = (text, fn) => { const x = document.createElement('button'); x.textContent = text; x.onclick = fn; row.appendChild(x); };
    btn('ラベルへ', () => { closePanel(); hideCard(); run.waitWipe = false; state.outside = null; state.black = null; state.portraits = {}; go(sel.value); });
    btn('立てる', () => {
      const f = input.value.trim(); if (!f) return;
      if (f.startsWith('g:')) progress.flags[f.slice(2)] = true; else state.flags[f] = true;
      saveProgress(); renderChoices(); renderDebug();
    });
    btn('消す', () => {
      const f = input.value.trim(); if (!f) return;
      if (f.startsWith('g:')) delete progress.flags[f.slice(2)]; else delete state.flags[f];
      saveProgress(); renderChoices(); renderDebug();
    });
    btn('第1章の真解決を試す', () => {
      progress.flags.relay_ch1 = true;
      progress.chapters[1] = Object.assign(progress.chapters[1] || {}, { normal: true, ready: true });
      saveProgress(); toast('第1章の真解決の条件をそろえました。章選択から第1章を始めてください');
    });
    btn('第2章の真解決を試す', () => {
      progress.flags.relay_ch2 = true;
      [1, 2].forEach((n) => { progress.chapters[n] = Object.assign(progress.chapters[n] || {}, { normal: true }); });
      progress.chapters[2].ready = true;
      saveProgress(); toast('第2章の真解決の条件をそろえました。章選択から第2章を始めてください');
    });
    btn('全章クリア扱い', () => {
      [1, 2, 3, 4].forEach((n) => { progress.chapters[n] = Object.assign(progress.chapters[n] || {}, { normal: true }); });
      saveProgress(); toast('第1〜4章をクリア扱いにしました');
    });
    btn('記録を全部消す', () => {
      if (!confirm('セーブと章の記録をすべて消しますか？')) return;
      clearSave(); progress = newProgress(); saveProgress(); location.reload();
    });
    btn('閉じる', () => d.classList.remove('on'));
    d.appendChild(row);
    const flags = Object.keys(state.flags).join(' ') + '  |  g: ' + Object.keys(progress.flags).join(' ');
    d.appendChild(div('flags', flags));
  }

  /* ===================================================================
     起動
     =================================================================== */
  /* ---------- 無い絵（404）の記憶 ----------
     - まだ作っていない絵を毎回取りに行って、コンソールに 404 が並ぶのを防ぐ。404 と分かった絵のパスを、
       このブラウザに 24 時間・同じバージョンのあいだだけ覚える（絵が増えたら、バージョンが上がるか、
       24 時間たつと、自動でまた読みに行く。一覧を手で直す必要はない）。?debug のときは覚えない。 */
  const MISSING_KEY = 'observer.missing.v1';
  function setupMissingMemory() {
    let rec = { v: GAME_VERSION, t: Date.now(), paths: [] };
    if (!DEBUG) {
      try {
        const d = JSON.parse(localStorage.getItem(MISSING_KEY));
        if (d && d.v === GAME_VERSION && Array.isArray(d.paths) && Date.now() - d.t < 86400000) rec = d;
      } catch (e) { /* 覚えていなければ、新しく始める */ }
    }
    try { performance.setResourceTimingBufferSize(600); } catch (e) { /* 何もしない */ }
    R.trackMissing(DEBUG ? [] : rec.paths, (p) => {
      if (DEBUG || rec.paths.includes(p)) return;
      rec.paths.push(p);
      try { localStorage.setItem(MISSING_KEY, JSON.stringify(rec)); } catch (e) { /* 何もしない */ }
    });
  }

  function init() {
    setupMissingMemory();
    $('title-version').textContent = `v${GAME_VERSION}`;
    el.stVersion.textContent = `v${GAME_VERSION}`;

    // 台本の読み込みのエラーと、ない命令を、始める前に知らせる
    Object.values(Observer.scripts).forEach((s) => {
      s.errors.forEach((e) => reportError(`${s.name}: ${e}`));
      s.code.forEach((ins) => { if (!OPS[ins.op]) reportError(`${s.name}: ${ins.ln} 行目: @${ins.op} という命令はありません`); });
    });
    el.errors.addEventListener('click', () => el.errors.classList.remove('on'));

    if (progress.sound) Observer.audio.setEnabled(true);
    if (progress.auto) setAuto(true, true);

    $('btn-new').addEventListener('click', () => {
      if (loadSave() && !confirm('保存した進み具合は消えます。はじめから始めますか？')) return;
      startChapter(1);
    });
    $('btn-continue').addEventListener('click', resume);
    $('btn-select').addEventListener('click', () => showScreen('select'));
    $('btn-record').addEventListener('click', openRecord);
    $('btn-record-select').addEventListener('click', openRecord);
    $('btn-sound-title').addEventListener('click', toggleSound);
    $('btn-select-back').addEventListener('click', () => showScreen('title'));
    $('btn-about').addEventListener('click', () => showScreen('about'));
    $('btn-about-back').addEventListener('click', () => showScreen('title'));
    $('about-version').textContent = `v${GAME_VERSION}`;

    el.textbox.addEventListener('click', userAdvance);
    // 何かが押されたら、時間切れ（@idle）の数え直し
    document.addEventListener('pointerdown', () => { if (idle.timer) armIdle(); });
    document.addEventListener('keydown', () => { if (idle.timer) armIdle(); });
    document.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (!e.repeat) userAdvance(); }
    });
    // タブが隠れたあいだは、オート・時間切れ・音を止め、戻ったら再開する（時間切れは数え直し。「時間切れなし」の設定はそのまま守る）
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        clearTimeout(autoTimer); autoTimer = null;
        clearTimeout(idle.timer); idle.timer = null;
        Observer.audio.suspend();
      } else {
        if (autoPlay && typer.item && !typer.timer) scheduleAuto();
        armIdle();
        Observer.audio.resume();
      }
    });
    window.addEventListener('popstate', onPopState);
    window.addEventListener('orientationchange', closeHotMenu);   // 画面を回すと、機器のメニューの位置がずれる
    // 長押しの「画像を保存」・文字の選択のメニューを出さない（ゲームの画面だけ。ログ・手帳の文字は選べる）
    $('game-screen').addEventListener('contextmenu', (e) => e.preventDefault());
    el.btnLive.addEventListener('click', () => switchMode('live'));
    el.btnPast.addEventListener('click', () => switchMode('past'));
    el.btnLog.addEventListener('click', openLog);
    el.btnItems.addEventListener('click', openItems);
    el.btnNote.addEventListener('click', openNote);
    el.btnHistory.addEventListener('click', openHistory);
    el.btnSkip.addEventListener('click', () => setSkip(!skipping));
    el.btnAuto.addEventListener('click', () => setAuto(!autoPlay));
    el.btnSave.addEventListener('click', manualSave);
    el.btnMenu.addEventListener('click', openMenu);
    el.panelClose.addEventListener('click', closePanel);
    el.panel.addEventListener('click', (e) => { if (e.target === el.panel) closePanel(); });
    document.addEventListener('click', (e) => {
      if (el.hotmenu.classList.contains('on') && !el.hotmenu.contains(e.target) && e.target !== el.main) closeHotMenu();
    });

    el.main.addEventListener('click', onMonitorClick);
    el.monitor.addEventListener('pointerdown', wipeStart);
    window.addEventListener('pointermove', wipeMove);
    window.addEventListener('pointerup', wipeEnd);
    window.addEventListener('pointercancel', wipeEnd);

    el.tlRange.addEventListener('input', () => setPast(+el.tlRange.value));
    el.timeline.querySelectorAll('[data-step]').forEach((b) => {
      b.addEventListener('click', () => setPast(state.pastAt + (+b.dataset.step)));
    });

    showScreen('title');
    if (DEBUG) renderDebug();
    requestAnimationFrame(loop);
  }

  // 自動テスト（tools/playtest.js）から操作するための入口
  Observer._test = {
    get state() { return state; },
    get progress() { return progress; },
    run,
    errors: errorList,
    startChapter,
    advanceText,
    isTyping,
    exploring,
    switchCam,
    switchMode,
    setPast,
    choices() { return run.choice ? run.choice.options.filter((o) => test(o.cond)) : []; },
    choose(o) { run.choice = null; clearChoices(); go(o.target); },
    hotspots() { return exploring() ? mainView().hotspots || [] : []; },
    useHotspot(h, a) { state.lastHotspot = h; run.choice = null; clearChoices(); go(a.target); },
    finishWipe() { wipe.down = true; wipe.dist = 1e9; wipeMove({ clientX: 0, clientY: 0 }); },
    card() { return el.card.className.includes('on') ? { title: el.cardTitle.textContent, sub: el.cardSub.textContent } : null; },
    cardClick() { if (el.card.onclick) el.card.onclick(); },
    cardButtons() { return el.card.className.includes('on') ? cardButtons : []; },
    screen() { return document.body.className; },
    resume,
    retryFrom,
    openNote,
    setNoIdle,   // playtest は、時間切れを発火させない（選択肢を押す）ために、先にオンにする
    idle,
  };

  init();
})();
