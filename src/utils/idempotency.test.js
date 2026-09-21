import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createPurchaseKeys } from './idempotency.js'

function setup(ttlMs = 5000) {
  let n = 0
  let time = 0
  const keys = createPurchaseKeys({
    generate: () => `id-${++n}`,
    now: () => time,
    ttlMs,
  })
  return { keys, advance: (ms) => { time += ms } }
}

test('reuses the same key while the purchase is not confirmed', () => {
  const { keys, advance } = setup()
  const first = keys.keyFor('u1', 'p1')
  advance(60_000)
  assert.equal(keys.keyFor('u1', 'p1'), first)
})

test('keeps the key for a short window after confirmation, so a repeated click is deduplicated', () => {
  const { keys, advance } = setup(5000)
  const first = keys.keyFor('u1', 'p1')
  keys.confirm('u1', 'p1')
  advance(1000)
  assert.equal(keys.keyFor('u1', 'p1'), first)
})

test('generates a new key once the window after confirmation has passed', () => {
  const { keys, advance } = setup(5000)
  const first = keys.keyFor('u1', 'p1')
  keys.confirm('u1', 'p1')
  advance(5001)
  assert.notEqual(keys.keyFor('u1', 'p1'), first)
})

test('uses different keys for different users or products', () => {
  const { keys } = setup()
  const base = keys.keyFor('u1', 'p1')
  assert.notEqual(keys.keyFor('u1', 'p2'), base)
  assert.notEqual(keys.keyFor('u2', 'p1'), base)
})
