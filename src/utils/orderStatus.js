export const ORDER_STATUS = {
  RECEIVED: { label: 'Recebido', tone: 'neutral', active: true },
  PROCESSING: { label: 'Processando', tone: 'info', active: true },
  PROCESSED: { label: 'Processado', tone: 'success', active: false },
  FAILED: { label: 'Falhou', tone: 'danger', active: false },
}

export function isActive(status) {
  return ORDER_STATUS[status]?.active ?? false
}
