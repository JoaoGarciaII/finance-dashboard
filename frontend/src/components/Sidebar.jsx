import { LayoutDashboard, ArrowDownUp, BarChart3, Settings, Coins } from 'lucide-react'

const links = [
  { icon: LayoutDashboard, label: 'Dashboard' },
  { icon: ArrowDownUp,    label: 'Transações' },
  { icon: BarChart3,      label: 'Relatórios'  },
  { icon: Settings,       label: 'Ajustes'     },
]

export default function Sidebar({ active, onNavigate }) {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 flex w-16 flex-col items-center gap-6 border-r border-line bg-panel py-6 lg:w-56 lg:items-start lg:px-5">
      {/* Logo */}
      <div className="flex items-center gap-3 lg:mb-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-gold/15 text-gold">
          <Coins size={20} />
        </div>
        <span className="hidden text-sm font-semibold tracking-wide text-text lg:block">Premium<span className="text-gold">Fi</span></span>
      </div>

      {/* Links */}
      <nav className="flex flex-1 flex-col gap-2">
        {links.map(({ icon: Icon, label }) => {
          const isActive = active === label
          return (
            <button
              key={label}
              onClick={() => onNavigate(label)}
              className={`group flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-sm transition
                ${isActive
                  ? 'bg-gold/10 text-gold'
                  : 'text-muted hover:bg-white/5 hover:text-text'
                }`}
            >
              <Icon size={18} className={isActive ? 'text-gold' : ''} />
              <span className="hidden lg:block">{label}</span>
            </button>
          )
        })}
      </nav>

      {/* User badge */}
      <div className="flex w-full items-center gap-3 rounded-2xl border border-line bg-black/20 p-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold/20 text-xs font-bold text-gold">JP</div>
        <div className="hidden lg:block">
          <p className="text-xs font-medium text-text">João Pedro</p>
          <p className="text-xs text-muted">Premium</p>
        </div>
      </div>
    </aside>
  )
}
