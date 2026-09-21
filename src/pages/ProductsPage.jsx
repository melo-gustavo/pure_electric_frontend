import { useState } from 'react'
import { Link } from 'react-router'
import { createOrder } from '../api/orders'
import ProductCard from '../components/ProductCard'
import { useProducts } from '../hooks/useProducts'
import { useUsers } from '../hooks/useUsers'

const USER_KEY = 'pure_electric_user_id'

function loadUserId() {
  try {
    return localStorage.getItem(USER_KEY) ?? ''
  } catch {
    return ''
  }
}

export default function ProductsPage() {
  const { products, loading, error } = useProducts()
  const { users, loading: loadingUsers, error: usersError } = useUsers()
  const [userId, setUserId] = useState(loadUserId)
  const [buyingId, setBuyingId] = useState(null)
  const [feedback, setFeedback] = useState(null)

  const selectedUser = users.find((user) => user.id === userId) ?? null

  function handleUserChange(event) {
    const value = event.target.value
    setUserId(value)
    try {
      localStorage.setItem(USER_KEY, value)
    } catch {
      // storage unavailable; the selection simply is not remembered
    }
  }

  async function handleBuy(product) {
    if (!selectedUser) {
      setFeedback({ type: 'error', message: 'Selecione o usuário que está comprando.' })
      return
    }

    setBuyingId(product.id)
    setFeedback(null)
    try {
      const order = await createOrder({ customer: selectedUser.full_name, amount: product.amount })
      setFeedback({ type: 'success', message: `Pedido de ${product.name} enviado.`, orderId: order.id })
    } catch (err) {
      setFeedback({ type: 'error', message: err.message })
    } finally {
      setBuyingId(null)
    }
  }

  return (
    <section>
      <header className="page-header">
        <div>
          <h1>Produtos</h1>
          <p className="muted">Escolha seu e-scooter e acompanhe o pedido em tempo real.</p>
        </div>
        <label className="field">
          <span>Comprando como</span>
          <select value={selectedUser?.id ?? ''} onChange={handleUserChange} disabled={loadingUsers}>
            <option value="">{loadingUsers ? 'Carregando usuários…' : 'Selecione um usuário'}</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.full_name}
              </option>
            ))}
          </select>
          {usersError && <span className="field__error">Não foi possível carregar os usuários.</span>}
        </label>
      </header>

      {feedback && (
        <div className={`alert alert--${feedback.type}`} role="status">
          {feedback.message}
          {feedback.type === 'success' && (
            <>
              {' '}
              <Link to="/orders">Acompanhar pedidos</Link>
            </>
          )}
        </div>
      )}

      {loading && <p className="muted">Carregando produtos…</p>}
      {error && <div className="alert alert--error">{error.message}</div>}
      {!loading && !error && products.length === 0 && (
        <p className="muted">Nenhum produto cadastrado.</p>
      )}

      <div className="grid">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onBuy={handleBuy}
            buying={buyingId === product.id}
          />
        ))}
      </div>
    </section>
  )
}
