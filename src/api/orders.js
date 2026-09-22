import { request, requestWithStatus } from './client'
import { buildOrdersQuery } from '../utils/pagination'

export function listOrders(options) {
  return request(`/orders?${buildOrdersQuery(options)}`)
}

export async function createOrder({ externalId, customer, amount }) {
  const { data, status } = await requestWithStatus('/orders', {
    method: 'POST',
    body: JSON.stringify({ externalId, customer, amount }),
  })
  return { order: data, created: status === 201 }
}
