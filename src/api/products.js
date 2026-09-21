import { request } from './client'

export function listProducts() {
  return request('/products')
}
