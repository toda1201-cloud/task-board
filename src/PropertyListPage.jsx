import { useState } from 'react'
import { useNavigate } from 'react-router'
import { supabase } from './supabaseClient.js'
import { PROPERTIES } from './properties.js'
import PropertyCard from './PropertyCard.jsx'

// 物件一覧画面(ログイン必須)
export default function PropertyListPage({ session }) {
  const navigate = useNavigate()
  const [error, setError] = useState('')

  const logout = async () => {
    setError('')
    const { error } = await supabase.auth.signOut()
    if (error) {
      // 通信エラーなどで失敗した場合はセッションが残るので、画面に知らせる
      setError('ログアウトに失敗しました。通信状況を確認して、もう一度お試しください。')
      return
    }
    // ログアウト後はログイン画面へ戻す
    navigate('/login', { replace: true })
  }

  return (
    <div className="property-page">
      <header className="app-header">
        <h1>物件一覧</h1>
        <div className="header-user">
          <span className="user-email">{session.user.email}</span>
          <button type="button" className="logout-button" onClick={logout}>
            ログアウト
          </button>
        </div>
      </header>
      {error && <p className="form-error page-error">{error}</p>}
      <ul className="property-list">
        {PROPERTIES.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </ul>
    </div>
  )
}
