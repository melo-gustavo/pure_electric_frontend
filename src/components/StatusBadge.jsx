import { ORDER_STATUS } from '../utils/orderStatus'

export default function StatusBadge({ status }) {
  const { label, tone } = ORDER_STATUS[status] ?? { label: status, tone: 'neutral' }

  return (
    <span className={`badge badge--${tone}`}>
      {status === 'PROCESSING' && <span className="badge__pulse" aria-hidden="true" />}
      {label}
    </span>
  )
}
