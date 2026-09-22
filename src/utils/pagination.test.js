import assert from 'node:assert/strict'
import { test } from 'node:test'
import { buildOrdersQuery, clampPage, pageCount, pageRange } from './pagination.js'

test('buildOrdersQuery repeats status and computes the offset', () => {
  const query = buildOrdersQuery({ statuses: ['RECEIVED', 'PROCESSING'], page: 2, pageSize: 10 })
  assert.equal(query, 'status=RECEIVED&status=PROCESSING&limit=10&offset=20')
})

test('buildOrdersQuery without statuses omits the filter', () => {
  assert.equal(buildOrdersQuery({ page: 0, pageSize: 5 }), 'limit=5&offset=0')
})

test('pageCount is at least one page', () => {
  assert.equal(pageCount(0, 10), 1)
  assert.equal(pageCount(10, 10), 1)
  assert.equal(pageCount(11, 10), 2)
})

test('clampPage pulls an out-of-range page back to the last one', () => {
  assert.equal(clampPage(5, 25, 10), 2)
  assert.equal(clampPage(-1, 25, 10), 0)
  assert.equal(clampPage(1, 0, 10), 0)
})

test('pageRange describes the visible slice', () => {
  assert.deepEqual(pageRange(1, 25, 10, 10), { from: 11, to: 20 })
  assert.deepEqual(pageRange(2, 25, 5, 10), { from: 21, to: 25 })
  assert.deepEqual(pageRange(0, 0, 0, 10), { from: 0, to: 0 })
})
