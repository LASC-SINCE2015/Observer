'use strict';
/* ===================================================================
   効果音（Web Audio で、その場で音を作る。音の素材ファイルは使わない）
   - 最初は音を出さない。設定で「音を出す」にしたときだけ鳴らす
   - 台本の @sound 名前 で鳴らす。名前は SOUNDS のキー
   =================================================================== */

(function () {
  let ctx = null;
  let enabled = false;
  let pending = false;

  function ac() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    if (ctx.state !== 'running' && !document.hidden) ctx.resume().catch(() => { /* 操作の前は、解禁されない */ });
    return ctx;
  }

  // ブラウザは、ページが操作される前の音を許さない。最初の操作（タップ・キー）で、音を解禁する
  const unlock = () => { if (enabled) ac(); };
  ['pointerdown', 'keydown', 'touchend'].forEach((ev) => document.addEventListener(ev, unlock, { passive: true }));

  // 一定の高さの音を鳴らす
  function tone(type, freq, start, dur, gain) {
    const a = ac();
    const o = a.createOscillator();
    const g = a.createGain();
    o.type = type;
    o.frequency.value = freq;
    g.gain.setValueAtTime(0, a.currentTime + start);
    g.gain.linearRampToValueAtTime(gain, a.currentTime + start + 0.01);
    g.gain.setValueAtTime(gain, a.currentTime + start + dur - 0.03);
    g.gain.linearRampToValueAtTime(0, a.currentTime + start + dur);
    o.connect(g).connect(a.destination);
    o.start(a.currentTime + start);
    o.stop(a.currentTime + start + dur + 0.05);
  }

  // ザーッという雑音
  function noise(start, dur, gain, lowpass) {
    const a = ac();
    const len = Math.floor(a.sampleRate * dur);
    const buf = a.createBuffer(1, len, a.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    const src = a.createBufferSource();
    src.buffer = buf;
    const f = a.createBiquadFilter();
    f.type = 'lowpass';
    f.frequency.value = lowpass || 4000;
    const g = a.createGain();
    g.gain.setValueAtTime(gain, a.currentTime + start);
    g.gain.linearRampToValueAtTime(0, a.currentTime + start + dur);
    src.connect(f).connect(g).connect(a.destination);
    src.start(a.currentTime + start);
  }

  const SOUNDS = {
    // 非常ベル
    bell() { for (let i = 0; i < 24; i++) tone('square', 880, i * 0.07, 0.05, 0.06); },
    // エレベーターの到着音
    chime() { tone('sine', 988, 0, 0.35, 0.15); tone('sine', 784, 0.32, 0.6, 0.15); },
    // 防犯センサーの警告音
    beep() { for (let i = 0; i < 4; i++) tone('square', 1760, i * 0.22, 0.12, 0.05); },
    // 電話の呼び出し
    phone() { for (let i = 0; i < 2; i++) { tone('sine', 440, i * 0.5, 0.35, 0.08); tone('sine', 480, i * 0.5, 0.35, 0.08); } },
    // 館内放送のノイズ
    static() { noise(0, 1.2, 0.18, 2500); },
    // 映像が乱れる音
    glitch() { noise(0, 0.25, 0.12, 6000); tone('sawtooth', 60, 0, 0.25, 0.05); },
    // 力が働く音
    power() { tone('sine', 110, 0, 1.4, 0.12); tone('sine', 220, 0.1, 1.2, 0.06); noise(0, 1.2, 0.05, 900); },
    // 重いものが落ちる音
    thud() { tone('sine', 55, 0, 0.5, 0.5); noise(0, 0.3, 0.4, 400); },
    // サイレン
    siren() { for (let i = 0; i < 4; i++) { tone('sine', 700, i * 0.8, 0.4, 0.05); tone('sine', 560, i * 0.8 + 0.4, 0.4, 0.05); } },
    // 扉をたたく音（1 回ぶん。続けて鳴らして、ノックにする）
    knock() { tone('sine', 150, 0, 0.09, 0.35); noise(0, 0.06, 0.3, 600); },
    // 缶を開ける音
    can() { noise(0, 0.15, 0.2, 7000); },
  };

  Observer.audio = {
    get enabled() { return enabled; },
    setEnabled(on) {
      enabled = on;
      // 保存した設定を起動時に戻すときは、まだ操作がないので、音を作らない（最初の操作で作る）
      const acted = typeof navigator === 'undefined' || !navigator.userActivation || navigator.userActivation.hasBeenActive;
      if (on && acted) ac();
    },
    play(name) {
      // タブが隠れているあいだと、音が出せない（解禁前・中断中）あいだは、音を溜めずに捨てる
      if (!enabled || !SOUNDS[name] || document.hidden) return;
      try {
        const a = ac();
        if (!a) return;
        if (a.state === 'running') { SOUNDS[name](); return; }
        // 解禁の直後など: 動き出したら、直近の 1 つだけ鳴らす
        if (pending) return;
        pending = true;
        a.resume().then(() => { pending = false; if (a.state === 'running') SOUNDS[name](); }).catch(() => { pending = false; });
      } catch (e) { /* 音が出せない環境では何もしない */ }
    },
    // タブが隠れたら止め、戻ったら動かす
    suspend() { try { if (ctx && ctx.state === 'running') ctx.suspend(); } catch (e) { /* 何もしない */ } },
    resume() { if (enabled && ctx) ac(); },
    names: Object.keys(SOUNDS),
  };
})();
