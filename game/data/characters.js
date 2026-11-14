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
  normal: 'chars/reiko_normal.png',
  smile: 'chars/reiko_smile.png',
  sad: 'chars/reiko_sad.png',
});
Observer.character('佐伯', {
  normal: 'chars/saeki_normal.png',
  smile: 'chars/saeki_smile.png',
  scorn: 'chars/saeki_scorn.png',
  flushed: 'chars/saeki_flushed.png',
});
Observer.character('華子', {
  normal: 'chars/hanako_normal.png',
  angry: 'chars/hanako_angry.png',
  rage: 'chars/hanako_rage.png',
});
Observer.character('瀬名', {
  normal: 'chars/sena_normal.png',
  smile: 'chars/sena_smile.png',
});
Observer.character('城ヶ崎', {
  normal: 'chars/jogasaki_normal.png',
  scorn: 'chars/jogasaki_scorn.png',
  aroused: 'chars/jogasaki_aroused.png',
  after: 'chars/jogasaki_after.png',
});
Observer.character('久住', {
  normal: 'chars/kuzumi_normal.png',
});
Observer.character('大河内', {
  normal: 'chars/okochi_normal.png',
});
