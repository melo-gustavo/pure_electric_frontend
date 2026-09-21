import { useState } from 'react'
import StatusBadge from '../components/StatusBadge'
import { useOrders } from '../hooks/useOrders'
import { formatCurrency, formatDateTime } from '../utils/format'
import { isActive } from '../utils/orderStatus'

const FILTERS = [
  { key: 'all', label: 'Todos', match: () => true },
  { key: 'active', label: 'Em andamento', match: (order) => isActive(order.status) },
  { key: 'PROCESSED', label: 'Processados', match: (order) => order.status === 'PROCESSED' },
  { key: 'FAILED', label: 'Falhas', match: (order) => order.status === 'FAILED' },
]

export default function OrdersPage() {
  const { orders, loading, error, updatedAt, hasActive } = useOrders()
  const [filterKey, setFilterKey] = useState('all')

  const filter = FILTERS.find((item) => item.key === filterKey)
  const sorted = [...orders].sort((a, b) => b.created_at.localeCompare(a.created_at))
  const visible = sorted.filter(filter.match)

  return (
    <section>
      <header className="page-header">
        <div>
          <h1>Pedidos</h1>
          <p className="muted">
            {hasActive ? 'Atualizando a cada segundo enquanto há pedidos em andamento.' : 'Nenhum pedido em andamento.'}
          </p>
        </div>
        <span className={`live ${error ? 'live--error' : ''}`}>
          <span className="live__dot" aria-hidden="true" />
          {error ? 'Sem conexão com a API' : updatedAt ? `Atualizado às ${updatedAt.toLocaleTimeString('pt-BR')}` : 'Conectando…'}
        </span>
      </header>

      <div className="filters" role="tablist">
        {FILTERS.map((item) => (
          <button
            key={item.key}
            type="button"
            role="tab"
            aria-selected={item.key === filterKey}
            className={`chip ${item.key === filterKey ? 'chip--selected' : ''}`}
            onClick={() => setFilterKey(item.key)}
          >
            {item.label} ({orders.filter(item.match).length})
          </button>
        ))}
      </div>

      {loading && <p className="muted">Carregando pedidos…</p>}
      {!loading && visible.length === 0 && <p className="muted">Nenhum pedido para exibir.</p>}

      {visible.length > 0 && (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Pedido</th>
                <th>Cliente</th>
                <th>Valor</th>
                <th>Status</th>
                <th>Criado em</th>
                <th>Concluído em</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((order) => (
                <tr key={order.id}>
                  <td>
                    <code>{order.external_id}</code>
                  </td>
                  <td>{order.customer}</td>
                  <td>{formatCurrency(order.amount)}</td>
                  <td>
                    <StatusBadge status={order.status} />
                    {order.failure_reason && <div className="table__reason">{order.failure_reason}</div>}
                  </td>
                  <td>{formatDateTime(order.created_at)}</td>
                  <td>{formatDateTime(order.processed_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
