import { Pencil, Trash2 } from 'lucide-react'
import { dateBR, money } from '../utils/format'

export default function TransactionTable({ transactions, onEdit, onDelete }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-gold/10 bg-panel/90 shadow-glow">
      <div className="border-b border-line px-6 py-5">
        <h3 className="text-lg font-semibold text-text">Últimas transações</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left">
          <thead className="bg-white/0 text-xs uppercase tracking-[0.2em] text-muted">
            <tr>
              <th className="px-6 py-4">Tipo</th>
              <th className="px-6 py-4">Categoria</th>
              <th className="px-6 py-4">Descrição</th>
              <th className="px-6 py-4">Data</th>
              <th className="px-6 py-4">Valor</th>
              <th className="px-6 py-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id} className="border-t border-line transition hover:bg-white/[0.02]">
                <td className="px-6 py-4">
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${tx.type === 'income' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                    {tx.type === 'income' ? 'Receita' : 'Despesa'}
                  </span>
                </td>
                <td className="px-6 py-4 text-text">{tx.category}</td>
                <td className="px-6 py-4 text-muted">{tx.description}</td>
                <td className="px-6 py-4 text-muted">{dateBR(tx.date)}</td>
                <td className={`px-6 py-4 font-medium ${tx.type === 'income' ? 'text-emerald-400' : 'text-gold'}`}>
                  {tx.type === 'income' ? '+' : '-'} {money(tx.amount)}
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => onEdit(tx)} className="rounded-xl border border-line p-2 text-muted transition hover:border-gold/30 hover:text-text">
                      <Pencil size={16} />
                    </button>
                    <button onClick={() => onDelete(tx.id)} className="rounded-xl border border-line p-2 text-muted transition hover:border-rose-500/30 hover:text-rose-400">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
