const DEFAULT_TTL_MS = 5000

export function createPurchaseKeys({
  generate = () => crypto.randomUUID(),
  now = () => Date.now(),
  ttlMs = DEFAULT_TTL_MS,
} = {}) {
  const entries = new Map()

  return {
    keyFor(userId, productId) {
      const id = `${userId}:${productId}`
      const entry = entries.get(id)
      if (entry && (entry.expiresAt === null || entry.expiresAt > now())) {
        return entry.key
      }
      const created = { key: `WEB-${generate()}`, expiresAt: null }
      entries.set(id, created)
      return created.key
    },
    confirm(userId, productId) {
      const entry = entries.get(`${userId}:${productId}`)
      if (entry) entry.expiresAt = now() + ttlMs
    },
  }
}
