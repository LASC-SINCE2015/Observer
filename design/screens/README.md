# 画面の構成

今は画面が 1 枚だけです（タイトル画面・設定画面は**未実装**）。配置は [spec/04_view.md](../../spec/04_view.md) を参照してください。

| 要素 | HTML の id | 更新する関数 |
|---|---|---|
| ステータス | `chapter` / `flag-normal` / `flag-true` / `clues` / `version` | `renderStatus` |
| 監視モニター | `screen`（Canvas）/ `rec` | `renderMonitor`（毎フレーム）/ `renderControls` |
| カメラのボタン | `camera-buttons` | `buildCameraButtons`（起動時）/ `renderControls` |
| 映像モードのボタン | `btn-live` / `btn-past` | `renderControls` |
| セーブ・最初から | `btn-save` / `btn-reset` | − |
| テキストウィンドウ | `textbox` / `speaker` / `message` | `showLines` ほか |
| 選択肢 | `choices` | `renderChoices` |
| お知らせ | `toast` | `showToast` |
