# 開発用スクリプト (tools)

ゲーム本体ではなく、ドキュメントの作成などに使うスクリプトを置くフォルダです。

| スクリプト | 用途 |
|---|---|
| [render_diagrams.ps1](render_diagrams.ps1) | design/ 配下の PlantUML（.puml）から SVG を生成する |
| [optimize_images.ps1](optimize_images.ps1) | 絵の元ファイル（assets_src/images/）を、ゲームで使う大きさと形式にして game/assets/ に書き出す |
| [playtest.js](playtest.js) | 台本を、ブラウザなしで最後まで自動で通して遊び、エラーや行き詰まりを見つける |
| [portraits_to_webp.js](portraits_to_webp.js) | 立ち絵の PNG を、透明を残したまま WebP にする（公開サイトでの読み込みを速くする） |

## playtest.js

台本を書き換えたら、これで最後まで通るか確かめます。Node.js が必要です（ほかのインストールは不要）。

```bash
node tools/playtest.js 1 normal
```

- 章は 1〜5。第1〜5章の 4 ルート（`normal`・`bad`・`true`・`mistakes`）で、合わせて 20 本ある。台本や仕組みを書き換えたら、20 本すべてを、1 本ずつ順に通す（同時に走らせない。遅いものがある）。

- 1 つ目の引数は章の番号（1〜5）、2 つ目はルート（`normal` = 通常解決 / `bad` = バッドエンドを通ってから通常解決 / `true` = 真解決 / `mistakes` = 誘導パズルの外れの干渉を先に試し、失敗とやり直しを通ってから通常解決）。
- 時間切れ（`@idle`）は、「時間切れなし」の設定で遊ぶので、発火しない（ボタンの選択肢を押して進む）。
- `OK` なら最後まで通った。`NG` のときは、止まったラベルと、直前の操作を表示して、終了コード 1 で終わる。
- `VERBOSE=1 node tools/playtest.js 1 normal` で、自動でした操作をすべて表示する。
- 絵のパスも確かめる。台本の `img:`（@feed・@event・@outside など）、`@show` の立ち絵（表情名と、その絵のファイル）、`data/cameras.js` の `bgimg` が、`game/assets/` にあるか。最後に、見つからない絵を 1 行 1 件（章・行・ラベル・パス）で出す（最大 30 件、超えたら「ほか N 件」）。
  - `assets_src/new_prompts_ch*.md` の「### ⬜ 名前」にある名前は `[未生成（既知）]`（終了コードは 0 のまま）。それ以外は `[参照の誤り]`（終了コード 1）。
  - `characters.js` にない表情名の `@show` も `[参照の誤り]`（終了コード 1）。
  - `new_prompts_ch*.md` を読めないときは、見つからない絵をすべて警告として出し、終了コードは 0。
  - 調べるのは、起動した章の台本だけ（途中で次の章へ進んでも、起動した章の分）。`cameras.js` は全カメラを調べる。
- 見た目（描画）は確かめない。見た目はブラウザで開いて確かめる。

## portraits_to_webp.js

立ち絵は PNG のままだと 1 枚 1MB 前後になり、公開サイトで台詞より遅れて出ます。`optimize_images.ps1` で `game/assets/chars/*.png` を書き出したら、これで WebP にします。Node.js とブラウザだけで動きます（ほかのインストールは不要）。

```bash
node tools/portraits_to_webp.js
```

1. 表示された URL（http://127.0.0.1:8766/）をブラウザで開く。ブラウザが PNG を WebP に変換し、`game/assets/chars/` に `<名前>.webp` を保存する。
2. 終わるとサーバーは自動で止まる。
3. `game/data/characters.js` のパスを `.webp` にし、PNG を消す。

## render_diagrams.ps1

設計書の図は PlantUML で書き、PlantUML がない人でも見られるように SVG も一緒にリポジトリに入れています。`.puml` を変更したら、このスクリプトで SVG を作り直してコミットしてください。

### 必要なもの

- Java 21 以上
- PlantUML の jar ファイル（https://github.com/plantuml/plantuml/releases の `plantuml-mit-<バージョン>.jar`）
- Graphviz は不要です（図は PlantUML 内蔵の smetana レイアウトを使います）。

### 実行（リポジトリ直下で）

```powershell
$env:PLANTUML_JAR = "<plantuml.jar のパス>"
./tools/render_diagrams.ps1
```

`-Jar <plantuml.jar のパス>` で直接指定することもできます。
