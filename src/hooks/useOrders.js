import { useCallback, useEffect, useRef, useState } from 'react'
import { listOrders } from '../api/orders'
import { isActive } from '../utils/orderStatus'
import { PAGE_SIZE, clampPage } from '../utils/pagination'

const ACTIVE_INTERVAL_MS = 1000
const IDLE_INTERVAL_MS = 5000

export function useOrders({ statuses, page, pageSize = PAGE_SIZE, onPageOverflow }) {
  const [orders, setOrders] = useState([])
  const [total, setTotal] = useState(0)
  const latest = useRef(0)
  const statusKey = statuses.join(',')
  const queryKey = `${statusKey}|${page}|${pageSize}`
  const [loadedKey, setLoadedKey] = useState(null)
  const loading = loadedKey !== queryKey
  const [error, setError] = useState(null)
  const [updatedAt, setUpdatedAt] = useState(null)

  const hasActive = orders.some((order) => isActive(order.status))
  const interval = hasActive ? ACTIVE_INTERVAL_MS : IDLE_INTERVAL_MS

  const refresh = useCallback(async () => {
    const request = ++latest.current
    try {
      const data = await listOrders({ statuses: statusKey ? statusKey.split(',') : [], page, pageSize })
      if (request !== latest.current) return
      if (data.items.length === 0 && data.total > 0) {
        onPageOverflow?.(clampPage(page, data.total, pageSize))
        return
      }
      setOrders(data.items)
      setTotal(data.total)
      setError(null)
      setUpdatedAt(new Date())
    } catch (err) {
      if (request === latest.current) setError(err)
    } finally {
      if (request === latest.current) setLoadedKey(queryKey)
    }
  }, [statusKey, queryKey, page, pageSize, onPageOverflow])

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

  return { orders, total, loading, error, updatedAt, hasActive }
}
