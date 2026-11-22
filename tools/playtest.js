'use strict';
/* ===================================================================
   台本の自動テスト（ブラウザを使わずに、章を最後まで通して遊ぶ）
   使い方: node tools/playtest.js [章の番号] [ルート]
     ルート: normal（通常解決）/ bad（バッドエンドを通ってから通常解決）/ true（真解決）
             mistakes（外れの干渉を先に全部試してから通常解決）
   - 画面の部品は、何もしない「仮の部品」に置き換えて動かす
   - 台本のエラー、実行中のエラー、行き詰まり（何も押せなくなる）を見つけたら、終了コード 1 で終わる
   - 台本・cameras.js・characters.js が指す絵が game/assets/ にあるかも確かめる（最後に「見つからない絵」を出す）
     - assets_src/new_prompts_ch*.md の ⬜（未生成）にある名前は「未生成（既知）」、それ以外は「参照の誤り」（終了コード 1）
   =================================================================== */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const GAME = path.join(__dirname, '..', 'game');
const chapterNo = +(process.argv[2] || 1);
const route = process.argv[3] || 'normal';

/* ---------- 仮の画面部品 ---------- */
function makeClassList(elm) {
  const get = () => elm.className.split(/\s+/).filter(Boolean);
  const put = (a) => { elm.className = a.join(' '); };
  return {
    add(...c) { const a = get(); c.forEach((x) => { if (!a.includes(x)) a.push(x); }); put(a); },
    remove(...c) { put(get().filter((x) => !c.includes(x))); },
    contains(c) { return get().includes(c); },
    toggle(c, on) {
      const has = get().includes(c);
      const want = on === undefined ? !has : !!on;
      if (want && !has) this.add(c);
      if (!want && has) this.remove(c);
      return want;
    },
  };
}

function ctx2d() {
  return new Proxy({}, {
    get(t, k) {
      if (k in t) return t[k];
      if (k === 'getImageData') return () => ({ data: new Uint8ClampedArray(320 * 180 * 4) });
      if (k === 'createLinearGradient' || k === 'createRadialGradient') return () => ({ addColorStop() {} });
      return () => {};
    },
    set(t, k, v) { t[k] = v; return true; },
  });
}

function makeElement(tag) {
  const e = {
    tagName: (tag || 'div').toUpperCase(), className: '', textContent: '', style: {}, dataset: {},
    children: [], disabled: false, value: '0', onclick: null, width: 320, height: 180,
    clientWidth: 640, offsetWidth: 120, offsetHeight: 80, scrollTop: 0, scrollHeight: 0,
    appendChild(c) { this.children.push(c); return c; },
    addEventListener() {},
    getContext() { return ctx2d(); },
    getBoundingClientRect() { return { left: 0, top: 0, width: 640, height: 360 }; },
    querySelectorAll() { return []; },
    contains() { return false; },
  };
  Object.defineProperty(e, 'innerHTML', { get() { return ''; }, set() { e.children = []; } });
  e.classList = makeClassList(e);
  return e;
}

const elements = {};
const document = {
  body: makeElement('body'),
  getElementById(id) { return elements[id] || (elements[id] = makeElement('div')); },
  querySelector(sel) { return elements[sel] || (elements[sel] = makeElement('div')); },
  createElement: makeElement,
  createTextNode: (t) => ({ textContent: t }),
  addEventListener() {},
};
const store = {};
const sandbox = {
  document,
  location: { search: '' },
  localStorage: {
    getItem: (k) => (k in store ? store[k] : null),
    setItem: (k, v) => { store[k] = String(v); },
    removeItem: (k) => { delete store[k]; },
  },
  performance: { now: () => Date.now() },
  requestAnimationFrame() {},
  setTimeout, clearTimeout, setInterval, clearInterval,
  console, confirm: () => true, innerWidth: 1024, innerHeight: 768,
  scrollTo() {},
  addEventListener() {},
  // 画像は読み込まない（読み込めなかった扱いで、線の絵のまま進む）
  Image: class { set src(v) { this._src = v; } get src() { return this._src; } },
};
sandbox.window = sandbox;
vm.createContext(sandbox);

