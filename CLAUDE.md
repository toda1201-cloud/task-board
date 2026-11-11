# CLAUDE.md

このファイルは、このリポジトリで作業する Claude Code 向けのガイドです。

## プロジェクト概要

- プロジェクト名: task-board
- 概要: タスクの追加・完了切り替え・削除ができるタスクボードアプリ
- 技術スタック: React 19 + Vite(JavaScript / JSX)、CSS は素の CSS
- データ: 現在はメモリ上の state のみ(リロードで消える)

## ディレクトリ構成

```
index.html          Vite のエントリ HTML
vite.config.js      Vite 設定
src/main.jsx        React のマウント
src/App.jsx         タスク一覧の state と追加・切替・削除ロジック
src/TaskItem.jsx    タスク1件の表示(チェックボックス・削除ボタン)
src/index.css       スタイル(完了タスクは .task-item.done でグレー表示)
.claude/launch.json Claude のプレビュー用 dev サーバー設定
```

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
