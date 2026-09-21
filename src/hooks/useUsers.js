import { useEffect, useState } from 'react'
import { listUsers } from '../api/users'

export function useUsers() {
  const [state, setState] = useState({ users: [], loading: true, error: null })

  useEffect(() => {
    const controller = new AbortController()
    listUsers()
      .then((users) => {
        if (!controller.signal.aborted) setState({ users, loading: false, error: null })
      })
      .catch((error) => {
        if (!controller.signal.aborted) setState({ users: [], loading: false, error })
      })
    return () => controller.abort()
  }, [])

  return state
}
