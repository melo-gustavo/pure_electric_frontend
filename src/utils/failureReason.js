const UNEXPECTED = 'Erro inesperado no processamento.'

const RULES = [
  {
    pattern: /^Internal system rejected the order\.?$/i,
    message: () => 'O sistema interno recusou o pedido.',
  },
  {
    pattern: /^Internal system unavailable after (\d+) attempts?/i,
    message: ([, attempts]) =>
      `O sistema interno não respondeu após ${attempts} tentativas (indisponível ou lento).`,
  },
  {
    pattern: /^Internal system is unavailable\.?$/i,
    message: () => 'O sistema interno está indisponível.',
  },
]

export function translateFailureReason(reason) {
  if (!reason) return null
  for (const { pattern, message } of RULES) {
    const match = reason.match(pattern)
    if (match) return message(match)
  }
  return UNEXPECTED
}
