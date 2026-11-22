'use strict';
/* ===================================================================
   人物ノートの一覧（記録の画面の「人物ノート」）
   - 台本の @trait キー で、その項目が書き足される（章をまたいで残る）
   - alias: 八島が手帳に書くあだ名（見出し）。null のときは「（書きかけて、線で消してある）」
   - nameKey: この @trait を書いたあと、見出しがあだ名から name に変わる（手帳の行が名前に書き直されたとき）
   - traits: 項目。text は見つけたときの文。after を持つ項目は、after.key が書かれたあとに、文が after.text に変わる
   - 見つけていない項目は「？？？」と出る。画面に出ない真相は書かない（遊べば見える内容だけ）
   =================================================================== */

Observer.people = [
  {
    id: 'saeki', alias: 'カメラ奉行', name: '佐伯 瑠璃', nameKey: 'name_saeki', role: '1F ブランドショップの店長',
    traits: [
      { key: 'saeki_mirror', text: '閉店後、売り物のバッグを肩にかけて、鏡の前に立つ。値札を見て、棚に戻す。' },
      { key: 'saeki_handkerchief', text: '店を辞めたあと、値札を見ずに、小さなハンカチを一枚だけ買った。' },
    ],
  },
  {
    id: 'reiko', alias: '一ノ瀬さん', name: '岸本 千尋', nameKey: 'name_reiko', role: '9F サロンのママ',
    traits: [
      { key: 'reiko_look', text: 'エレベーターを待つあいだ、カメラを見上げる。', after: { key: 'name_reiko', text: 'カメラを見上げたのは、命令された芝居だった。' } },
      { key: 'reiko_name', text: '八島の名前も、缶コーヒーのことも、覚えている。' },
    ],
  },
  {
    id: 'kuzumi', alias: '角そろえ', name: '久住 正臣', nameKey: null, role: 'ビル管理会社の所長',
    traits: [
      { key: 'kuzumi_can', text: '夜勤の始めに、温かい缶コーヒーを一本置いていく。空き缶は、持って帰る。' },
      { key: 'kuzumi_binder', text: '届け出の控えの綴りに、1 冊だけ、角のそろっていないものがあった。自分の分。' },
    ],
  },
  {
    id: 'jogasaki', alias: '揉み手先生', name: '城ヶ崎 拓海', nameKey: null, role: '6F 法律事務所の弁護士',
    traits: [
      { key: 'jogasaki_hand', text: '昼は威張る。奥さんの前では、揉み手。' },
    ],
  },
  {
    id: 'hanako', alias: '三時前', name: '城ヶ崎 華子', nameKey: null, role: '6F 法律事務所の代表弁護士',
    traits: [
      { key: 'hanako_onigiri', text: '夫が帰ったあとも、ひとりで残る。夕飯は、1F のコンビニのおにぎり。' },
      { key: 'hanako_thanks', text: '内線の最後に、必ず「ご苦労さま」と言う。このビルで、そう言うのは、この人だけ。' },
      { key: 'hanako_reply', text: '八島の「ご苦労さまでした」に、一拍、間が空いた。' },
    ],
  },
  {
    id: 'saijo', alias: '消毒先生', name: '西条 賢一郎', nameKey: null, role: '3F 美容クリニックの院長',
    traits: [
      { key: 'saijo_plaque', text: '金庫を開ける前に、壁の感謝状の傾きを、指で直す。' },
    ],
  },
  {
    id: 'misaki', alias: '差し入れ', name: '桐谷 美咲', nameKey: 'name_misaki', role: '3F クリニックの看護師',
    traits: [
      { key: 'misaki_wave', text: '3F の廊下のカメラに、小さく手を振る。' },
      { key: 'misaki_count', text: '八島の缶コーヒーの本数を、数えている。' },
    ],
  },
  {
    id: 'okochi', alias: 'ガム刑事', name: '大河内 誠司', nameKey: null, role: '刑事',
    traits: [
      { key: 'okochi_notebook', text: '古い手帳に、鉛筆で、見たことだけを書く。' },
      { key: 'okochi_seat', text: '前任の監視員の空いた椅子には、ずっと座らなかった。最後に、座った。' },
    ],
  },
  {
    id: 'sena', alias: null, name: '瀬名 遥', nameKey: 'name_sena', role: '夜間清掃の作業員',
    traits: [
      { key: 'sena_crack', text: '手を止めると、壁や柱のひびを、指でなぞる。' },
    ],
  },
];

// 台本の @trait で使えるキー（読み込み時の確認用）
Observer.traitKeys = new Set();
Observer.people.forEach((p) => {
  if (p.nameKey) Observer.traitKeys.add(p.nameKey);
  p.traits.forEach((t) => Observer.traitKeys.add(t.key));
});
