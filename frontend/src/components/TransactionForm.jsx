import { useEffect, useState } from 'react'

const initialState = {
  type: 'expense',
  category: '',
  description: '',
  amount: '',
  date: new Date().toISOString().slice(0, 10),
}

export default function TransactionForm({ onSubmit, editing, onCancel }) {
  const [form, setForm] = useState(initialState)

  useEffect(() => {
    if (editing) setForm(editing)
    else setForm(initialState)
  }, [editing])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const submit = (e) => {
    e.preventDefault()
    onSubmit({ ...form, amount: Number(form.amount) })
    setForm(initialState)
  }

  return (
    <form onSubmit={submit} className="grid gap-4 rounded-3xl border border-gold/10 bg-panel/90 p-6 shadow-glow">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-text">{editing ? 'Editar transação' : 'Nova transação'}</h3>
        {editing && <button type="button" onClick={onCancel} className="text-sm text-muted hover:text-text">Cancelar</button>}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <select name="type" value={form.type} onChange={handleChange} className="rounded-2xl border border-line bg-black/30 px-4 py-3 text-text outline-none focus:border-gold">
          <option value="income">Receita</option>
          <option value="expense">Despesa</option>
        </select>
        <input name="category" value={form.category} onChange={handleChange} placeholder="Categoria" className="rounded-2xl border border-line bg-black/30 px-4 py-3 text-text outline-none focus:border-gold" required />
      </div>

      <input name="description" value={form.description} onChange={handleChange} placeholder="Descrição" className="rounded-2xl border border-line bg-black/30 px-4 py-3 text-text outline-none focus:border-gold" required />

      <div className="grid gap-4 md:grid-cols-2">
        <input name="amount" type="number" step="0.01" value={form.amount} onChange={handleChange} placeholder="Valor" className="rounded-2xl border border-line bg-black/30 px-4 py-3 text-text outline-none focus:border-gold" required />
        <input name="date" type="date" value={form.date} onChange={handleChange} className="rounded-2xl border border-line bg-black/30 px-4 py-3 text-text outline-none focus:border-gold" required />
      </div>

      <button className="rounded-2xl bg-gold px-5 py-3 font-medium text-black transition hover:brightness-110">
        {editing ? 'Salvar alterações' : 'Adicionar transação'}
      </button>
    </form>
  )
}