// index.html と同じ順番で読み込む
const html = fs.readFileSync(path.join(GAME, 'index.html'), 'utf8');
const scripts = [...html.matchAll(/<script src="([^"?]+)(?:\?[^"]*)?"><\/script>/g)].map((m) => m[1]);
scripts.forEach((s) => vm.runInContext(fs.readFileSync(path.join(GAME, s), 'utf8'), sandbox, { filename: s }));

const O = sandbox.Observer;
const T = O._test;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* ---------- 自動で遊ぶ ---------- */
// 外れの干渉（押すと、立て直しの道に入るか、失敗して「この夜を、もう一度」になる）
const MISTAKES = ['*h1_early', '*h1_late', '*h_phone_no', '*h2_stairs', '*h3_noise', '*h_bell_no',
  '*p_ring', '*p_noise', '*p_voice_safe', '*send_wrong'];
// バッドエンドへ進む選択肢
const GIVE_UP = /やめておく|何もしない/;
let startScript = null;   // 最初に読み込んだ章の台本
const tried = new Set();
const used = {};   // 選択肢を選んだ回数
let badSeen = false;
const log = [];

function say(s) { log.push(s); if (process.env.VERBOSE) console.log(s); }

// 探索: 見ていない @look → 見ていない @event → 干渉 → 選択肢、の順に試す
function explore() {
  const st = T.state;
  const others = (id) => st.wall.find((x) => x !== id);

  for (const id of st.wall) {
    const c = st.cams[id];
    if (c.look && !c.look.seen && c.status === 'ok') {
      T.switchMode('live');
      if (st.cam === id) T.switchCam(others(id));
      T.switchCam(id);
      say(`  見る: ${id}`);
      return true;
    }
  }
  if (st.power) {
    for (const e of st.events) {
      if (e.seen || !st.cams[e.cam].open || (!e.body.length && !e.flag)) continue;
      if (e.to < st.now - 4320 || e.from > st.now) continue;
      T.switchMode('past');
      T.setPast(e.from);
      T.switchCam(others(e.cam));
      T.switchCam(e.cam);
      say(`  過去を見る: ${e.cam} ${e.from}`);
      return true;
    }
  }
  const choices = T.choices();
  // 選択肢の好み（ルートで変える）
  const prefer = (o) => {
    if (route === 'bad' && !badSeen && GIVE_UP.test(o.text)) return 3;
    if (GIVE_UP.test(o.text)) return -1;
    // 真解決のルートでは、脅さない（「脅さない」を選べるときだけ）
    if (route === 'true' && o.text === '脅さない') return 3;
    return 0;
  };
  const sorted = choices.slice().sort((a, b) => prefer(b) - prefer(a));
  // 夜を進める選択肢より先に、ほかの選択肢（寄り道）を一度ずつ試す
  const side = sorted.find((o) => !tried.has(`c:${o.target}`) && !/夜を進める|待つ/.test(o.text) && prefer(o) >= 0);
  if (side && prefer(sorted[0]) <= 0) {
    tried.add(`c:${side.target}`);
    say(`  選ぶ: ${side.text}`);
    T.choose(side);
    return true;
  }
  if (sorted.length && prefer(sorted[0]) > 0) {
    say(`  選ぶ: ${sorted[0].text}`);
    if (GIVE_UP.test(sorted[0].text)) badSeen = true;
    T.choose(sorted[0]);
    return true;
  }
  // 干渉できる機器
  // - 真解決の手がかり（*t_ で始まるラベル）へつながる機器は、真解決のルートでだけ先に試す
  // - 外れの機器（MISTAKES）は、mistakes のルートでだけ先に試す（ほかのルートでは試さない）
  const score = (a) => {
    if (a.target.startsWith('*t_')) return route === 'true' ? 2 : -9;
    if (MISTAKES.includes(a.target)) return route === 'mistakes' ? 1 : -9;
    return 0;
  };
  const cands = [];
  st.hotspots.forEach((h, i) => {
    h.actions.forEach((a) => {
      const key = `h:${h.cam}:${h.name}:${h.range}:${a.target}`;
      if (!tried.has(key) && score(a) > -9) cands.push({ h, a, key, s: score(a), i });
    });
  });
  cands.sort((x, y) => y.s - x.s || x.i - y.i);
  for (const c of cands) {
    const find = () => T.hotspots().find((x) => x.name === c.h.name && x.cam === c.h.cam && String(x.range) === String(c.h.range));
    let vis = null;
    if (c.h.range) {
      // 時間帯の中で、まだ焼き付いていない最初の時刻で押す
      T.switchMode('past');
      for (let at = c.h.range[0]; at <= c.h.range[1] && !vis; at++) {
        T.setPast(at);
        if (st.cam !== c.h.cam) T.switchCam(c.h.cam);
        vis = find();
      }
    } else {
      T.switchMode('live');   // 今の映像で押せる機器
      if (st.cam !== c.h.cam) T.switchCam(c.h.cam);
      vis = find();
    }
    if (!vis) continue;
    tried.add(c.key);
    say(`  干渉: ${c.h.cam} ${c.h.name} / ${c.a.text}`);
    T.useHotspot(vis, c.a);
    return true;
  }
  if (sorted.length) {
    // 同じ選択肢ばかり選ばないよう、選んだ回数のいちばん少ないものを選ぶ（好みが同じものの中で）
    const top = sorted.filter((o) => prefer(o) === prefer(sorted[0]));
    const pick = top.slice().sort((a, b) => (used[a.target] || 0) - (used[b.target] || 0))[0];
    used[pick.target] = (used[pick.target] || 0) + 1;
    say(`  選ぶ: ${pick.text}`);
    T.choose(pick);
    return true;
  }
  return false;
}

