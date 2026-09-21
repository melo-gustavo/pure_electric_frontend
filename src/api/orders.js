import { request } from './client'

export function listOrders() {
  return request('/orders')
}

export function createOrder({ customer, amount }) {
  return request('/orders', {
    method: 'POST',
    body: JSON.stringify({
      externalId: `WEB-${crypto.randomUUID()}`,
      customer,
      amount,
    }),
  })
}
