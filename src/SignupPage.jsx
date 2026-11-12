import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { supabase } from './supabaseClient.js'

// Supabase のパスワード最小文字数(デフォルト設定)
const MIN_PASSWORD_LENGTH = 6

// 会員登録画面(メールアドレス + パスワード)
export default function SignupPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const signUp = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)
    const { data, error } = await supabase.auth.signUp({ email, password })
    setLoading(false)
    if (error) {
      setError(`会員登録に失敗しました:${error.message}`)
      return
    }
    if (data.session) {
      // メール確認が無効な設定ではそのままログイン状態になるので、物件一覧へ移動する
      navigate('/properties', { replace: true })
    } else {
      // メール確認が有効な設定では、確認メールのリンクを開くまでログインできない
      setMessage('確認メールを送信しました。メール内のリンクを開いてから、ログインしてください。')
    }
  }

  return (
    <main className="auth-page">
      <h1>会員登録</h1>
      <form className="auth-form" onSubmit={signUp}>
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
          パスワード({MIN_PASSWORD_LENGTH}文字以上)
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            minLength={MIN_PASSWORD_LENGTH}
            required
          />
        </label>
        {error && <p className="form-error">{error}</p>}
        {message && <p className="form-message">{message}</p>}
        <button type="submit" disabled={loading}>
          {loading ? '登録中…' : '登録する'}
        </button>
      </form>
      <p className="auth-switch">
        登録済みの方は <Link to="/login">ログイン</Link>
      </p>
    </main>
  )
}