async function main() {
  // 真解決: その章へ一枚が届いた扱いにする（第1章は relay_ch1、第2章は relay_ch2）
  if (route === 'true') T.progress.flags[`relay_ch${chapterNo}`] = true;
  // 時間切れ（@idle）は発火させない（選択肢を押して進む）
  T.setNoIdle(true);
  T.startChapter(chapterNo);
  startScript = T.run.script;
  let idle = 0;
  let retries = 0;
  for (let n = 0; n < 5000; n++) {
    const screen = T.screen();
    const card = T.card();
    if (card) {
      say(`カード: ${card.sub} ${card.title}`);
      if (card.sub === 'BAD END' || card.sub === 'やり直し') {
        if (card.sub === 'BAD END') badSeen = true;
        if (++retries > 20) { fail('やり直しが多すぎます'); return; }
        const b = T.cardButtons().find((x) => x.text !== '章を選ぶ');
        b.fn();
        continue;
      }
      if (T.cardButtons().length) { finish(`終わり: ${card.sub} ${card.title}`); return; }
      T.cardClick();
      continue;
    }
    if (screen.includes('screen-select')) { finish('終わり: 章選択に戻った'); return; }
    if (T.run.waitWipe) { say('  画面を拭く'); T.finishWipe(); continue; }
    if (T.isTyping()) { T.advanceText(); T.advanceText(); idle = 0; continue; }
    if (T.exploring()) {
      if (explore()) { idle = 0; continue; }
      fail(`行き詰まり: ラベル ${T.state.label} で、選べるもの・押せるものがない`);
      return;
    }
    // @pause や、探索の待ち時間
    idle += 1;
    if (idle > 80) { fail(`止まったまま: ラベル ${T.state.label}`); return; }
    await sleep(60);
  }
  fail('手数が多すぎます（無限ループの疑い）');
}

