export const money = (value) => new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL'
}).format(Number(value || 0))

export const dateBR = (value) => new Date(value + 'T00:00:00').toLocaleDateString('pt-BR')
