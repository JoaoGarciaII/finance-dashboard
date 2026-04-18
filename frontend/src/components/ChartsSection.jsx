import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js'
import { Doughnut, Line } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend)

export default function ChartsSection({ summary }) {
  const categoryData = {
    labels: summary.categories.map((item) => item.category),
    datasets: [{
      data: summary.categories.map((item) => item.total),
      backgroundColor: ['#D4A24C', '#b17a2f', '#7c531f', '#3f8c6b', '#7f1d1d', '#1f2937'],
      borderWidth: 0,
    }],
  }

  const monthlyData = {
    labels: summary.monthly.map((item) => item.month),
    datasets: [
      {
        label: 'Receitas',
        data: summary.monthly.map((item) => item.income),
        borderColor: '#2dd4bf',
        backgroundColor: 'rgba(45,212,191,0.12)',
        tension: 0.35,
      },
      {
        label: 'Despesas',
        data: summary.monthly.map((item) => item.expense),
        borderColor: '#D4A24C',
        backgroundColor: 'rgba(212,162,76,0.12)',
        tension: 0.35,
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: { labels: { color: '#F5F2EA' } }
    },
    scales: {
      x: { ticks: { color: '#A19A90' }, grid: { color: 'rgba(255,255,255,0.05)' } },
      y: { ticks: { color: '#A19A90' }, grid: { color: 'rgba(255,255,255,0.05)' } },
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.2fr,0.8fr]">
      <div className="rounded-3xl border border-gold/10 bg-panel/90 p-6 shadow-glow">
        <h3 className="mb-6 text-lg font-semibold text-text">Tendência mensal</h3>
        <Line data={monthlyData} options={options} />
      </div>
      <div className="rounded-3xl border border-gold/10 bg-panel/90 p-6 shadow-glow">
        <h3 className="mb-6 text-lg font-semibold text-text">Categorias</h3>
        <Doughnut data={categoryData} options={{ plugins: { legend: { labels: { color: '#F5F2EA' } } } }} />
      </div>
    </div>
  )
}
