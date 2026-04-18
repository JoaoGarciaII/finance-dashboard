import { Coins } from 'lucide-react'

export default function EmptyState({ onAdd }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-gold/10 bg-panel/90 py-20 text-center shadow-glow">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-gold/10 text-gold">
        <Coins size={32} />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-text">Nenhuma transação encontrada</h3>
      <p className="mb-6 max-w-xs text-sm text-muted">Adicione sua primeira receita ou despesa para começar a visualizar seus dados financeiros.</p>
      <button
        onClick={onAdd}
        className="rounded-2xl bg-gold px-6 py-3 text-sm font-medium text-black transition hover:brightness-110"
      >
        Adicionar transação
      </button>
    </div>
  )
}
