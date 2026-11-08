# 開発用スクリプト (tools)

ゲーム本体ではなく、ドキュメントの作成などに使うスクリプトを置くフォルダです。

| スクリプト | 用途 |
|---|---|
| [render_diagrams.ps1](render_diagrams.ps1) | design/ 配下の PlantUML（.puml）から SVG を生成する |
| [optimize_images.ps1](optimize_images.ps1) | 絵の元ファイル（assets_src/images/）を、ゲームで使う大きさと形式にして game/assets/ に書き出す |
| [playtest.js](playtest.js) | 台本を、ブラウザなしで最後まで自動で通して遊び、エラーや行き詰まりを見つける |

## playtest.js

台本を書き換えたら、これで最後まで通るか確かめます。Node.js が必要です（ほかのインストールは不要）。

```bash
node tools/playtest.js 1 normal
```

- 1 つ目の引数は章の番号、2 つ目はルート（`normal` = 通常解決 / `bad` = バッドエンドを通ってから通常解決 / `true` = 真解決 / `mistakes` = 誘導パズルの外れの干渉を先に試し、失敗とやり直しを通ってから通常解決）。
- `OK` なら最後まで通った。`NG` のときは、止まったラベルと、直前の操作を表示して、終了コード 1 で終わる。
- `VERBOSE=1 node tools/playtest.js 1 normal` で、自動でした操作をすべて表示する。
- 見た目（描画）は確かめない。見た目はブラウザで開いて確かめる。

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
