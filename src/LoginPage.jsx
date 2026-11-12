import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { supabase } from './supabaseClient.js'

// ログイン画面(メールアドレス + パスワード)
export default function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const login = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) {
      setError('ログインに失敗しました。メールアドレスとパスワードを確認してください。')
      return
    }
    // ログイン成功後は物件一覧へ移動する
    navigate('/properties', { replace: true })
  }

  return (
    <main className="auth-page">
      <h1>ログイン</h1>
      <form className="auth-form" onSubmit={login}>
        <label>
          メールアドレス
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </label>
        <label>
          パスワード
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </label>
        {error && <p className="form-error">{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? 'ログイン中…' : 'ログイン'}
        </button>
      </form>
      <p className="auth-switch">
        アカウントをお持ちでない方は <Link to="/signup">会員登録</Link>
      </p>
    </main>
  )
}
