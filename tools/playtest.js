'use strict';
/* ===================================================================
   台本の自動テスト（ブラウザを使わずに、章を最後まで通して遊ぶ）
   使い方: node tools/playtest.js [章の番号] [ルート]
     ルート: normal（通常解決）/ bad（バッドエンドを通ってから通常解決）/ true（真解決）
             mistakes（外れの干渉を先に全部試してから通常解決）
   - 画面の部品は、何もしない「仮の部品」に置き換えて動かす
   - 台本のエラー、実行中のエラー、行き詰まり（何も押せなくなる）を見つけたら、終了コード 1 で終わる
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
const MISTAKES = ['*h1_early', '*h1_late', '*h_phone_no', '*h2_stairs', '*h3_noise', '*h_bell_no'];
const tried = new Set();
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
    if (route === 'bad' && !badSeen && o.text.includes('やめておく')) return 3;
    if (o.text.includes('やめておく')) return -1;
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
    if (sorted[0].text.includes('やめておく')) badSeen = true;
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
    if (!h.range) return;
    h.actions.forEach((a) => {
      const key = `h:${h.cam}:${h.name}:${h.range}:${a.target}`;
      if (!tried.has(key) && score(a) > -9) cands.push({ h, a, key, s: score(a), i });
    });
  });
  cands.sort((x, y) => y.s - x.s || x.i - y.i);
  for (const c of cands) {
    T.switchMode('past');
    T.setPast(c.h.range[0]);
    if (st.cam !== c.h.cam) T.switchCam(c.h.cam);
    const vis = T.hotspots().find((x) => x.name === c.h.name && x.cam === c.h.cam && String(x.range) === String(c.h.range));
    if (!vis) continue;
    tried.add(c.key);
    say(`  干渉: ${c.h.cam} ${c.h.name} / ${c.a.text}`);
    T.useHotspot(vis, c.a);
    return true;
  }
  if (sorted.length) {
    say(`  選ぶ: ${sorted[0].text}`);
    T.choose(sorted[0]);
    return true;
  }
  return false;
}

async function main() {
  if (route === 'true') T.progress.flags.relay_ch1 = true;
  T.startChapter(chapterNo);
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

function report() {
  const p = T.progress;
  console.log(`  章の記録: ${JSON.stringify(p.chapters)}  見たエンディング: ${Object.keys(p.endings).join('、') || 'なし'}`);
  console.log(`  通ったラベル: ${T.state.label}  フラグ: ${Object.keys(T.state.flags).join(' ')}`);
}

function finish(msg) {
  if (T.errors.length) { fail(`台本のエラー:\n  ${T.errors.join('\n  ')}`); return; }
  console.log(`OK 第${chapterNo}章 ${route}: ${msg}`);
  report();
  process.exit(0);
}

function fail(msg) {
  console.log(`NG 第${chapterNo}章 ${route}: ${msg}`);
  console.log(log.slice(-15).join('\n'));
  if (T.errors.length) console.log(`台本のエラー:\n  ${T.errors.join('\n  ')}`);
  report();
  process.exit(1);
}

main();
