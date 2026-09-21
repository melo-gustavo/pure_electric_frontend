import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createPurchaseKeys } from './idempotency.js'

function sequence() {
  let n = 0
  return () => `id-${++n}`
}

test('reuses the same key while the purchase is not confirmed', () => {
  const keys = createPurchaseKeys(sequence())
  assert.equal(keys.keyFor('u1', 'p1'), keys.keyFor('u1', 'p1'))
})

test('uses different keys for different users or products', () => {
  const keys = createPurchaseKeys(sequence())
  const base = keys.keyFor('u1', 'p1')
  assert.notEqual(keys.keyFor('u1', 'p2'), base)
  assert.notEqual(keys.keyFor('u2', 'p1'), base)
})

test('releasing the key makes the next purchase a new order', () => {
  const keys = createPurchaseKeys(sequence())
  const first = keys.keyFor('u1', 'p1')
  keys.release('u1', 'p1')
  assert.notEqual(keys.keyFor('u1', 'p1'), first)
})