/* ---------- 絵のパスの検査 ---------- */
// assets_src/new_prompts_ch*.md の「### ⬜ 名前」から、未生成（既知）の名前を集める。読めなければ null
function readPending() {
  try {
    const dir = path.join(__dirname, '..', 'assets_src');
    const files = fs.readdirSync(dir).filter((n) => /^new_prompts_ch.*\.md$/.test(n));
    if (!files.length) return null;
    const set = new Set();
    files.forEach((n) => {
      fs.readFileSync(path.join(dir, n), 'utf8').split(/\r?\n/).forEach((l) => {
        const m = l.match(/^#+\s*⬜\s*([\w/.-]+)/);
        if (m) set.add(stem(m[1]));
      });
    });
    return set;
  } catch (e) { return null; }
}
function stem(p) { return p.replace(/^.*\//, '').replace(/\.[A-Za-z0-9]+$/, ''); }

// 台本（@feed・@event・@outside などの img:、@show の立ち絵）と cameras.js の bgimg を集めて、実在を確かめる
function checkImages() {
  const refs = [];   // { p, where }
  const bad = [];    // { where, msg }
  const add = (p, where) => { if (p) refs.push({ p, where }); };
  const script = startScript;   // 章の途中で次の章へ進んでも、最初の章の台本を調べる
  let label = '(先頭)';
  const scanShow = (arg, where) => {
    const w = arg.split(/\s+/).filter(Boolean);
    const ch = O.characters[w[0]];
    if (!ch) return;   // 人物がいない誤りは、実行時のエラーとして出る
    const face = w.slice(1).find((x) => x !== 'left' && x !== 'right') || 'normal';
    if (!ch.faces[face]) { bad.push({ where, msg: `表情 ${w[0]} ${face} が characters.js にない` }); return; }
    add(ch.faces[face], where);
  };
  if (script) {
    script.code.forEach((ins) => {
      if (ins.op === 'label') label = ins.name;
      const where = `第${chapterNo}章 L${ins.ln} ${label}`;
      if (ins.op === 'show') scanShow(ins.arg || '', where);
      (ins.arg || '').split(/\s+/).forEach((t) => {
        if (t.startsWith('img:')) t.slice(4).split(',').forEach((p) => add(p, where));
      });
      (ins.body || []).forEach((b) => { if (b.cmd === 'show') scanShow(b.arg || '', `第${chapterNo}章 L${b.ln} ${label}`); });
    });
  }
  Object.keys(O.cameras).forEach((id) => add(O.cameras[id].bgimg, `cameras.js ${id}`));

  const pending = readPending();
  const seen = new Set();
  const missing = [];   // { p, where, kind: 'known' | 'wrong' | 'unknown' }
  refs.forEach((r) => {
    if (seen.has(r.p)) return;
    seen.add(r.p);
    if (fs.existsSync(path.join(GAME, 'assets', r.p))) return;
    const kind = pending === null ? 'unknown' : pending.has(stem(r.p)) ? 'known' : 'wrong';
    missing.push({ p: r.p, where: r.where, kind });
  });
  const tag = { known: '未生成（既知）', wrong: '参照の誤り', unknown: '見つからない（未生成の一覧を読めない）' };
  const lines = bad.map((b) => `  [参照の誤り] ${b.where}: ${b.msg}`)
    .concat(missing.map((m) => `  [${tag[m.kind]}] ${m.where}: ${m.p}`));
  const wrong = bad.length + missing.filter((m) => m.kind === 'wrong').length;
  if (lines.length) {
    console.log(`  絵の検査: 参照の誤り ${wrong} 件 / 未生成（既知） ${missing.filter((m) => m.kind === 'known').length} 件` +
      (pending === null ? ' / 未生成の一覧（assets_src/new_prompts_ch*.md）を読めないため、見つからない絵は警告のみ' : ''));
    lines.slice(0, 30).forEach((l) => console.log(l));
    if (lines.length > 30) console.log(`  ほか ${lines.length - 30} 件`);
  }
  return wrong;
}

function report() {
  const p = T.progress;
  console.log(`  章の記録: ${JSON.stringify(p.chapters)}  見たエンディング: ${Object.keys(p.endings).join('、') || 'なし'}`);
  console.log(`  通ったラベル: ${T.state.label}  フラグ: ${Object.keys(T.state.flags).join(' ')}`);
}

function finish(msg) {
  if (T.errors.length) { fail(`台本のエラー:\n  ${T.errors.join('\n  ')}`); return; }
  console.log(`OK 第${chapterNo}章 ${route}: ${msg}`);
  report();
  process.exit(checkImages() ? 1 : 0);
}

function fail(msg) {
  console.log(`NG 第${chapterNo}章 ${route}: ${msg}`);
  console.log(log.slice(-15).join('\n'));
  if (T.errors.length) console.log(`台本のエラー:\n  ${T.errors.join('\n  ')}`);
  report();
  checkImages();
  process.exit(1);
}

main();
