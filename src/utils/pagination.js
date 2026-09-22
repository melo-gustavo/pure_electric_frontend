export const PAGE_SIZE = 10

export function buildOrdersQuery({ statuses = [], page = 0, pageSize = PAGE_SIZE }) {
  const params = new URLSearchParams()
  statuses.forEach((status) => params.append('status', status))
  params.set('limit', String(pageSize))
  params.set('offset', String(page * pageSize))
  return params.toString()
}

export function pageCount(total, pageSize = PAGE_SIZE) {
  return Math.max(1, Math.ceil(total / pageSize))
}

export function clampPage(page, total, pageSize = PAGE_SIZE) {
  return Math.min(Math.max(0, page), pageCount(total, pageSize) - 1)
}

export function pageRange(page, total, itemCount, pageSize = PAGE_SIZE) {
  if (total === 0 || itemCount === 0) return { from: 0, to: 0 }
  const from = page * pageSize + 1
  return { from, to: from + itemCount - 1 }
}
