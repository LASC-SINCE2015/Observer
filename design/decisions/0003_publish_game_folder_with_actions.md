# 0003 GitHub Actions で game/ フォルダだけを公開する

- 状態: 採用
- 日付: 2026-11-03

## 状況

GitHub Pages の公開元は「ブランチのルート」「ブランチの docs/」「GitHub Actions」から選べる。リポジトリには、ゲーム本体のほかに仕様書・設計書・素材の元ファイルがある。

## 決定

- 公開元を GitHub Actions にし、`.github/workflows/pages.yml` で `game/` フォルダだけを公開する。
- `master` にプッシュしたときに公開する。手動でも実行できる。

## 理由

- 仕様書・設計書・素材の元ファイルを公開サイトに含めずに済む。
- フォルダ名を `docs/` にしなくてよい（`docs/` は文書のフォルダと紛らわしい）。
- 公開リポジトリなら、GitHub Actions も GitHub Pages も無料で使える。

## 影響

- 初回だけ、リポジトリの Settings → Pages → Source を「GitHub Actions」にする必要がある。
- `game/` に置いたものはすべて公開される。公開したくないファイルを置かない。
