# CLAUDE.md

このファイルは、このリポジトリで作業する Claude Code 向けのガイドです。

## プロジェクト概要

- プロジェクト名: task-board
- 概要: タスクの追加・完了切り替え・削除ができるタスクボードアプリ
- 技術スタック: React 19 + Vite(JavaScript / JSX)、CSS は素の CSS
- データ: ブラウザの localStorage(キー `task-board.tasks`)に JSON で保存。タスク変更のたびに保存し、起動時に読み込む

## ディレクトリ構成

```
index.html          Vite のエントリ HTML
vite.config.js      Vite 設定(GitHub Pages 用に base: './')
src/main.jsx        React のマウント
src/App.jsx         タスク一覧の state、追加・切替・削除ロジック、localStorage 保存
src/TaskItem.jsx    タスク1件の表示(チェックボックス・削除ボタン)
src/index.css       スタイル(完了タスクは .task-item.done でグレー表示)
.claude/launch.json Claude のプレビュー用 dev サーバー設定
.github/workflows/deploy.yml  GitHub Pages への自動デプロイ
```

## デプロイ

- main にプッシュすると GitHub Actions がビルドし、GitHub Pages に自動デプロイする
- 公開 URL: https://toda1201-cloud.github.io/task-board/
- アセットは相対パス(`base: './'`)で出力しているため、リポジトリ名を変えても動く
- ルーティングを追加する場合は、サブパスでの動作に注意すること

## 開発コマンド

```bash
npm install      # 依存関係のインストール
npm run dev      # 開発サーバー起動(http://localhost:5173)
npm run build    # 本番ビルド(dist/ に出力)
npm run preview  # ビルド結果のプレビュー
```

テストはまだありません。

## コーディング規約

- 既存コードのスタイル・命名規則に合わせる
- 小さく焦点を絞った変更を心がける
- コメントやドキュメントは日本語で書いてよい

## Git 運用ルール

- **コードを変更するたびに、コミットして GitHub にプッシュすること。**
  - 1つの論理的な変更ごとにコミットし、作業の区切りで必ず `git push` する
  - 変更をローカルに溜め込まない
- コミット前に `git status` と `git diff` で変更内容を確認する
- コミットメッセージは変更内容が分かるように簡潔に書く(日本語可)
  - 例: `タスク一覧の並び替え機能を追加`
- 秘密情報(APIキー、パスワード、`.env` など)はコミットしない。`.gitignore` で除外する
- `git push --force` や履歴の書き換えは、明示的な指示がない限り行わない
- プッシュに失敗した場合(リモートが未設定・認証エラー・コンフリクトなど)は、勝手に解決せず状況を報告する
