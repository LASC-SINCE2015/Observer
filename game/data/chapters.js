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
  { no: 2, title: '蜜の味と脅迫', script: 'chapter2', start: '*start' },
  { no: 3, title: '消えた愛人とタイムパラドックス', script: 'chapter3', start: '*start' },
  { no: 4, title: '追い詰められた観測者', script: 'chapter4', start: '*start' },
  { no: 5, title: '深淵を覗く者', script: 'chapter5', start: '*start', hidden: true },
];

/* 結末の記録（章選択の「記録」に出す）。title は台本の @ending bad の題と同じにする。
   通常解決・真解決は章の記録（progress.chapters）から出すので、ここにはバッドエンドだけを書く */
Observer.endings = [
  { ch: 1, kind: 'bad', title: '見ていただけの朝' },
  { ch: 1, kind: 'bad', title: '口止め料' },
  { ch: 2, kind: 'bad', title: '契約満了' },
  { ch: 3, kind: 'bad', title: '行方不明' },
  { ch: 4, kind: 'bad', title: '見誤った観測者' },
  { ch: 4, kind: 'bad', title: '調書の一行' },
  { ch: 4, kind: 'bad', title: '疑いやすい相手' },
  { ch: 5, kind: 'bad', title: '観覧席' },
  { ch: 5, kind: 'bad', title: '異常なし' },
];
