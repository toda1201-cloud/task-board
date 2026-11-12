// 家賃を「¥128,000」の形式で表示する
const rentFormatter = new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' })

// 物件1件のカード(物件名・家賃・エリア)
export default function PropertyCard({ property }) {
  return (
    <li className="property-card">
      <h2 className="property-name">{property.name}</h2>
      <p className="property-rent">
        {rentFormatter.format(property.rent)}
        <span className="property-unit"> / 月</span>
      </p>
      <p className="property-area">{property.area}</p>
    </li>
  )
}
