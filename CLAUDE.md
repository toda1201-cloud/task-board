# CLAUDE.md

このファイルは、このリポジトリで作業する Claude Code 向けのガイドです。

## プロジェクト概要

- プロジェクト名: task-board
- 概要: Supabase 認証付きの不動産管理 Web アプリ(旧タスクボードを置き換え)
- 認証: メールアドレス + パスワードで会員登録・ログイン(Supabase Auth)。セッションは supabase-js が localStorage に保存
- 画面: ログイン(`#/login`)、会員登録(`#/signup`)、物件一覧(`#/properties`、ログイン必須。未ログインはログイン画面へリダイレクト)
- データ: Supabase の `properties` テーブル(物件名 `name`・家賃 `rent`・エリア `area`・間取り `layout`・登録者 `user_id`)。物件一覧画面で登録・編集・削除できる
- テーブル定義と RLS は `supabase/schema.sql`。Supabase の SQL Editor で実行する。RLS で「自分が登録した物件のみ」表示・登録・編集・削除できる
- テーブルを変更したら `supabase/schema.sql` も更新すること

## 環境変数

- `.env.example` を `.env` にコピーし、`VITE_SUPABASE_URL` と `VITE_SUPABASE_PUBLISHABLE_KEY` を設定する
- `.env` は `.gitignore` で除外済み。コミットしないこと
- GitHub Pages のビルド用に、リポジトリの Actions Secrets にも同名で登録する

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
| ルーティング | `react-router` ^8.5(GitHub Pages のサブパスで動くよう `HashRouter` を使用) |
| 認証 | Supabase Auth(`@supabase/supabase-js` ^2.119)。SPA のため `@supabase/ssr` は不要 |
| ホスティング | GitHub Pages(GitHub Actions で自動デプロイ) |
| 実行環境 | Node.js(CI は LTS 版、`npm ci` でインストール) |

新しいライブラリを追加する場合は、必要性を確認してから導入し、この表を更新すること。

## ディレクトリ構成

```
index.html          Vite のエントリ HTML
vite.config.js      Vite 設定(GitHub Pages 用に base: './')
src/main.jsx        React のマウント
src/App.jsx         セッション管理(onAuthStateChange)とルーティング、未ログイン時のリダイレクト
src/supabaseClient.js  Supabase クライアント(.env の値で生成。未設定なら null)
src/LoginPage.jsx   ログイン画面
src/SignupPage.jsx  会員登録画面
src/PropertyListPage.jsx  物件一覧画面。Supabase との CRUD(取得・登録・更新・削除)とログアウト
src/PropertyCard.jsx  物件1件のカード(物件名・家賃・エリア・間取り、編集・削除ボタン)
src/PropertyForm.jsx  物件の登録・編集フォーム(property を渡すと編集モード)
supabase/schema.sql テーブル作成と RLS ポリシーの SQL
src/index.css       スタイル
.env.example        環境変数のひな形(.env は除外)
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
