# データの形式

| データ | ファイル | 説明 |
|---|---|---|
| 台本 | `game/scenario/chapter<N>.js` | 章ごとのシナリオ。書き方は [scenario_format.md](scenario_format.md) |
| カメラの一覧 | `game/data/cameras.js` | 全章で共通のカメラ（ID・場所・背景・音が入るか） |
| 章の一覧 | `game/data/chapters.js` | 章の番号・題名・台本の名前・始まりのラベル・隠すかどうか |
| 人物ノート | `game/data/people.js` | 記録の画面の「人物ノート」の項目。人物ごとに、見出し（手帳のあだ名と、書き直されたあとの名前）と、台本の `@trait キー` で書き足される項目を決める。進行は `progress.traits`（章をまたいで残る）に入る |
| セーブ | ブラウザの `localStorage` | 下の 3 つ |

## セーブ（localStorage）

2 つに分けて保存します（ほかに、下の「無い絵の記憶」がある）。どちらも、形式を変えたらキーの `v2` と `version` を両方上げます（古いデータは読み込まずに、ないものとして扱う）。

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
    "relay": null, "splash": false, "black": null, "lastHotspot": null,
    "portraits": {}, "notebook": [], "clockHidden": false, "cinema": false, "vars": {}
  }
}
```

- 時刻は、1 日目の 0:00 からの分（`1/00:00` = 0、`2/01:30` = 1530）。
- `portraits` は出ている立ち絵、`notebook` は八島の手帳（この周回で書いた行）、`clockHidden` は `@time -` で時刻を隠している状態、`cinema` は予告のあいだ画面の枠を隠している状態、`vars` は `@settime` で覚えた時刻。
- 台本が書き換わって、保存したラベルがなくなっていたら、章の始めから再開する。
- 時間切れ（`@idle`）の待ちは、セーブに入れない（ラベルの先頭から読み直すと、また設定される）。

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
    "sound": false,
    "chapterNotes": { "1": [{ "ch": 1, "at": 1530, "where": "…", "text": "…", "struck": false }] },
    "noIdle": false,
    "auto": false
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
| `chapterNotes` | 章を通常解決で終えたときの、その章で書いた手帳の行（章を選んで始めたとき、前の章までの分を手帳に入れる）。キー `5` だけは、最終章の真解決で終えたときの全章ぶんで、記録の画面から読み返せる。`@strike` の線（`struck`）も入る |
| `noIdle` | 「時間切れなし」の設定（メニューで切り替える。オンのとき、台本の `@idle` は無視する） |
| `auto` | 「オート」を入れているか |

- 読み込むときは、古い記録にない項目を初期値で補い、型の合わない項目は捨てる。

- `localStorage` が使えない環境では、保存できないまま遊べる（エラーにしない）。

### 無い絵の記憶 `observer.missing.v1`

```json
{ "v": "0.3.0", "t": 1763800000000, "paths": ["scenes/ch4_staff_card.jpg"] }
```

- まだ作っていない絵（404）のパスを覚えて、毎回取りに行かないようにする（コンソールに 404 が並ぶのを防ぐ）。
- 同じバージョンで、24 時間以内のあいだだけ使う。バージョンが上がるか 24 時間たつと、捨ててまた読みに行く。`?debug` のときは覚えない。
- ゲームの進行には関係しないので、形式を変えても `version` は上げず、`v`（ゲームのバージョン）が違えば捨てる。
- 理由は [ADR 0008](../decisions/0008_remember_missing_images.md)。
