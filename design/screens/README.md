# 画面の構成

画面は 4 つです（`index.html` の `<section class="screen">`）。切り替えは `showScreen(名前)`（`game.js`）。配置と見た目は [spec/04_view.md](../../spec/04_view.md) を参照してください。

| 画面 | HTML の id | 内容 | 組み立てる関数 |
|---|---|---|---|
| タイトル | `title-screen` | はじめから・つづきから・章を選ぶ・記録・このゲームについて・音 | `renderTitle` |
| 章選択 | `select-screen` | 章の一覧（色と印で状態を示す）・記録・タイトルへ | `renderSelect` |
| このゲームについて | `about-screen` | 概要・遊び方・内容の注意・バージョン（HTML に直接書いてある） | − |
| 監視室 | `game-screen` | ゲームの本体。下の表 | 下の表 |

## 監視室の画面の部品

| 要素 | HTML の id | 更新する関数 |
|---|---|---|
| ステータス（章・時刻・バージョン） | `st-chapter` / `st-time` / `st-version` | `renderStatic` ほか |
| 監視モニター | `monitor` / `main`（Canvas）/ `rec` / `mic` / `place-tag` | `renderStatic`・毎フレームの描画（`renderer.js`） |
| 立ち絵 | `portrait-left` / `portrait-right` | `renderPortraits` |
| テキストウィンドウ | `textbox` / `speaker` / `message` | `showText` ほか |
| 選択肢 | `choices` | `renderChoices` |
| タイムライン（過去のときだけ） | `timeline` / `tl-range` / `tl-marks` / `tl-remain` | `renderTimeline` |
| モニター壁（名前だけのボタン） | `wall` | `buildWall`・`renderWallMarks`・`renderLocks` |
| 操作ボタン | `btn-live` / `btn-past` / `btn-log` / `btn-items` / `btn-note` / `btn-history` / `btn-auto` / `btn-skip` / `btn-save` / `btn-menu` | − |

## 重ねて出すもの

| 要素 | HTML の id | 用途 |
|---|---|---|
| パネル | `panel` | ログ・アイテム・手帳・履歴・メニュー・記録（`openPanel(題, 中身を作る関数)`） |
| カード | `card` | 章の題・エンディング・失敗のカード（`showCard`） |
| 機器のメニュー | `hotmenu` | 過去の映像で、干渉できる機器を押したときの動作の選択 |
| フラッシュ | `fx-flash` | 画面の白い光（`@fx flash`） |
| お知らせ | `toast` | 保存・手帳に書き留めたなどの短い表示 |
| エラー | `errors` | 台本のエラー（`?debug` のときだけ表示） |
| デバッグ | `debug` | `?debug` のときだけ表示する枠 |
