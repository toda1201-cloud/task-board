# CLAUDE.md

このファイルは、このリポジトリで作業する Claude Code 向けのガイドです。

## プロジェクト概要

- プロジェクト名: task-board
- 概要: タスクの追加・完了切り替え・削除ができるタスクボードアプリ
- データ: ブラウザの localStorage(キー `task-board.tasks`)に JSON で保存。タスク変更のたびに保存し、起動時に読み込む

## デプロイ先

https://toda1201-cloud.github.io/task-board/

## 技術スタック

| 分類 | 使用技術 |
|---|---|
| UI ライブラリ | React 19(`react` / `react-dom` ^19.3) |
| ビルドツール | Vite 8 + `@vitejs/plugin-react` 6 |
| 言語 | JavaScript(ES Modules)、JSX。TypeScript は未使用 |
| スタイル | 素の CSS(`src/index.css` 1ファイル、CSS 変数で色を管理)。CSS フレームワークなし |
| 状態管理 | React の `useState` / `useEffect` のみ。外部ライブラリなし |
| 永続化 | ブラウザの localStorage |
| バックエンド(導入中) | Supabase(`@supabase/supabase-js` ^2.119)。SPA のため `@supabase/ssr` は不要 |
| ホスティング | GitHub Pages(GitHub Actions で自動デプロイ) |
| 実行環境 | Node.js(CI は LTS 版、`npm ci` でインストール) |

新しいライブラリを追加する場合は、必要性を確認してから導入し、この表を更新すること。

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

## デプロイ手順

- main にプッシュすると GitHub Actions がビルドし、GitHub Pages に自動デプロイする(反映まで 1〜2 分)
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
- UI の表示文言は日本語にする

### コンポーネントの命名規約

| 対象 | 規約 | 例 |
|---|---|---|
| コンポーネントのファイル | PascalCase + `.jsx`。1ファイル1コンポーネント | `TaskItem.jsx` |
| コンポーネント関数 | ファイル名と同じ PascalCase の関数を `export default function` で定義 | `export default function TaskItem(...)` |
| コンポーネント以外の JS | camelCase + `.js`(JSX を含む場合は `.jsx`) | `main.jsx`、`vite.config.js` |
| props | camelCase。オブジェクトはドメイン名そのまま | `task`、`tasks` |
| イベント用 props | `on` + 動詞 | `onToggle`、`onDelete` |
| イベント処理関数 | 動詞 + 対象 | `addTask`、`toggleTask`、`deleteTask` |
| state | 名詞、更新関数は `set` + 名詞 | `tasks` / `setTasks`、`text` / `setText` |
| 定数 | UPPER_SNAKE_CASE | `STORAGE_KEY` |
| localStorage のキー | `task-board.<名前>` | `task-board.tasks` |
| CSS クラス | kebab-case。コンポーネント名に対応させる | `.task-item`、`.task-list`、`.add-form` |
| CSS の状態クラス | 短い形容詞を基本クラスと併用 | `.task-item.done` |

- props は分割代入で受け取る(`function TaskItem({ task, onToggle, onDelete })`)
- state はできるだけ上位(現状は `App`)に置き、子には値とイベント用 props を渡す
- アイコンだけのボタンなど、見た目で意味が伝わりにくい要素には `aria-label` を付ける

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
