import { useRef, useState } from 'react'
import { Link } from 'react-router'
import { createOrder } from '../api/orders'
import ProductCard from '../components/ProductCard'
import { useProducts } from '../hooks/useProducts'
import { useUsers } from '../hooks/useUsers'
import { createPurchaseKeys } from '../utils/idempotency'

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
  const [purchaseKeys] = useState(createPurchaseKeys)
  const inFlight = useRef(false)

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

    if (inFlight.current) return
    inFlight.current = true

    setBuyingId(product.id)
    setFeedback(null)
    try {
      const { created } = await createOrder({
        externalId: purchaseKeys.keyFor(selectedUser.id, product.id),
        customer: selectedUser.full_name,
        amount: product.amount,
      })
      purchaseKeys.confirm(selectedUser.id, product.id)
      setFeedback({
        type: 'success',
        message: created
          ? `Pedido de ${product.name} enviado.`
          : `Este pedido de ${product.name} já havia sido recebido; nada foi duplicado.`,
      })
    } catch (err) {
      setFeedback({ type: 'error', message: `${err.message} Você pode tentar de novo sem risco de duplicar o pedido.` })
    } finally {
      inFlight.current = false
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
            disabled={buyingId !== null}
          />
        ))}
      </div>
    </section>
  )
}
