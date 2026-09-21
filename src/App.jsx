import { NavLink, Navigate, Route, Routes } from 'react-router'
import OrdersPage from './pages/OrdersPage'
import ProductsPage from './pages/ProductsPage'

export default function App() {
  return (
    <>
      <nav className="navbar">
        <span className="navbar__brand">Pure Electric</span>
        <NavLink to="/products">Produtos</NavLink>
        <NavLink to="/orders">Pedidos</NavLink>
      </nav>
      <main className="container">
        <Routes>
          <Route path="/" element={<Navigate to="/products" replace />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/orders" element={<OrdersPage />} />
        </Routes>
      </main>
    </>
  )
}
