import assert from 'node:assert/strict'
import { test } from 'node:test'
import { translateFailureReason } from './failureReason.js'

test('translates a rejection', () => {
  assert.equal(
    translateFailureReason('Internal system rejected the order.'),
    'O sistema interno recusou o pedido.',
  )
})

test('translates exhausted retries keeping the attempt count', () => {
  assert.equal(
    translateFailureReason('Internal system unavailable after 3 attempts (TimeoutError).'),
    'O sistema interno não respondeu após 3 tentativas (indisponível ou lento).',
  )
})

test('unknown reasons fall back to a generic pt-BR message', () => {
  assert.equal(translateFailureReason('boom'), 'Erro inesperado no processamento.')
})

test('empty reason yields null', () => {
  assert.equal(translateFailureReason(null), null)
})
