# アーキテクチャ

## リポジトリのフォルダ構成

```
├─ README.md
├─ .gitignore
├─ .github/workflows/pages.yml … master にプッシュしたら game/ を GitHub Pages に公開する
├─ spec/        … 仕様書
├─ design/      … 設計書
│  ├─ architecture/ … この文書
│  ├─ data/         … セーブデータ・定義データの形式
│  ├─ screens/      … 画面の構成
│  ├─ sequences/    … 処理の流れ
│  ├─ levels/       … 章の作り方の共通の決まり
│  └─ decisions/    … 設計判断の記録（ADR）
├─ game/        … ゲーム本体（このフォルダだけが公開される）
│  └─ index.html … HTML・CSS・JavaScript をまとめた 1 ファイル
├─ assets_src/  … 素材の元ファイル（編集用）。公開されない
├─ testing/     … 確認の計画と結果
└─ tools/       … 開発用スクリプト
```

- 画像・音の素材を使うようになったら、書き出したものを `game/assets/`（images/・sounds/）に置き、元ファイルは `assets_src/` に置く。

## game/index.html の中の構成

1 ファイルの中を、次の順に分けて書いています。

| 部分 | 内容 |
|---|---|
| `<style>` | 色（`:root` の変数）・レイアウト・走査線などの演出 |
| HTML | ステータス・モニター・操作ボタン・テキストウィンドウ・選択肢 |
| 定数 | バージョン・セーブのキー・章のタイトル・真解決の手がかり |
| `CAMERAS` | カメラごと・映像モードごとの描画内容と文章 |
| `SCENES` | シナリオ（場面の文章・選択肢・フラグ） |
| 状態 | `state`（セーブする内容） |
| セーブ・ロード | `localStorage` への保存と読み込み |
| 画面の更新 | ステータス・ボタンの表示 |
| テキストウィンドウ | 1 文字ずつ表示する仕組み（`typer`） |
| 場面の進行 | `enterScene`・`renderChoices`・`switchFeed` |
| モニターの描画 | Canvas への描画（場面の絵・時刻・ノイズ・ずれ） |

**データ（`CAMERAS`・`SCENES`）と仕組みを分けている**ので、シナリオを増やすときはデータだけを書き足せばよいようにしています。シナリオのデータは、章ごとの JS ファイル（`game/data/`）に分けていきます（[ADR 0004](../decisions/0004_split_scenario_data_by_chapter.md)）。

## 描画の仕組み

- Canvas は 320x180。CSS で拡大し、`image-rendering: pixelated` で粗い映像に見せる。
- `requestAnimationFrame` で、約 30fps で毎回描き直す。
  1. 背景を塗る
  2. カメラの絵を描く（線と四角だけ。映像モードの色で描く）
  3. カメラ名・時刻を描く
  4. 1 画素ずつ明るさをランダムに足す（ノイズ）
  5. ときどき横方向に帯をずらす（切り替えた直後は多めに）
- 走査線・流れる帯・画面の端の暗さ・ちらつきは CSS で重ねる（Canvas の描画を軽くするため）。

## 色の切り替え

- `body` に `mode-past` クラスを付けると、CSS 変数 `--tint` が緑からアンバーに変わる。ボタンやテキストウィンドウの色はすべて `--tint` を使う。
- Canvas の色は JS の `TINT` を使う。
