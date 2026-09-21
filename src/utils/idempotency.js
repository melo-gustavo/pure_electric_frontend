export function createPurchaseKeys(generate = () => crypto.randomUUID()) {
  const keys = new Map()

  return {
    keyFor(userId, productId) {
      const id = `${userId}:${productId}`
      if (!keys.has(id)) keys.set(id, `WEB-${generate()}`)
      return keys.get(id)
    },
    release(userId, productId) {
      keys.delete(`${userId}:${productId}`)
    },
  }
}
