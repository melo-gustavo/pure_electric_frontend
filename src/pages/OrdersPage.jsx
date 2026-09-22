import { useState } from 'react'
import StatusBadge from '../components/StatusBadge'
import { useOrders } from '../hooks/useOrders'
import { translateFailureReason } from '../utils/failureReason'
import { formatCurrency, formatDateTime } from '../utils/format'
import { pageCount, pageRange } from '../utils/pagination'

const FILTERS = [
  { key: 'all', label: 'Todos', statuses: [] },
  { key: 'active', label: 'Em andamento', statuses: ['RECEIVED', 'PROCESSING'] },
  { key: 'PROCESSED', label: 'Processados', statuses: ['PROCESSED'] },
  { key: 'FAILED', label: 'Falhas', statuses: ['FAILED'] },
]

export default function OrdersPage() {
  const [filterKey, setFilterKey] = useState('all')
  const [page, setPage] = useState(0)
  const filter = FILTERS.find((item) => item.key === filterKey)
  const { orders, total, loading, error, updatedAt, hasActive } = useOrders({
    statuses: filter.statuses,
    page,
    onPageOverflow: setPage,
  })

  const pages = pageCount(total)
  const range = pageRange(page, total, orders.length)

  function selectFilter(key) {
    setFilterKey(key)
    setPage(0)
  }

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
            onClick={() => selectFilter(item.key)}
          >
            {item.label}
          </button>
        ))}
      </div>

      {loading && <p className="muted">Carregando pedidos…</p>}
      {!loading && orders.length === 0 && <p className="muted">Nenhum pedido para exibir.</p>}

      {orders.length > 0 && (
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
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>
                    <code>{order.external_id}</code>
                  </td>
                  <td>{order.customer}</td>
                  <td>{formatCurrency(order.amount)}</td>
                  <td>
                    <StatusBadge status={order.status} />
                    {order.failure_reason && (
                      <div className="table__reason" title={order.failure_reason}>
                        {translateFailureReason(order.failure_reason)}
                      </div>
                    )}
                  </td>
                  <td>{formatDateTime(order.created_at)}</td>
                  <td>{formatDateTime(order.processed_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {total > 0 && (
        <nav className="pagination" aria-label="Paginação de pedidos">
          <span className="muted">
            {range.from}–{range.to} de {total}
          </span>
          <div className="pagination__controls">
            <button type="button" className="chip" disabled={page === 0} onClick={() => setPage(page - 1)}>
              Anterior
            </button>
            <span>
              Página {page + 1} de {pages}
            </span>
            <button type="button" className="chip" disabled={page >= pages - 1} onClick={() => setPage(page + 1)}>
              Próxima
            </button>
          </div>
        </nav>
      )}
    </section>
  )
}
