'use strict';
/* ===================================================================
   台本の読み込み
   - 台本（テキスト）を、上から順に実行する命令の列に変える。
   - 書き方は design/data/scenario_format.md を参照。
   =================================================================== */

window.Observer = window.Observer || { cameras: {}, cameraOrder: [], chapters: [], scripts: {} };

// 台本ファイルから呼ぶ: Observer.script('chapter1', `...台本...`)
Observer.script = function (name, text) {
  Observer.scripts[name] = Observer.parseScript(name, text);
};

// カメラの定義ファイルから呼ぶ
Observer.camera = function (id, def) {
  Observer.cameras[id] = Object.assign({ id, place: id, bg: 'corridor', mic: false }, def);
  Observer.cameraOrder.push(id);
};

// 本文（ひと続きの文章）を持てる命令
const BLOCK_OPS = new Set(['look', 'event']);

// ジャンプ先（*ラベル）を引数に持つ命令。読み込み時に、ラベルがあるか確かめる
const JUMP_PATTERN = /\*[^\s|]+/g;

Observer.parseScript = function (name, text) {
  const code = [];
  const labels = {};
  const errors = [];
  let block = null;    // 本文を受け付けている命令（@look・@event）
  let choice = null;   // 選択肢を受け付けている @choice
  const cast = new Set();  // @cast で書いた、セリフを話す人の名前

  text.split(/\r?\n/).forEach((raw, i) => {
    const ln = i + 1;
    const line = raw.trim();
    if (!line || line.startsWith('//')) return;

    // 選択肢の行（@choice の直後）
    if (choice && (line.startsWith('- ') || line.startsWith('-\t'))) {
      const opt = parseOption(line.slice(1).trim());
      if (!opt) errors.push(`${ln} 行目: 選択肢の形が正しくありません（「- 文 -> *ラベル」）`);
      else choice.options.push(Object.assign(opt, { ln }));
      return;
    }
    choice = null;

    // 字下げした行は、直前の @look・@event の本文
    if (block && /^[ \t]/.test(raw)) {
      block.body.push(Object.assign(parseText(line, cast), { ln }));
      return;
    }
    block = null;

    if (line.startsWith('*')) {
      const label = line.split(/\s/)[0];
      if (labels[label] !== undefined) errors.push(`${ln} 行目: ラベル ${label} が 2 回あります`);
      labels[label] = code.length;
      code.push({ op: 'label', name: label, ln });
      return;
    }

    if (line.startsWith('@')) {
      const m = line.match(/^@(\S+)\s*(.*)$/);
      const ins = { op: m[1], arg: m[2].trim(), ln };
      if (ins.op === 'cast') { ins.arg.split(/\s+/).filter(Boolean).forEach((n) => cast.add(n)); return; }
      if (BLOCK_OPS.has(ins.op)) { ins.body = []; block = ins; }
      if (ins.op === 'choice') { ins.options = []; choice = ins; }
      code.push(ins);
      return;
    }

    code.push(Object.assign({ op: 'text', ln }, parseText(line, cast)));
  });

  // ジャンプ先のラベルがあるか確かめる
  code.forEach((ins) => {
    const targets = [];
    if (ins.op !== 'text' && ins.op !== 'label' && ins.arg) targets.push(...(ins.arg.match(JUMP_PATTERN) || []));
    (ins.options || []).forEach((o) => targets.push(o.target));
    targets.forEach((t) => {
      if (labels[t] === undefined) errors.push(`${ins.ln} 行目: ラベル ${t} が見つかりません`);
    });
  });

  return { name, code, labels, errors };
};

// 「名前「セリフ」」の形で、名前が @cast にあればセリフ。それ以外は地の文
function parseText(line, cast) {
  const m = line.match(/^([^\s「」]{1,12})「([\s\S]*)」$/);
  if (m && cast.has(m[1])) return { name: m[1], text: `「${m[2]}」` };
  return { name: '', text: line };
}

// 「文 -> *ラベル if 条件」
function parseOption(s) {
  const m = s.match(/^(.*?)\s*->\s*(\*\S+)(?:\s+if\s+(.+))?$/);
  if (!m) return null;
  return { text: m[1], target: m[2], cond: (m[3] || '').trim() };
}
