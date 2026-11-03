# Observer

深夜のビルの中央監視室を舞台にした、ブラウザで遊ぶサスペンス・アドベンチャーゲームです。監視カメラの「現在の映像」と「過去の映像」を切り替えて手がかりを集め、事件の真相に迫ります。

- 純粋な HTML5 / CSS / JavaScript（外部ライブラリなし）
- セーブはブラウザの `localStorage`（サーバー不要）
- GitHub Pages で公開

## 遊び方（手元で）

`game/index.html` をブラウザで開くだけで動きます。

## フォルダ構成

| フォルダ | 内容 |
|---|---|
| [spec/](spec/README.md) | 仕様書（何を作るか） |
| [design/](design/README.md) | 設計書（どう作るか）。図は PlantUML と SVG |
| [game/](game/) | ゲーム本体。このフォルダが GitHub Pages で公開される |
| [assets_src/](assets_src/README.md) | 素材の元ファイル（編集用）とライセンスの記録 |
| [testing/](testing/README.md) | 確認内容（テスト計画）と確認結果 |
| [tools/](tools/README.md) | 開発用スクリプト（PlantUML → SVG など） |
| [.github/workflows/](.github/workflows/pages.yml) | GitHub Pages への公開（GitHub Actions） |
