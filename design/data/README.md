# データの形式

## セーブデータ（localStorage）

- キー: `observer.save.v1`
- 値: 次の JSON を文字列にしたもの

```json
{
  "version": 1,
  "savedAt": "2026-11-03T14:00:00.000Z",
  "state": {
    "chapter": 1,
    "sceneId": "check_cam3",
    "camera": "CAM-03",
    "mode": "past",
    "flags": { "cam_unlocked": true, "clue_shadow": true }
  }
}
```

| 項目 | 内容 |
|---|---|
| `version` | セーブデータの形式の版。読み込むときに違えば、セーブがないものとして扱う |
| `chapter` | 現在の章 |
| `sceneId` | 現在の場面（`SCENES` のキー）。存在しない場面ならセーブがないものとして扱う |
| `camera` / `mode` | 表示中のカメラと映像モード（`live` / `past`） |
| `flags` | 立っているフラグ（立っていないものは書かない） |

- 形式を変えたら、キーの `v1` と `version` を両方上げる。古いセーブを引き継ぐ必要があるときは、読み込み時に変換する処理を足す。
- `localStorage` が使えない環境（ブラウザの設定で禁止されているなど）では、保存できなかったことをお知らせで伝え、ゲームは続けられるようにする。

## シナリオ（SCENES）

```js
sceneId: {
  chapter: 1,                 // 入ったときに章を変える（省略可）
  camera: 'CAM-03',           // 入ったときにカメラを変える（省略可）
  mode: 'live',               // 入ったときに映像モードを変える（省略可）
  set: ['flag'],              // 入ったときに立てるフラグ（省略可）
  lines: [{ name: '私', text: '…' }],  // name が空なら地の文
  set_after: ['flag'],        // 文章を読み終えたときに立てるフラグ（省略可）
  choices: [
    { text: '…', next: 'sceneId', set: ['flag'], requires: ['flag'] },
  ],
}
```

- `choices` の `requires` のフラグがすべて立っているときだけ、その選択肢を表示する。
- `choices` が空の場面は、そこで止まる（準備中の章など）。

## カメラ（CAMERAS）

```js
'CAM-03': {
  place: '3F 東側廊下',
  live: { draw: { type: 'corridor', doorOpen: true }, lines: [ … ] },
  past: {
    draw: { type: 'corridor', figure: true },
    lines: [ … ],
    onView: { requires: 'cam_unlocked', set: 'clue_shadow' },
  },
},
```

- `draw.type`: 描く絵の種類（`corridor` / `lobby` / `stairs`）。
- `onView`: その映像を見たときに立てるフラグ。`requires` のフラグが立っているときだけ立てる。
- **未実装**: 章や場面によってカメラの映像を変える仕組み（今は章によらず同じ映像）。
