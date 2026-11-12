import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { supabase } from './supabaseClient.js'
import PropertyCard from './PropertyCard.jsx'
import PropertyForm from './PropertyForm.jsx'

// 画面で使う列(user_id や日時は表示しないので取得しない)
const PROPERTY_COLUMNS = 'id, name, rent, area, layout'

// 物件一覧画面(ログイン必須)
// RLS により、Supabase からは自分が登録した物件だけが返ってくる
export default function PropertyListPage({ session }) {
  const navigate = useNavigate()
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  // 新規登録フォームを開いているか
  const [adding, setAdding] = useState(false)
  // 編集中の物件 ID(null なら編集していない)
  const [editingId, setEditingId] = useState(null)

  // 一覧の取得(SELECT)
  useEffect(() => {
    let ignore = false
    const fetchProperties = async () => {
      const { data, error } = await supabase
        .from('properties')
        .select(PROPERTY_COLUMNS)
        .order('created_at', { ascending: false })
      // 画面を離れた後に結果が返ってきた場合は反映しない
      if (ignore) return
      if (error) {
        setError('物件の読み込みに失敗しました。通信状況を確認して、ページを再読み込みしてください。')
      } else {
        setProperties(data)
      }
      setLoading(false)
    }
    fetchProperties()
    return () => {
      ignore = true
    }
  }, [])

  // 新規登録(INSERT)。失敗時はフォームに表示するエラーメッセージを返す
  const addProperty = async (values) => {
    const { data, error } = await supabase
      .from('properties')
      .insert({ ...values, user_id: session.user.id })
      .select(PROPERTY_COLUMNS)
      .single()
    if (error) return '登録に失敗しました。入力内容を確認して、もう一度お試しください。'
    // 新しい物件を一覧の先頭に追加してフォームを閉じる
    setProperties((prev) => [data, ...prev])
    setAdding(false)
  }

  // 編集(UPDATE)。失敗時はフォームに表示するエラーメッセージを返す
  const updateProperty = async (id, values) => {
    const { data, error } = await supabase
      .from('properties')
      .update(values)
      .eq('id', id)
      .select(PROPERTY_COLUMNS)
      .single()
    if (error) return '更新に失敗しました。入力内容を確認して、もう一度お試しください。'
    setProperties((prev) => prev.map((p) => (p.id === id ? data : p)))
    setEditingId(null)
  }

  // 削除(DELETE)。誤操作防止のため確認ダイアログを出す
  const deleteProperty = async (property) => {
    if (!window.confirm(`「${property.name}」を削除しますか?この操作は取り消せません。`)) return
    setError('')
    const { error } = await supabase.from('properties').delete().eq('id', property.id)
    if (error) {
      setError('削除に失敗しました。もう一度お試しください。')
      return
    }
    setProperties((prev) => prev.filter((p) => p.id !== property.id))
  }

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

      {adding ? (
        <PropertyForm onSubmit={addProperty} onCancel={() => setAdding(false)} />
      ) : (
        <button type="button" className="primary-button add-button" onClick={() => setAdding(true)}>
          + 物件を登録
        </button>
      )}

      {loading ? (
        <p className="loading">読み込み中…</p>
      ) : properties.length === 0 ? (
        // 読み込みエラー時は「0件」と誤解されないよう空メッセージを出さない
        !error && <p className="empty">登録された物件はまだありません</p>
      ) : (
        <ul className="property-list">
          {properties.map((property) =>
            property.id === editingId ? (
              // 編集中の物件はカードの代わりに編集フォームを表示する
              <li key={property.id} className="property-card editing">
                <PropertyForm
                  property={property}
                  onSubmit={(values) => updateProperty(property.id, values)}
                  onCancel={() => setEditingId(null)}
                />
              </li>
            ) : (
              <PropertyCard
                key={property.id}
                property={property}
                onEdit={setEditingId}
                onDelete={deleteProperty}
              />
            ),
          )}
        </ul>
      )}
    </div>
  )
}
