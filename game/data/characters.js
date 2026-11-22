'use strict';
/* ===================================================================
   立ち絵の一覧
   - Observer.character('台本での名前', { 表情: 'game/assets/ からのパス', … })
   - 台本で @show 名前 表情 と書くと、その絵をテキストの上に出す
   - 絵のファイルがまだないときは、何も出さない（ゲームはそのまま遊べる）
   - 必要な絵と作り方は assets_src/README.md
   =================================================================== */

Observer.characters = {};
Observer.character = function (name, faces) {
  Observer.characters[name] = { name, faces };
};

Observer.character('玲子', {
  normal: 'chars/reiko_normal.webp',
  smile: 'chars/reiko_smile.webp',
  sad: 'chars/reiko_sad.webp',
});
Observer.character('佐伯', {
  normal: 'chars/saeki_normal.webp',
  smile: 'chars/saeki_smile.webp',
  scorn: 'chars/saeki_scorn.webp',
  flushed: 'chars/saeki_flushed.webp',
});
Observer.character('華子', {
  normal: 'chars/hanako_normal.webp',
  angry: 'chars/hanako_angry.webp',
  rage: 'chars/hanako_rage.webp',
});
Observer.character('瀬名', {
  normal: 'chars/sena_normal.webp',
  smile: 'chars/sena_smile.webp',
});
Observer.character('城ヶ崎', {
  normal: 'chars/jogasaki_normal.webp',
  scorn: 'chars/jogasaki_scorn.webp',
  aroused: 'chars/jogasaki_aroused.webp',
  after: 'chars/jogasaki_after.webp',
});
Observer.character('久住', {
  normal: 'chars/kuzumi_normal.webp',
});
Observer.character('大河内', {
  normal: 'chars/okochi_normal.webp',
});
Observer.character('西条', {
  normal: 'chars/saijo_normal.webp',
  scared: 'chars/saijo_scared.webp',
});
Observer.character('美咲', {
  normal: 'chars/misaki_normal.webp',
  smile: 'chars/misaki_smile.webp',
});
Observer.character('森下', {
  normal: 'chars/morishita_normal.webp',
});
// 第3章: サロンのママ（三枝沙織）
if (!Observer.characters['沙織']) {
  Observer.character('沙織', {
    normal: 'chars/saori_normal.webp',
    smile: 'chars/saori_smile.webp',
  });
}
if (!Observer.characters['真壁']) {
  Observer.character('真壁', {
    normal: 'chars/makabe_normal.webp',
    smile: 'chars/makabe_smile.webp',
  });
}
