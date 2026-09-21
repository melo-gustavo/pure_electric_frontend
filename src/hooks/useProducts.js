import { useEffect, useState } from 'react'
import { listProducts } from '../api/products'

export function useProducts() {
  const [state, setState] = useState({ products: [], loading: true, error: null })

  useEffect(() => {
    const controller = new AbortController()
    listProducts()
      .then((products) => {
        if (!controller.signal.aborted) setState({ products, loading: false, error: null })
      })
      .catch((error) => {
        if (!controller.signal.aborted) setState({ products: [], loading: false, error })
      })
    return () => controller.abort()
  }, [])

  return state
}
