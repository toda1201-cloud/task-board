import { useEffect, useState } from 'react'
import { HashRouter, Navigate, Route, Routes } from 'react-router'
import { supabase } from './supabaseClient.js'
import LoginPage from './LoginPage.jsx'
import SignupPage from './SignupPage.jsx'
import PropertyListPage from './PropertyListPage.jsx'

export default function App() {
  // undefined = 確認中、null = 未ログイン、オブジェクト = ログイン中
  const [session, setSession] = useState(undefined)

  useEffect(() => {
    if (!supabase) return

    // 起動時に保存済みのセッションを読み込む
    supabase.auth.getSession().then(({ data }) => setSession(data.session))

    // ログイン・ログアウトなどの認証状態の変化を監視する
    const { data } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
    })
    return () => data.subscription.unsubscribe()
  }, [])

  // .env が未設定の場合は、原因が分かるようにメッセージを出す
  if (!supabase) {
    return (
      <main className="auth-page">
        <h1>設定エラー</h1>
        <p className="form-error">
          Supabase の接続情報が設定されていません。.env に VITE_SUPABASE_URL と
          VITE_SUPABASE_PUBLISHABLE_KEY を設定してください。
        </p>
      </main>
    )
  }

  // セッション確認中は何も描画しない(ログイン画面が一瞬表示されるのを防ぐ)
  if (session === undefined) {
    return <p className="loading">読み込み中…</p>
  }

  // GitHub Pages のサブパスでもリロードで 404 にならないよう HashRouter を使う
  return (
    <HashRouter>
      <Routes>
        {/* ログイン済みならログイン・会員登録画面は物件一覧へ移動 */}
        <Route path="/login" element={session ? <Navigate to="/properties" replace /> : <LoginPage />} />
        <Route path="/signup" element={session ? <Navigate to="/properties" replace /> : <SignupPage />} />
        {/* 未ログインで物件一覧を開いたらログイン画面へリダイレクト */}
        <Route
          path="/properties"
          element={session ? <PropertyListPage session={session} /> : <Navigate to="/login" replace />}
        />
        <Route path="*" element={<Navigate to={session ? '/properties' : '/login'} replace />} />
      </Routes>
    </HashRouter>
  )
}
