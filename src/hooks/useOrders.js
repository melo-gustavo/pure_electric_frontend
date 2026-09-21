import { useCallback, useEffect, useState } from 'react'
import { listOrders } from '../api/orders'
import { isActive } from '../utils/orderStatus'

const ACTIVE_INTERVAL_MS = 1000
const IDLE_INTERVAL_MS = 5000

export function useOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [updatedAt, setUpdatedAt] = useState(null)

  const hasActive = orders.some((order) => isActive(order.status))
  const interval = hasActive ? ACTIVE_INTERVAL_MS : IDLE_INTERVAL_MS

  const refresh = useCallback(async () => {
    try {
      const data = await listOrders()
      setOrders(data)
      setError(null)
      setUpdatedAt(new Date())
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    let timer

    async function tick() {
      if (!document.hidden) await refresh()
      if (!cancelled) timer = setTimeout(tick, interval)
    }

    tick()
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [refresh, interval])

  useEffect(() => {
    function onVisible() {
      if (!document.hidden) refresh()
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => document.removeEventListener('visibilitychange', onVisible)
  }, [refresh])

  return { orders, loading, error, updatedAt, hasActive }
}
