const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
const dateTime = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'medium' })

export function formatCurrency(value) {
  return currency.format(Number(value))
}

export function formatDateTime(value) {
  return value ? dateTime.format(new Date(value)) : '—'
}
