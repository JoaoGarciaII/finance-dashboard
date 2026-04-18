import { useEffect, useState } from 'react'
import axios from 'axios'

const API = 'http://127.0.0.1:5000/api'

export function useFinanceData(filters) {
  const [transactions, setTransactions] = useState([])
  const [summary, setSummary] = useState({ income: 0, expense: 0, balance: 0, categories: [], monthly: [] })
  const [loading, setLoading] = useState(true)

  const fetchAll = async () => {
    setLoading(true)
    const params = {}
    if (filters.date_from) params.date_from = filters.date_from
    if (filters.date_to) params.date_to = filters.date_to
    const [txRes, sumRes] = await Promise.all([
      axios.get(`${API}/transactions`, { params }),
      axios.get(`${API}/summary`, { params })
    ])
    setTransactions(txRes.data)
    setSummary(sumRes.data)
    setLoading(false)
  }

  useEffect(() => {
    fetchAll()
  }, [filters.date_from, filters.date_to])

  const createTransaction = async (payload) => {
    await axios.post(`${API}/transactions`, payload)
    fetchAll()
  }

  const updateTransaction = async (id, payload) => {
    await axios.put(`${API}/transactions/${id}`, payload)
    fetchAll()
  }

  const deleteTransaction = async (id) => {
    await axios.delete(`${API}/transactions/${id}`)
    fetchAll()
  }

  return { transactions, summary, loading, createTransaction, updateTransaction, deleteTransaction }
}
