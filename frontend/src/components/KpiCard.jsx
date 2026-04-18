import { motion } from 'framer-motion'
import { money } from '../utils/format'

export default function KpiCard({ label, value, tone }) {
  const tones = {
    gold: 'from-gold/20 to-transparent border-gold/20',
    success: 'from-emerald-500/20 to-transparent border-emerald-500/20',
    danger: 'from-rose-500/20 to-transparent border-rose-500/20'
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={`rounded-3xl border bg-gradient-to-br ${tones[tone]} bg-panel/90 p-6 shadow-gold backdrop-blur-sm`}
    >
      <p className="text-sm text-muted">{label}</p>
      <h3 className="mt-3 text-3xl font-semibold tracking-tight text-text">{money(value)}</h3>
    </motion.div>
  )
}
