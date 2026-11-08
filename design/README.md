# 設計書 (design)

Observer の設計書（どう作るか）を置くフォルダです。仕様（何を作るか）は [spec/](../spec/README.md) を参照してください。

## フォルダ構成

| フォルダ | 内容 |
|---|---|
| [architecture/](architecture/README.md) | フォルダ構成・コードの分け方・描画と進行の仕組み |
| [data/](data/README.md) | セーブデータ、シナリオ・カメラの定義の形式 |
| [screens/](screens/README.md) | 画面の構成（今は 1 画面） |
| [sequences/](sequences/README.md) | 場面の進行・映像の切り替え・セーブの処理の流れ |
| [levels/](levels/README.md) | 章の作り方の共通の決まり（場面の組み立て・手がかりの置き方・フラグの名前・難易度） |
| [decisions/](decisions/README.md) | 設計判断の記録（ADR） |

## 実装状況の書き方

- 設計書は、現在の実装（game/）に合わせて書く。
- 仕様にはあるが作っていないものは「**未実装**」と明記する。

## 図

- 図は PlantUML（`.puml`）で書き、各フォルダの `diagrams/` に置く。
- md からは、同じ名前の SVG を参照する（PlantUML がなくても見られるようにするため）。
- Graphviz は不要（PlantUML 内蔵の smetana レイアウトを使う。各 `.puml` に `!pragma layout smetana` を入れる）。
- `.puml` を変更したら、[tools/](../tools/) のスクリプトで SVG を作り直し、`.puml` と `.svg` を一緒にコミットする。
