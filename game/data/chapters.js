'use strict';
/* ===================================================================
   章の一覧
   - no: 章の番号 / title: 題名
   - script: 台本の名前（scenario/ のファイルで Observer.script('名前', ...) と書いたもの）。
     まだ台本がない章は null（章選択で「準備中」と出る）
   - start: 章を始めるラベル
   - hidden: true なら、@unlock されるまで章選択に出さない
   =================================================================== */

Observer.chapters = [
  { no: 1, title: '欲望の代償', script: 'chapter1', start: '*start' },
  { no: 2, title: '蜜の味と脅迫', script: null, start: '*start' },
  { no: 3, title: '消えた愛人とタイムパラドックス', script: null, start: '*start' },
  { no: 4, title: '追い詰められた観測者', script: null, start: '*start' },
  { no: 5, title: '深淵を覗く者', script: null, start: '*start', hidden: true },
];
