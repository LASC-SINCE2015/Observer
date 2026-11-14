'use strict';
/* ===================================================================
   ゲームの進行
   - 台本（Observer.scripts）の命令を上から順に実行する。命令の一覧は OPS。
   - 画面（監視モニター・モニター壁・タイムライン・テキスト・選択肢）を動かす。
   - セーブ（場面のセーブ）と、章をまたぐ記録（progress）を localStorage に残す。
   =================================================================== */

(function () {
  const GAME_VERSION = '0.2.6';
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
      vars: {},        // @settime で覚えた時刻（相対の時刻「N+3」に使う）
    };
  }

  // notebook: 八島の手帳（章をまたいで残る）。{ id, ch, at, cam, text, unread }
  function newProgress() {
    return { chapters: {}, flags: {}, endings: {}, read: {}, unlocked: {}, shown: {}, sound: false, notebook: [] };
  }

  let state = newWorld();
  let progress = loadProgress();
  let checkpoint = null;
  // reading: 探索中に読んでいる @look・@event（カメラを切り替えたら打ち切る）
  const run = { script: null, pc: 0, choice: null, waitWipe: false, reading: null };
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
    wipeHint: $('wipe-hint'),
    timeline: $('timeline'), tlRange: $('tl-range'), tlLabel: $('tl-label'), tlMarks: $('tl-marks'), tlRemain: $('tl-remain'),
    wallWrap: $('wall-wrap'), wall: $('wall'), wallToggle: $('wall-toggle'),
    btnLive: $('btn-live'), btnPast: $('btn-past'), btnLog: $('btn-log'), btnItems: $('btn-items'),
    btnHistory: $('btn-history'), btnSkip: $('btn-skip'), btnSave: $('btn-save'), btnMenu: $('btn-menu'),
    btnNote: $('btn-note'),
    textbox: $('textbox'), speaker: $('speaker'), message: $('message'), choices: $('choices'),
    panel: $('panel'), panelTitle: $('panel-title'), panelBody: $('panel-body'), panelClose: $('panel-close'),
    card: $('card'), cardSub: $('card-sub'), cardTitle: $('card-title'), cardButtons: $('card-buttons'),
    hotmenu: $('hotmenu'), flash: $('fx-flash'), toast: $('toast'), errors: $('errors'), debug: $('debug'),
    chapterList: $('chapter-list'),
  };
  const mainCtx = el.main.getContext('2d');

  function showScreen(name) {
    document.body.classList.remove('screen-title', 'screen-select', 'screen-game', 'screen-about');
    document.body.classList.add(`screen-${name}`);
    if (name === 'title') renderTitle();
    if (name === 'select') renderSelect();
    window.scrollTo(0, 0);
  }

  /* ===================================================================
     テキストウィンドウ
     =================================================================== */
  const typer = { item: null, i: 0, timer: null, auto: null, onDone: null };

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
    if (typer.item) el.message.textContent = typer.item.text;
    el.textbox.classList.add('waiting');
  }

  function stopTyping() {
    if (typer.timer) clearInterval(typer.timer);
    if (typer.auto) clearTimeout(typer.auto);
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

  function showHint(text) {
    stopTyping();
    typer.item = null;
    el.textbox.classList.remove('waiting');
    el.textbox.classList.add('hint');
    el.speaker.textContent = '';
    el.message.textContent = text || '';
  }

  function setSkip(on) {
    skipping = on;
    el.btnSkip.classList.toggle('active', on);
    if (on && typer.item && !typer.timer && !typer.auto) advanceText();
  }

  /* ===================================================================
     台本の実行
     =================================================================== */
  function go(label) {
    const idx = run.script.labels[label];
    if (idx === undefined) { reportError(`ラベル ${label} が見つかりません`); return; }
    run.pc = idx;
    run.choice = null;
    clearChoices();
    step();
  }

  function step() {
    for (;;) {
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
      renderChoices();
      checkExplore();
      return WAIT;
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
    pause(ins) { setTimeout(step, +ins.arg || 800); return WAIT; },

    /* ----- 時刻・モニター ----- */
    time(ins) { state.now = parseTime(ins.arg); if (state.pastAt !== null) clampPast(); },
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
        if (state.lastHotspot && state.lastHotspot.range) state.burned.push(state.lastHotspot.range.slice());
      } else if (w[0] === 'now') {
        // @burn now [幅]: いま過去で見ている時刻（幅を書くと、その前後の分も。書かなければ、その 1 分だけ）
        if (state.pastAt === null) throw new Error('@burn now: 過去の時刻がまだありません');
        const k = w[1] !== undefined ? +w[1] : 0;
        state.burned.push([state.pastAt - k, state.pastAt + k]);
      } else {
        state.burned.push(parseRange(a));
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
      showHint('モニターの上を、指（マウス）で左右になぞる。');
      return WAIT;
    },
    title(ins) {
      const [sub, title] = splitBar(ins.arg);
      showCard({ sub, title: title || '', kind: '', onClick: () => { hideCard(); step(); } });
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
      if (kind === 'true') c.true = true;
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
    showHint(run.choice.arg || (opts.length ? '' : 'モニターを見て回ろう。'));
    opts.forEach((o) => {
      const b = document.createElement('button');
      b.textContent = o.text;
      b.addEventListener('click', () => {
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

  function isBurned(at) { return state.burned.some(([a, b]) => a <= at && at <= b); }

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
    if (state.outside || run.waitWipe) return;
    if (state.cam === id) return;
    abortReading();
    state.cam = id;
    glitch = 8;
    Observer.audio.play('glitch');
    renderStatic();
    checkExplore();
  }

  function switchMode(mode) {
    if (state.outside || run.waitWipe || state.mode === mode) return;
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
    el.tlRemain.textContent = isBurned(state.pastAt) ? '焼き付き' : '';
    el.tlMarks.innerHTML = '';
    // 焼き付いた時間帯（白い帯）
    state.burned.forEach(([a, b]) => {
      if (b < min || a > state.now) return;
      const s = document.createElement('i');
      s.className = 'band';
      s.style.left = pos(Math.max(a, min));
      s.style.width = `${Math.max(0.6, ((Math.min(b, state.now) - Math.max(a, min) + 1) / span) * 100)}%`;
      s.title = `焼き付き ${fmtTime(a)}〜${fmtTime(b)}`;
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
      if (isBurned(m)) s.classList.add('burned');
      s.addEventListener('click', () => setPast(m));
      el.tlMarks.appendChild(s);
    });
  }

  /* ---------- モニター壁 ---------- */
  const tiles = [];
  function buildWall() {
    el.wall.innerHTML = '';
    tiles.length = 0;
    state.wall.forEach((id) => {
      const b = document.createElement('button');
      b.className = 'tile';
      const cv = document.createElement('canvas');
      cv.width = 160; cv.height = 90;
      const lab = document.createElement('span');
      lab.className = 'tlabel';
      lab.textContent = `${id.replace('CAM-', '')} ${Observer.cameras[id].place}`;
      b.appendChild(cv); b.appendChild(lab);
      b.addEventListener('click', () => switchCam(id));
      el.wall.appendChild(b);
      tiles.push({ id, btn: b, ctx: cv.getContext('2d') });
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
    let hidden = false;
    tiles.forEach((t, i) => {
      const n = hasUnseen(t.id);
      t.btn.classList.toggle('new', n);
      if (n && i >= 4) hidden = true;
    });
    const collapsed = el.wall.classList.contains('collapsed');
    el.wallToggle.classList.toggle('new', collapsed && hidden);
  }

  /* ---------- 状態が変わったときに、画面の文字やボタンを合わせる ---------- */
  function renderStatic() {
    const ch = Observer.chapters.find((c) => c.no === state.chapter);
    el.stChapter.textContent = ch ? `第${ch.no}章　${ch.title}` : '';
    el.stTime.textContent = fmtTime(state.now);
    document.body.classList.toggle('mode-past', state.mode === 'past' && !state.outside);
    document.body.classList.toggle('outside', !!state.outside);
    el.rec.textContent = state.mode === 'past' ? '◀◀ PLAYBACK' : '● REC';
    el.btnLive.classList.toggle('active', state.mode === 'live');
    el.btnPast.classList.toggle('active', state.mode === 'past');
    el.btnPast.disabled = !state.power;
    el.btnItems.textContent = state.items.length ? `アイテム(${state.items.length})` : 'アイテム';
    el.btnNote.classList.toggle('new', progress.notebook.some((n) => n.unread));
    renderWallMarks();
    el.monitor.classList.toggle('has-mic', !!Observer.cameras[state.cam].mic && !state.outside);
    el.splash.classList.toggle('on', state.splash);
    el.black.classList.toggle('on', !!state.black);
    el.black.classList.toggle('white', state.black === 'white');
    tiles.forEach((t) => t.btn.classList.toggle('active', t.id === state.cam));
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
      portraitEls[side] = key;
      box.innerHTML = '';
      box.classList.remove('on');
      if (!p) return;
      const ch = Observer.characters[p.name];
      // その表情の絵がまだなければ、normal → smile の順に、同じ人物のふだんの絵で代わりに出す
      // （密会の場面などの特別な表情は、代わりには使わない）
      const files = [ch.faces[p.face], ch.faces.normal, ch.faces.smile].filter((f, i, a) => f && a.indexOf(f) === i);
      const img = document.createElement('img');
      img.alt = p.name;
      let n = 0;
      img.onload = () => box.classList.add('on');
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
      box.appendChild(img);
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
    const burned = isBurned(state.pastAt);
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
        actors: state.outside.actors, tint: R.TINTS.outside, caption: [state.outside.place],
      };
    }
    return state.mode === 'past' ? pastView(state.cam) : liveView(state.cam, false);
  }

  function lampOn(id) { return (lamps[id] || 0) > performance.now(); }

  /* ---------- 描画の繰り返し ---------- */
  let lastFrame = 0;
  let tileIndex = 0;
  let currentHotspots = [];
  function loop(now) {
    requestAnimationFrame(loop);
    if (!document.body.classList.contains('screen-game')) return;
    if (now - lastFrame < 33) return;
    lastFrame = now;
    const t = now / 1000;
    const view = mainView();
    currentHotspots = view.hotspots || [];
    if (view.caption && view.caption[1] && !state.outside && !view.still) view.caption[1] += `:${pad(Math.floor(t) % 60)}`;
    R.render(mainCtx, view, t, false);
    R.postEffects(mainCtx, el.main, view.tint, glitch);
    if (glitch > 0) glitch -= 1;
    // モニター壁は、1 回に 3 枚ずつ描き直す
    for (let k = 0; k < Math.min(3, tiles.length); k++) {
      const tile = tiles[tileIndex % tiles.length];
      tileIndex += 1;
      tile.ctx.setTransform(0.5, 0, 0, 0.5, 0, 0);
      R.render(tile.ctx, liveView(tile.id, true), t, true);
    }
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
    if (hit) openHotMenu(hit, e.clientX, e.clientY);
  }

  function openHotMenu(h, cx, cy) {
    const m = el.hotmenu;
    m.innerHTML = '';
    const title = document.createElement('div');
    title.className = 'hm-title';
    title.textContent = h.name;
    m.appendChild(title);
    h.actions.forEach((a) => {
      const b = document.createElement('button');
      b.textContent = a.text;
      b.addEventListener('click', () => {
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
  function closePanel() { el.panel.classList.remove('on'); }
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
    if (progress.notebook.some((n) => n.id === id)) return;
    const past = !state.outside && state.mode === 'past' && state.pastAt !== null;
    const at = past ? state.pastAt : state.now;
    const where = state.outside ? state.outside.place.replace(/^\S*日目\s*\S*\s*/, '') : `${state.cam}  ${Observer.cameras[state.cam].place}`;
    progress.notebook.push({ id, ch: state.chapter, at, where, text, unread: true });
    saveProgress();
    el.btnNote.classList.add('new');
    toast('手帳に書き留めた');
  }

  function openNote() {
    openPanel('八島の手帳', (b) => {
      b.classList.add('notebook');
      b.appendChild(div('note-daily', '日報: 異常なし'));
      if (!progress.notebook.length) b.appendChild(div('empty', 'まだ何も書いていない。'));
      let ch = null;
      progress.notebook.forEach((n) => {
        if (n.ch !== ch) {
          ch = n.ch;
          const c = Observer.chapters.find((x) => x.no === ch);
          b.appendChild(div('note-ch', c ? `第${c.no}章　${c.title}` : ''));
        }
        const d = div(n.unread ? 'note unread' : 'note');
        d.appendChild(div('note-head', `${fmtTime(n.at)}　${n.where || ''}`));
        d.appendChild(div('note-text', n.text));
        b.appendChild(d);
        n.unread = false;
      });
      saveProgress();
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
  function showCard({ sub, title, kind, buttons, onClick }) {
    cardButtons = buttons || [];
    el.cardSub.textContent = sub || '';
    el.cardTitle.textContent = title || '';
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
  function reportError(msg) {
    errorList.push(msg);
    el.errors.textContent = `台本のエラー（ここを押すと閉じます）\n${errorList.join('\n')}`;
    el.errors.classList.add('on');
    console.error(msg);
  }

  /* ===================================================================
     セーブと章をまたぐ記録
     =================================================================== */
  function autosave() {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify({ version: DATA_VERSION, savedAt: new Date().toISOString(), state: checkpoint }));
    } catch (e) { /* 保存できなくても続ける */ }
    saveProgress();
  }
  function manualSave() {
    if (!checkpoint) return;
    autosave();
    toast('保存しました（この場面の始めから再開できます）');
  }
  function loadSave() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return null;
      const d = JSON.parse(raw);
      if (d.version !== DATA_VERSION || !d.state) return null;
      return d.state;
    } catch (e) { return null; }
  }
  function clearSave() { try { localStorage.removeItem(SAVE_KEY); } catch (e) { /* 何もしない */ } }

  function loadProgress() {
    try {
      const raw = localStorage.getItem(PROGRESS_KEY);
      if (raw) {
        const d = JSON.parse(raw);
        if (d.version === DATA_VERSION) return Object.assign(newProgress(), d.progress);
      }
    } catch (e) { /* 読めなければ新しく始める */ }
    return newProgress();
  }
  function saveProgress() {
    try { localStorage.setItem(PROGRESS_KEY, JSON.stringify({ version: DATA_VERSION, progress })); } catch (e) { /* 何もしない */ }
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
    setSkip(false);
    state = newWorld();
    state.chapter = no;
    state.script = c.script;
    run.script = Observer.scripts[c.script];
    run.waitWipe = false;
    run.reading = null;
    history.length = 0;
    labelSnaps = {};
    buildWall();
    showScreen('game');
    go(c.start);
    return true;
  }

  function resume() {
    const saved = loadSave();
    if (!saved || !Observer.scripts[saved.script]) { toast('保存したデータがありません'); return; }
    const script = Observer.scripts[saved.script];
    state = Object.assign(newWorld(), saved);
    run.script = script;
    run.waitWipe = false;
    run.reading = null;
    buildWall();
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
  function anyCleared() { return Object.values(progress.chapters).some((c) => c.normal); }

  function renderTitle() {
    $('btn-continue').disabled = !loadSave();
    $('btn-select').disabled = !anyCleared() && !DEBUG;
    $('btn-sound-title').textContent = `音: ${Observer.audio.enabled ? 'あり' : 'なし'}`;
  }

  function chapterStatus(c) {
    const p = progress.chapters[c.no] || {};
    if (p.true) return { cls: 'st-true', mark: '真解決 ✔' };
    if (p.ready) return { cls: 'st-ready', mark: '真解決ができる' };
    if (p.normal) return { cls: 'st-normal', mark: 'クリア' };
    const prev = progress.chapters[c.no - 1];
    if (c.no === 1 || (prev && prev.normal) || DEBUG) return { cls: 'st-new', mark: c.script ? '' : '準備中' };
    return { cls: 'st-locked', mark: '' };
  }

  function renderSelect() {
    el.chapterList.innerHTML = '';
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
        progress.shown[c.no] = st.cls;
      }
      b.addEventListener('click', () => startChapter(c.no));
      el.chapterList.appendChild(b);
    });
    saveProgress();
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
  function init() {
    $('title-version').textContent = `v${GAME_VERSION}`;
    el.stVersion.textContent = `v${GAME_VERSION}`;

    // 台本の読み込みのエラーと、ない命令を、始める前に知らせる
    Object.values(Observer.scripts).forEach((s) => {
      s.errors.forEach((e) => reportError(`${s.name}: ${e}`));
      s.code.forEach((ins) => { if (!OPS[ins.op]) reportError(`${s.name}: ${ins.ln} 行目: @${ins.op} という命令はありません`); });
    });
    el.errors.addEventListener('click', () => el.errors.classList.remove('on'));

    if (progress.sound) Observer.audio.setEnabled(true);

    $('btn-new').addEventListener('click', () => {
      if (loadSave() && !confirm('保存した進み具合は消えます。はじめから始めますか？')) return;
      startChapter(1);
    });
    $('btn-continue').addEventListener('click', resume);
    $('btn-select').addEventListener('click', () => showScreen('select'));
    $('btn-sound-title').addEventListener('click', toggleSound);
    $('btn-select-back').addEventListener('click', () => showScreen('title'));
    $('btn-about').addEventListener('click', () => showScreen('about'));
    $('btn-about-back').addEventListener('click', () => showScreen('title'));
    $('about-version').textContent = `v${GAME_VERSION}`;

    el.textbox.addEventListener('click', advanceText);
    document.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); advanceText(); }
    });
    el.btnLive.addEventListener('click', () => switchMode('live'));
    el.btnPast.addEventListener('click', () => switchMode('past'));
    el.btnLog.addEventListener('click', openLog);
    el.btnItems.addEventListener('click', openItems);
    el.btnNote.addEventListener('click', openNote);
    el.btnHistory.addEventListener('click', openHistory);
    el.btnSkip.addEventListener('click', () => setSkip(!skipping));
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

    el.tlRange.addEventListener('input', () => setPast(+el.tlRange.value));
    el.timeline.querySelectorAll('[data-step]').forEach((b) => {
      b.addEventListener('click', () => setPast(state.pastAt + (+b.dataset.step)));
    });

    // 幅の狭い画面では、モニター壁を 1 行にたたんでおく
    if (window.innerWidth < 600) {
      el.wallWrap.classList.add('can-collapse');
      el.wall.classList.add('collapsed');
    }
    el.wallToggle.addEventListener('click', () => {
      const c = el.wall.classList.toggle('collapsed');
      el.wallToggle.textContent = c ? '▼ モニターをひろげる' : '▲ モニターをたたむ';
      renderWallMarks();
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
  };

  init();
})();
