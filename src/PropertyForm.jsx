import { useState } from 'react'

// 物件の新規登録・編集で共通に使うフォーム
// property を渡すと編集モード(初期値に既存の値が入る)、渡さなければ新規登録モード
export default function PropertyForm({ property, onSubmit, onCancel }) {
  const [name, setName] = useState(property?.name ?? '')
  const [rent, setRent] = useState(property ? String(property.rent) : '')
  const [area, setArea] = useState(property?.area ?? '')
  const [layout, setLayout] = useState(property?.layout ?? '')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const isEdit = Boolean(property)

  const submitProperty = async (e) => {
    e.preventDefault()
    setError('')
    setSaving(true)
    // 親(PropertyListPage)の登録・更新処理を呼ぶ。失敗時はエラーメッセージが返る
    const errorMessage = await onSubmit({
      name: name.trim(),
      rent: Number(rent),
      area: area.trim(),
      layout: layout.trim(),
    })
    setSaving(false)
    if (errorMessage) setError(errorMessage)
  }

  return (
    <form className="property-form" onSubmit={submitProperty}>
      <h2 className="property-form-title">{isEdit ? '物件を編集' : '物件を登録'}</h2>
      <label>
        物件名
        <input value={name} onChange={(e) => setName(e.target.value)} maxLength={100} required />
      </label>
      <label>
        家賃(円/月)
        <input
          type="number"
          inputMode="numeric"
          value={rent}
          onChange={(e) => setRent(e.target.value)}
          min={0}
          step={1}
          required
        />
      </label>
      <label>
        エリア名
        <input
          value={area}
          onChange={(e) => setArea(e.target.value)}
          placeholder="例:東京都渋谷区"
          maxLength={100}
          required
        />
      </label>
      <label>
        間取り
        <input
          value={layout}
          onChange={(e) => setLayout(e.target.value)}
          placeholder="例:1LDK"
          maxLength={20}
          required
        />
      </label>
      {error && <p className="form-error">{error}</p>}
      <div className="form-actions">
        <button type="button" className="secondary-button" onClick={onCancel} disabled={saving}>
          キャンセル
        </button>
        <button type="submit" className="primary-button" disabled={saving}>
          {saving ? '保存中…' : isEdit ? '更新する' : '登録する'}
        </button>
      </div>
    </form>
  )
}
