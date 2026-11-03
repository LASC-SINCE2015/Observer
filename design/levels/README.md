# 章の構成

章ごとの場面のつながりと、手がかりの配置を書きます。

## 第1章　消えた夜警（仮のシナリオ）

### 場面のつながり

```
start ──→ check_cam3 ──→ door_log ──→ decide ──→ ending_normal（通常解決）──→ chapter2_start
                  └───────────────────→ decide ──→ ending_true（真解決）────→ chapter2_start
```

- `decide` からは `door_log` に戻れる。
- `ending_normal` からは `start` に戻って真相を探し直せる。

### 手がかり

| フラグ | 表示名 | 得る方法 |
|---|---|---|
| `clue_shadow` | 影 | `check_cam3` 以降に、CAM-03 を過去の映像に切り替える |
| `clue_door_log` | 扉の記録 | `door_log` に入る |
| `clue_time_gap` | 空白の6分 | `door_log` の文章を読み終える |

3 つそろうと、`decide` に真解決への選択肢が出る。

### 難易度の考え方

- 選択肢だけを選んでいくと、通常解決になる。
- 真解決には、選択肢にない「過去の映像への切り替え」を自分で試す必要がある。文章でヒントを出す（`check_cam3`）。
