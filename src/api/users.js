import { request } from './client'

export function listUsers() {
  return request('/users')
}
