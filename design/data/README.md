# データの形式

| データ | ファイル | 説明 |
|---|---|---|
| 台本 | `game/scenario/chapter<N>.js` | 章ごとのシナリオ。書き方は [scenario_format.md](scenario_format.md) |
| カメラの一覧 | `game/data/cameras.js` | 全章で共通のカメラ（ID・場所・背景・音が入るか） |
| 章の一覧 | `game/data/chapters.js` | 章の番号・題名・台本の名前・始まりのラベル・隠すかどうか |
| セーブ | ブラウザの `localStorage` | 下の 2 つ |

## セーブ（localStorage）

2 つに分けて保存します。どちらも、形式を変えたらキーの `v2` と `version` を両方上げます（古いデータは読み込まずに、ないものとして扱う）。

### 場面のセーブ `observer.save.v2`

ラベルに入るたびに、そのときの状態を自動で保存します（「保存」ボタンでも同じものを保存する）。再開するときは、保存したラベルの最初から台本を実行し直します。

```json
{
  "version": 2,
  "savedAt": "2026-11-08T14:00:00.000Z",
  "state": {
    "chapter": 1, "script": "chapter1", "label": "*night2",
    "now": 2700, "pastAt": 1532, "mode": "live", "cam": "CAM-04", "power": true,
    "outside": null,
    "flags": { "saw_reiko": true },
    "items": [{ "id": "relay1", "name": "…", "desc": "…", "still": { "cam": "CAM-07", "at": 7340, "actors": [] } }],
    "logs": [{ "kind": "防災盤", "text": "…" }],
    "burned": [[1528, 1545]],
    "cams": { "CAM-04": { "status": "ok", "statusText": "", "actors": [], "look": null, "open": true } },
    "events": [{ "cam": "CAM-04", "from": 1528, "to": 1545, "flag": "saw_burn", "actors": [], "body": [], "seen": false }],
    "hotspots": [],
    "marks": { "CAM-04": [1528] },
    "wall": ["CAM-00", "CAM-01"],
    "relay": null, "splash": false, "black": null, "lastHotspot": null
  }
}
```

- 時刻は、1 日目の 0:00 からの分（`1/00:00` = 0、`2/01:30` = 1530）。
- 台本が書き換わって、保存したラベルがなくなっていたら、章の始めから再開する。

### 章をまたぐ記録 `observer.progress.v2`

```json
{
  "version": 2,
  "progress": {
    "chapters": { "1": { "normal": true, "ready": true, "true": true } },
    "flags": { "relay_ch1": true },
    "endings": { "見ていただけの朝": true },
    "read": { "chapter1:42": 1 },
    "unlocked": { "5": true },
    "shown": { "1": "st-true" },
    "sound": false
  }
}
```

| 項目 | 内容 |
|---|---|
| `chapters` | 章ごとの結末。`normal` = クリア、`ready` = 真解決ができる、`true` = 真解決 |
| `flags` | 章をまたぐフラグ（`@gset`、条件の `g:`） |
| `endings` | 見たエンディング |
| `read` | 読んだ文（既読スキップに使う）。キーは「台本の名前:行番号」なので、台本を書き換えるとずれることがある |
| `unlocked` | `@unlock` で出した章 |
| `shown` | 章選択で前に見せた状態（変わった章だけ、浮かび上がる演出を出すため） |
| `sound` | 音を出すかどうか |

- `localStorage` が使えない環境では、保存できないまま遊べる（エラーにしない）。
