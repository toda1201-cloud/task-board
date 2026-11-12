// 家賃を「¥128,000」の形式で表示する
const rentFormatter = new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' })

// 物件1件のカード(物件名・家賃・エリア・間取り + 編集・削除ボタン)
export default function PropertyCard({ property, onEdit, onDelete }) {
  return (
    <li className="property-card">
      <div className="property-heading">
        <h2 className="property-name">{property.name}</h2>
        <span className="property-layout">{property.layout}</span>
      </div>
      <p className="property-rent">
        {rentFormatter.format(property.rent)}
        <span className="property-unit"> / 月</span>
      </p>
      <p className="property-area">{property.area}</p>
      <div className="card-actions">
        <button
          type="button"
          className="secondary-button"
          onClick={() => onEdit(property.id)}
          aria-label={`「${property.name}」を編集`}
        >
          編集
        </button>
        <button
          type="button"
          className="delete-button"
          onClick={() => onDelete(property)}
          aria-label={`「${property.name}」を削除`}
        >
          削除
        </button>
      </div>
    </li>
  )
}
