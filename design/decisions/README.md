# 設計判断の記録 (decisions)

設計で迷ったことと、そう決めた理由を ADR（Architecture Decision Record）として残す。あとから「なぜこうなっているのか」を確認できるようにするため。

## 書き方

- ファイル名: `NNNN_<内容がわかる英語名>.md`（NNNN は 4 桁の通し番号）。
- 項目: 状態（採用 / 置き換え済み など）・日付・状況・決定・理由・影響。
- 決定を変えるときは、元の ADR を書き換えずに新しい ADR を作り、元の ADR の状態を「置き換え済み（NNNN）」にする。

## 一覧

| No | 内容 | 状態 |
|---|---|---|
| [0001](0001_single_html_no_library.md) | 外部ライブラリを使わず、1 ファイルの HTML で作る | 一部置き換え済み（0004） |
| [0002](0002_save_in_localstorage.md) | セーブはブラウザの localStorage に保存する | 採用 |
| [0003](0003_publish_game_folder_with_actions.md) | GitHub Actions で game/ フォルダだけを公開する | 採用 |
| [0004](0004_split_scenario_data_by_chapter.md) | シナリオのデータを章ごとの JS ファイルに分ける | 一部置き換え済み（0005） |
| [0005](0005_scenario_as_text_script.md) | シナリオを台本形式（テキスト）で書き、仕組みも役割ごとのファイルに分ける | 採用 |
