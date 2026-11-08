'use strict';
/* ===================================================================
   監視映像の描画（Canvas）
   - すべて 320x180 の座標で描く。小さい映像（モニター壁）は縮小して同じ関数で描く。
   - 人物は顔のわからない「影」として描く。
   =================================================================== */

(function () {
  const W = 320;
  const H = 180;
  const FLOOR = 150;

  const TINTS = {
    live: [92, 255, 138],
    past: [255, 179, 71],
    outside: [205, 212, 228],
  };

  /* ---------- 絵（画像ファイル） ----------
     - パスは game/assets/ からの相対パス。初めて使うときに読み込み、読み込めたものだけ描く
     - 読み込めない（ファイルがまだない）ときは null を返し、呼び出し側は線の絵で代わりに描く */
  const imageCache = {};
  function image(path) {
    if (!path) return null;
    let e = imageCache[path];
    if (!e) {
      const img = new Image();
      e = imageCache[path] = { img, ok: false, failed: false };
      img.onload = () => { e.ok = true; };
      img.onerror = () => { e.failed = true; };
      img.src = `assets/${path}`;
    }
    return e.ok ? e.img : null;
  }

  // 画面いっぱいに、はみ出す部分を切って描く
  function drawCover(c, img) {
    const k = Math.max(W / img.width, H / img.height);
    const w = img.width * k;
    const h = img.height * k;
    c.drawImage(img, (W - w) / 2, (H - h) / 2, w, h);
  }

  // 監視映像の色にする（明るさは残して、色を緑・琥珀色に寄せる）
  // - TINT_AMOUNT: 色を寄せる強さ（1 で完全に単色。少し残すと、ドレスの赤などがうっすら見える）
  // - TINT_DARKEN: 全体を暗くする強さ（掛け合わせる色。255 で暗くしない）
  const TINT_AMOUNT = 0.65;
  const TINT_DARKEN = 215;
  function tintImage(c, tint, strong) {
    c.save();
    c.globalCompositeOperation = 'color';
    c.globalAlpha = strong ? TINT_AMOUNT : 0.25;
    c.fillStyle = rgba(tint, 1);
    c.fillRect(0, 0, W, H);
    c.globalAlpha = 1;
    c.globalCompositeOperation = 'multiply';
    const k = strong ? TINT_DARKEN : 235;
    c.fillStyle = `rgb(${k}, ${k}, ${k})`;
    c.fillRect(0, 0, W, H);
    c.restore();
  }

  function rgba(c, a) {
    return `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${a})`;
  }

  function line(c, x1, y1, x2, y2) {
    c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.stroke();
  }

  /* ---------- 背景 ---------- */
  const BACKGROUNDS = {
    // B2 中央監視室: モニターの壁と、2 つの椅子
    room(c) {
      c.strokeStyle = rgba(c.tint, 0.45);
      for (let r = 0; r < 3; r++) {
        for (let k = 0; k < 6; k++) {
          c.strokeRect(40 + k * 40, 20 + r * 26, 34, 20);
          c.fillStyle = rgba(c.tint, 0.08 + ((k + r) % 3) * 0.04);
          c.fillRect(41 + k * 40, 21 + r * 26, 32, 18);
        }
      }
      line(c, 20, 110, 300, 110);
      c.strokeRect(30, 110, 260, 10);
      [110, 200].forEach((x) => {
        c.strokeRect(x, 125, 26, 14);
        line(c, x + 13, 139, x + 13, 158);
        line(c, x + 2, 158, x + 24, 158);
      });
    },
    // 1F ロビー: 受付、正面のガラス扉、壁のテレビ
    lobby(c, t) {
      line(c, 0, 130, W, 130);
      c.fillStyle = rgba(c.tint, 0.1);
      c.fillRect(20, 92, 110, 38);
      c.strokeRect(20, 92, 110, 38);
      c.fillStyle = rgba(c.tint, 0.35);
      c.fillRect(58, 86, 30, 3);
      c.strokeRect(150, 30, 80, 100);
      line(c, 190, 30, 190, 130);
      // テレビ（ニュースの字幕が流れる）
      c.strokeRect(244, 34, 60, 34);
      c.fillStyle = rgba(c.tint, 0.15);
      c.fillRect(245, 35, 58, 32);
      c.fillStyle = rgba(c.tint, 0.5);
      const off = (t * 18) % 80;
      c.fillRect(245 + 58 - off, 60, 30, 3);
    },
    // 1F ブランドショップ: 棚のバッグと、レジのカウンター
    shop(c) {
      line(c, 0, 140, W, 140);
      for (let s = 0; s < 3; s++) {
        line(c, 10, 40 + s * 30, 120, 40 + s * 30);
        for (let k = 0; k < 4; k++) c.strokeRect(16 + k * 26, 26 + s * 30, 16, 12);
      }
      c.fillStyle = rgba(c.tint, 0.12);
      c.fillRect(170, 100, 110, 40);
      c.strokeRect(170, 100, 110, 40);
      c.strokeRect(250, 88, 18, 12);
      c.strokeRect(150, 20, 160, 12);
    },
    // 1F 東廊下: 奥へ細くなる廊下。左の壁に非常ベル、右の天井に防犯センサー
    corridor(c) {
      const vx = W / 2;
      const vy = 78;
      line(c, 0, H, vx - 30, vy + 25);
      line(c, W, H, vx + 30, vy + 25);
      line(c, 0, 0, vx - 30, vy - 30);
      line(c, W, 0, vx + 30, vy - 30);
      for (let i = 1; i < 6; i++) {
        const k = i / 6;
        const y = H - (H - (vy + 25)) * k;
        const half = (W / 2) - ((W / 2) - 30) * k;
        c.strokeStyle = rgba(c.tint, 0.12 + k * 0.1);
        line(c, vx - half, y, vx + half, y);
      }
      c.strokeStyle = rgba(c.tint, 0.55);
      c.strokeRect(vx - 30, vy - 30, 60, 55);
      c.strokeRect(vx - 12, vy - 18, 24, 43);
      c.fillStyle = rgba(c.tint, 0.25);
      c.fillRect(vx - 40, 18, 80, 4);
      c.beginPath(); c.arc(36, 68, 5, 0, Math.PI * 2); c.stroke();
      c.strokeRect(256, 36, 12, 7);
    },
    // 1F バックヤード: 段ボールの山、棚、奥の扉、壁の非常ベル
    backyard(c) {
      line(c, 0, 145, W, 145);
      c.fillStyle = rgba(c.tint, 0.1);
      [[60, 110, 40, 35], [70, 82, 30, 28], [104, 120, 36, 25]].forEach(([x, y, w, h]) => {
        c.fillRect(x, y, w, h); c.strokeRect(x, y, w, h);
      });
      for (let s = 0; s < 4; s++) line(c, 250, 40 + s * 28, 310, 40 + s * 28);
      line(c, 250, 40, 250, 145); line(c, 310, 40, 310, 145);
      c.strokeRect(160, 50, 44, 95);
      c.beginPath(); c.arc(30, 60, 6, 0, Math.PI * 2); c.stroke();
      c.fillStyle = rgba(c.tint, 0.3);
      c.fillRect(150, 10, 60, 3);
    },
    // 6F 法律事務所: 窓の夜景、左に城ヶ崎の机、右に華子の机、天井のスピーカー
    office(c) {
      c.strokeRect(20, 18, 280, 48);
      for (let k = 1; k < 7; k++) line(c, 20 + k * 40, 18, 20 + k * 40, 66);
      c.fillStyle = rgba(c.tint, 0.35);
      for (let k = 0; k < 24; k++) c.fillRect(24 + ((k * 37) % 272), 30 + ((k * 13) % 30), 2, 2);
      line(c, 0, 140, W, 140);
      [[40, 104], [200, 104]].forEach(([x, y]) => {
        c.fillStyle = rgba(c.tint, 0.1);
        c.fillRect(x, y, 80, 10); c.strokeRect(x, y, 80, 10);
        line(c, x + 6, y + 10, x + 6, 140); line(c, x + 74, y + 10, x + 74, 140);
        c.strokeRect(x + 56, y - 6, 12, 6);
      });
      c.beginPath(); c.arc(160, 10, 5, 0, Math.PI); c.stroke();
    },
    // エレベーターホール: 中央の扉、上の階数表示、呼び出しボタン
    evhall(c) {
      line(c, 0, 150, W, 150);
      c.strokeRect(130, 50, 60, 100);
      line(c, 160, 50, 160, 150);
      c.strokeRect(146, 36, 28, 9);
      c.strokeRect(198, 96, 6, 10);
      c.strokeRect(40, 40, 50, 70);
    },
    evhall9(c, t) {
      BACKGROUNDS.evhall(c, t);
      c.fillStyle = rgba(c.tint, 0.3);
      c.font = '7px serif';
      c.fillText('Le Ciel', 46, 56);
      c.beginPath(); c.ellipse(260, 120, 14, 22, 0, 0, Math.PI * 2); c.stroke();
      line(c, 260, 142, 260, 150);
    },
    // エレベーターの中: 奥の壁と手すり、天井の表示板
    elevator(c) {
      c.strokeRect(60, 20, 200, 140);
      line(c, 0, 0, 60, 20); line(c, W, 0, 260, 20);
      line(c, 0, H, 60, 160); line(c, W, H, 260, 160);
      line(c, 70, 110, 250, 110);
      c.strokeRect(140, 26, 40, 10);
      c.strokeRect(270, 70, 14, 40);
    },
    // 屋上: 手すりと給水塔
    roof(c) {
      line(c, 0, 120, W, 120);
      for (let x = 0; x < W; x += 16) line(c, x, 100, x, 120);
      line(c, 0, 100, W, 100);
      c.strokeRect(230, 40, 50, 60);
      line(c, 240, 100, 240, 120); line(c, 270, 100, 270, 120);
    },
    // 非常階段
    stairs(c) {
      for (let i = 0; i < 9; i++) {
        const x = 40 + i * 26;
        const y = H - 20 - i * 15;
        line(c, x, y, x + 26, y);
        line(c, x + 26, y, x + 26, y - 15);
      }
      c.fillStyle = rgba(c.tint, 0.5);
      c.fillRect(W - 60, 20, 30, 12);
    },
    // 屋外: ビルの足もとと歩道
    street(c) {
      const g = c.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, rgba(c.tint, 0.18));
      g.addColorStop(1, rgba(c.tint, 0.02));
      c.fillStyle = g;
      c.fillRect(0, 0, W, H);
      c.strokeStyle = rgba(c.tint, 0.35);
      for (let k = 0; k < 5; k++) c.strokeRect(10 + k * 34, 0, 26, 110);
      line(c, 0, 128, W, 128);
      line(c, 0, 150, W, 150);
      c.strokeRect(200, 40, 90, 88);
      line(c, 245, 40, 245, 128);
    },
    // 屋外の朝: 朝日がまぶしい
    dawn(c, t) {
      BACKGROUNDS.street(c, t);
      const g = c.createRadialGradient(280, 20, 4, 280, 20, 160);
      g.addColorStop(0, 'rgba(255, 250, 235, 0.9)');
      g.addColorStop(1, 'rgba(255, 250, 235, 0)');
      c.fillStyle = g;
      c.fillRect(0, 0, W, H);
    },
    // 何も描かない（暗い場所）
    dark() {},
  };

  /* ---------- 人物（影） ---------- */
  function person(c, x, y, s, opt, t) {
    const a = opt.alpha || 0.55;
    const sway = Math.sin(t * 0.8 + x) * 0.8;
    c.fillStyle = rgba(c.tint, a);
    const hy = y - 36 * s;
    c.beginPath(); c.arc(x + sway, hy, 5 * s, 0, Math.PI * 2); c.fill();
    if (opt.white) {
      c.fillStyle = 'rgba(240, 240, 240, 0.55)';
      c.beginPath(); c.arc(x + sway, hy - 2 * s, 5 * s, Math.PI, 0); c.fill();
      c.fillStyle = rgba(c.tint, a);
    }
    if (opt.cap) c.fillRect(x + sway - 6 * s, hy - 6 * s, 12 * s, 3 * s);
    if (opt.woman) {
      c.fillRect(x + sway - 6 * s, hy - 2 * s, 3 * s, 10 * s);
      c.beginPath();
      c.moveTo(x - 4 * s, y - 30 * s); c.lineTo(x + 4 * s, y - 30 * s);
      c.lineTo(x + 8 * s, y - 8 * s); c.lineTo(x - 8 * s, y - 8 * s);
      c.closePath(); c.fill();
      c.fillRect(x - 4 * s, y - 8 * s, 2 * s, 8 * s);
      c.fillRect(x + 2 * s, y - 8 * s, 2 * s, 8 * s);
    } else if (opt.sit) {
      c.fillRect(x - 5 * s, y - 30 * s, 10 * s, 18 * s);
      c.fillRect(x - 5 * s, y - 14 * s, 14 * s, 4 * s);
    } else {
      c.fillRect(x - 5 * s, y - 30 * s, 10 * s, 18 * s);
      c.fillRect(x - 4 * s, y - 12 * s, 3 * s, 12 * s);
      c.fillRect(x + 1 * s, y - 12 * s, 3 * s, 12 * s);
    }
    if (opt.mop) {
      c.strokeStyle = rgba(c.tint, a);
      c.lineWidth = 1.5;
      line(c, x + 6 * s, y - 24 * s, x + 18 * s + sway * 3, y);
      c.fillRect(x + 12 * s + sway * 3, y - 2, 12 * s, 2);
      c.lineWidth = 1;
    }
  }

  const ACTORS = {
    man: (c, x, y, s, t) => person(c, x, y, s, {}, t),
    woman: (c, x, y, s, t) => person(c, x, y, s, { woman: true }, t),
    oldman: (c, x, y, s, t) => person(c, x, y, s, { white: true }, t),
    cleaner: (c, x, y, s, t) => person(c, x, y, s, { woman: true, mop: true }, t),
    guard: (c, x, y, s, t) => person(c, x, y, s, { cap: true }, t),
    sitman: (c, x, y, s, t) => person(c, x, y, s, { sit: true }, t),
    sitwoman: (c, x, y, s, t) => person(c, x, y, s, { sit: true, woman: true }, t),
    // 抱き合う 2 人
    couple: (c, x, y, s, t) => {
      const k = Math.sin(t * 2.2) * 1.2;
      person(c, x - 4 * s + k, y, s, { alpha: 0.5 }, t);
      person(c, x + 4 * s - k, y, s, { woman: true, alpha: 0.6 }, t);
    },
    // 物の影（落ちたもの・置かれたもの）
    box: (c, x, y, s) => { c.fillStyle = rgba(c.tint, 0.5); c.fillRect(x - 6 * s, y - 8 * s, 12 * s, 8 * s); },
  };

  // 「img:パス kind@x,y,s …」を読む → { img, actors }
  function parseScene(text) {
    const toks = (text || '').trim().split(/\s+/).filter(Boolean);
    const imgTok = toks.find((t) => t.startsWith('img:'));
    const rest = toks.filter((t) => !t.startsWith('img:'));
    return { img: imgTok ? imgTok.slice(4) : null, actors: parseActors(rest.join(' ')) };
  }

  // 「kind@x,y,s」を読む
  function parseActors(text) {
    if (!text) return [];
    return text.trim().split(/\s+/).filter(Boolean).map((tok) => {
      const m = tok.match(/^([a-z]+)@(-?\d+)(?:,(\d+))?(?:,([\d.]+))?$/);
      if (!m) return null;
      return { kind: m[1], x: +m[2], y: m[3] ? +m[3] : FLOOR, s: m[4] ? +m[4] : 1 };
    }).filter(Boolean);
  }

  function drawActors(c, actors, t) {
    (actors || []).forEach((a) => {
      const f = ACTORS[a.kind];
      if (f) f(c, a.x, a.y, a.s, t);
    });
  }

  /* ---------- 画面全体 ---------- */
  // view: { kind, bg, actors, tint, caption:[2 行], burned, hotspots, status, still, blink }
  function render(c, view, t, small) {
    c.save();
    c.fillStyle = '#020403';
    c.fillRect(0, 0, W, H);
    c.lineWidth = 1;
    c.tint = view.tint || TINTS.live;
    c.strokeStyle = rgba(c.tint, 0.5);

    if (view.kind === 'nosignal') {
      drawStatic(c, small ? 160 : 900);
      center(c, view.status || 'NO SIGNAL', c.tint, small);
    } else if (view.kind === 'paused') {
      center(c, view.status || '停止中', c.tint, small);
    } else if (view.kind === 'closed') {
      drawStatic(c, small ? 260 : 2400);
      center(c, '― 映らない ―', c.tint, small);
    } else {
      // 場面の絵があれば、それだけを描く（人物も絵に入っている）。
      // なければ、背景の絵（なければ線の背景）の上に、人物の影を描く
      const scene = image(view.img);
      const bgImg = scene ? null : image(view.bgimg);
      const monitorTint = view.tint !== TINTS.outside;
      if (scene) {
        drawCover(c, scene);
        if (monitorTint) tintImage(c, c.tint, true);
        else tintImage(c, [150, 160, 185], false);
      } else {
        if (bgImg) {
          drawCover(c, bgImg);
          if (monitorTint) tintImage(c, c.tint, true);
        } else {
          (BACKGROUNDS[view.bg] || BACKGROUNDS.dark)(c, t);
        }
        c.strokeStyle = rgba(c.tint, 0.5);
        drawActors(c, view.actors, t);
      }
      if (view.burned) {
        const k = 0.72 + Math.sin(t * 9) * 0.06;
        c.fillStyle = `rgba(255, 246, 228, ${k})`;
        c.fillRect(0, 0, W, H);
        center(c, '― 焼き付いている ―', [120, 90, 60], small);
      }
      if (!small && !view.burned) drawHotspots(c, view.hotspots || [], t);
    }

    if (view.still) {
      c.strokeStyle = rgba(TINTS.past, 0.9);
      c.lineWidth = 3;
      c.strokeRect(2, 2, W - 4, H - 4);
      c.lineWidth = 1;
    }

    if (view.caption && !small) {
      c.fillStyle = rgba(c.tint, 0.85);
      c.font = '8px monospace';
      c.textBaseline = 'top';
      view.caption.forEach((s, i) => c.fillText(s, 6, 6 + i * 11));
    }
    if (view.lamp && Math.floor(t * 4) % 2 === 0) {
      c.fillStyle = 'rgba(255, 40, 40, 0.95)';
      c.beginPath(); c.arc(W - 14, 14, small ? 6 : 4, 0, Math.PI * 2); c.fill();
    }
    c.restore();
  }

  function center(c, text, tint, small) {
    c.fillStyle = rgba(tint, 0.85);
    c.font = small ? '20px monospace' : '12px monospace';
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    c.fillText(text, W / 2, H / 2);
    c.textAlign = 'left';
  }

  function drawStatic(c, n) {
    for (let i = 0; i < n; i++) {
      const v = Math.random() * 0.5;
      c.fillStyle = rgba(c.tint, v);
      c.fillRect(Math.random() * W, Math.random() * H, 2, 1);
    }
  }

  function drawHotspots(c, hotspots, t) {
    const on = Math.floor(t * 2.5) % 2 === 0;
    hotspots.forEach((h) => {
      c.strokeStyle = on ? 'rgba(255, 255, 255, 0.95)' : rgba(c.tint, 0.8);
      c.lineWidth = 1.5;
      c.beginPath(); c.arc(h.x, h.y, on ? 9 : 7, 0, Math.PI * 2); c.stroke();
      c.lineWidth = 1;
      c.fillStyle = 'rgba(255, 255, 255, 0.9)';
      c.font = '8px sans-serif';
      c.textBaseline = 'top';
      const tx = Math.min(Math.max(h.x - 20, 2), W - 60);
      c.fillText(h.name, tx, h.y + 11);
    });
  }

  // 大きい画面だけにかける、ざらついたノイズと横ずれ
  let pixelNoise = true;
  function postEffects(c, canvas, tint, glitch) {
    // ファイルを直接開いたときは、画像を描いた Canvas の画素を読めない（ブラウザの安全のための決まり）。
    // そのときは画素ごとのノイズをやめて、横ずれだけにする
    if (pixelNoise) {
      try {
        noisePixels(c, tint, glitch);
      } catch (e) {
        pixelNoise = false;
      }
    }
    bandShift(c, canvas, glitch);
  }

  function noisePixels(c, tint, glitch) {
    const img = c.getImageData(0, 0, W, H);
    const d = img.data;
    const amount = glitch > 0 ? 90 : 26;
    for (let i = 0; i < d.length; i += 4) {
      const n = (Math.random() - 0.5) * amount;
      d[i] += n * tint[0] / 255;
      d[i + 1] += n * tint[1] / 255;
      d[i + 2] += n * tint[2] / 255;
    }
    c.putImageData(img, 0, 0);
  }

  function bandShift(c, canvas, glitch) {
    const bands = glitch > 0 ? 6 : (Math.random() < 0.03 ? 1 : 0);
    for (let i = 0; i < bands; i++) {
      const y = Math.floor(Math.random() * H);
      const h = 2 + Math.floor(Math.random() * 8);
      const shift = Math.floor((Math.random() - 0.5) * 30);
      c.drawImage(canvas, 0, y, W, h, shift, y, W, h);
    }
  }

  Observer.renderer = { W, H, TINTS, BACKGROUNDS, ACTORS, parseActors, parseScene, image, render, postEffects };
})();
