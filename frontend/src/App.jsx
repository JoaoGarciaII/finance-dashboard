import { useMemo, useState } from 'react'
import { Sparkles, Filter, WalletCards } from 'lucide-react'
import { motion } from 'framer-motion'
import Sidebar from './components/Sidebar'
import KpiCard from './components/KpiCard'
import TransactionForm from './components/TransactionForm'
import TransactionTable from './components/TransactionTable'
import ChartsSection from './components/ChartsSection'
import EmptyState from './components/EmptyState'
import Toast from './components/Toast'
import { useFinanceData } from './hooks/useFinanceData'

const fade = { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3 } }

export default function App() {
  const [activeView, setActiveView] = useState('Dashboard')
  const [filters, setFilters] = useState({ date_from: '', date_to: '' })
  const [editing, setEditing] = useState(null)
  const [toast, setToast] = useState(null)
  const [formVisible, setFormVisible] = useState(false)

  const { transactions, summary, loading, createTransaction, updateTransaction, deleteTransaction } =
    useFinanceData(filters)

  const welcome = useMemo(() => {
    const h = new Date().getHours()
    if (h < 12) return 'Bom dia'
    if (h < 18) return 'Boa tarde'
    return 'Boa noite'
  }, [])

  const notify = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3200)
  }

  const handleSubmit = async (payload) => {
    try {
      if (editing) {
        await updateTransaction(editing.id, payload)
        setEditing(null)
        notify('Transação atualizada com sucesso!')
      } else {
        await createTransaction(payload)
        notify('Transação adicionada!')
      }
      setFormVisible(false)
    } catch {
      notify('Erro ao salvar transação.', 'error')
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteTransaction(id)
      notify('Transação removida.')
    } catch {
      notify('Erro ao remover.', 'error')
    }
  }

  const handleEdit = (tx) => {
    setEditing(tx)
    setFormVisible(true)
    setActiveView('Transações')
  }

  return (
    <div className="flex min-h-screen bg-background bg-premium text-text">
      <Sidebar active={activeView} onNavigate={setActiveView} />

      {/* Main content */}
      <div className="flex-1 pl-16 lg:pl-56">
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

          {/* ─── DASHBOARD VIEW ─── */}
          {activeView === 'Dashboard' && (
            <motion.div {...fade} className="space-y-8">
              {/* Header */}
              <header className="rounded-[32px] border border-gold/10 bg-panel/80 p-6 shadow-glow backdrop-blur">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
                  <div>
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/10 px-4 py-1.5 text-xs uppercase tracking-[0.25em] text-gold">
                      <Sparkles size={13} /> Premium Finance UI
                    </div>
                    <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{welcome}, João</h1>
                    <p className="mt-3 max-w-xl text-base text-muted">
                      Visão completa das suas finanças pessoais com design premium e dados em tempo real.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 rounded-2xl border border-line bg-black/20 px-4 py-3 text-xs text-muted">
                    <WalletCards size={16} className="text-gold" /> React · Tailwind · Flask · Chart.js
                  </div>
                </div>
              </header>

              {/* KPIs */}
              <section className="grid gap-4 md:grid-cols-3">
                <KpiCard label="Saldo total" value={summary.balance} tone="gold" />
                <KpiCard label="Receitas do período" value={summary.income} tone="success" />
                <KpiCard label="Despesas do período" value={summary.expense} tone="danger" />
              </section>

              {/* Charts */}
              <ChartsSection summary={summary} />
            </motion.div>
          )}

          {/* ─── TRANSAÇÕES VIEW ─── */}
          {activeView === 'Transações' && (
            <motion.div {...fade} className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-text">Transações</h2>
                {!formVisible && (
                  <button
                    onClick={() => { setEditing(null); setFormVisible(true) }}
                    className="rounded-2xl bg-gold px-5 py-2.5 text-sm font-medium text-black transition hover:brightness-110"
                  >
                    + Nova transação
                  </button>
                )}
              </div>

              {formVisible && (
                <TransactionForm
                  onSubmit={handleSubmit}
                  editing={editing}
                  onCancel={() => { setEditing(null); setFormVisible(false) }}
                />
              )}

              {/* Filtro */}
              <div className="rounded-3xl border border-gold/10 bg-panel/90 p-5 shadow-glow">
                <div className="mb-4 flex items-center gap-2 text-sm font-medium text-muted">
                  <Filter size={16} className="text-gold" /> Filtrar por data
                </div>
                <div className="flex flex-wrap items-end gap-4">
                  <div className="flex flex-1 flex-col gap-1 min-w-[140px]">
                    <label className="text-xs text-muted">De</label>
                    <input
                      type="date"
                      value={filters.date_from}
                      onChange={e => setFilters(f => ({ ...f, date_from: e.target.value }))}
                      className="rounded-2xl border border-line bg-black/30 px-4 py-2.5 text-sm text-text outline-none focus:border-gold"
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-1 min-w-[140px]">
                    <label className="text-xs text-muted">Até</label>
                    <input
                      type="date"
                      value={filters.date_to}
                      onChange={e => setFilters(f => ({ ...f, date_to: e.target.value }))}
                      className="rounded-2xl border border-line bg-black/30 px-4 py-2.5 text-sm text-text outline-none focus:border-gold"
                    />
                  </div>
                  <button
                    onClick={() => setFilters({ date_from: '', date_to: '' })}
                    className="rounded-2xl border border-gold/20 px-4 py-2.5 text-sm text-gold transition hover:bg-gold/10"
                  >
                    Limpar
                  </button>
                </div>
              </div>

              {loading
                ? <div className="rounded-3xl border border-gold/10 bg-panel/90 p-14 text-center text-muted shadow-glow">Carregando...</div>
                : transactions.length === 0
                  ? <EmptyState onAdd={() => setFormVisible(true)} />
                  : <TransactionTable transactions={transactions} onEdit={handleEdit} onDelete={handleDelete} />
              }
            </motion.div>
          )}

          {/* ─── RELATÓRIOS VIEW ─── */}
          {activeView === 'Relatórios' && (
            <motion.div {...fade} className="space-y-6">
              <h2 className="text-2xl font-semibold text-text">Relatórios</h2>
              <ChartsSection summary={summary} />
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-3xl border border-gold/10 bg-panel/90 p-6 shadow-glow">
                  <h3 className="mb-4 text-base font-semibold text-text">Top categorias de despesa</h3>
                  <ul className="space-y-3">
                    {summary.categories
                      .filter(c => true)
                      .slice(0, 6)
                      .map((cat, i) => (
                        <li key={cat.category} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold/10 text-xs text-gold font-semibold">{i + 1}</span>
                            <span className="text-sm text-text">{cat.category}</span>
                          </div>
                          <span className="text-sm font-medium text-gold">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cat.total)}
                          </span>
                        </li>
                      ))}
                  </ul>
                </div>
                <div className="rounded-3xl border border-gold/10 bg-panel/90 p-6 shadow-glow">
                  <h3 className="mb-4 text-base font-semibold text-text">Resumo geral</h3>
                  <div className="space-y-4">
                    {[
                      { label: 'Total de transações', value: transactions.length },
                      { label: 'Saldo atual', value: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(summary.balance) },
                      { label: 'Receitas totais', value: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(summary.income) },
                      { label: 'Despesas totais', value: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(summary.expense) },
                    ].map(item => (
                      <div key={item.label} className="flex items-center justify-between border-b border-line pb-4 last:border-0">
                        <span className="text-sm text-muted">{item.label}</span>
                        <span className="text-sm font-semibold text-text">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ─── AJUSTES VIEW ─── */}
          {activeView === 'Ajustes' && (
            <motion.div {...fade} className="space-y-6">
              <h2 className="text-2xl font-semibold text-text">Ajustes</h2>
              <div className="rounded-3xl border border-gold/10 bg-panel/90 p-8 shadow-glow text-center text-muted">
                <p className="text-sm">Em breve — autenticação, metas financeiras, exportação CSV e mais.</p>
              </div>
            </motion.div>
          )}

        </main>
      </div>

      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
