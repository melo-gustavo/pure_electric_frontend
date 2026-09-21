import { request, requestWithStatus } from './client'

export function listOrders() {
  return request('/orders')
}

export async function createOrder({ externalId, customer, amount }) {
  const { data, status } = await requestWithStatus('/orders', {
    method: 'POST',
    body: JSON.stringify({ externalId, customer, amount }),
  })
  return { order: data, created: status === 201 }
}
