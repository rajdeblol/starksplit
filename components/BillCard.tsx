import { formatAmount, formatDate } from '@/lib/utils'

interface BillCardProps {
  title: string
  totalAmount: number
  currency: string
  createdAt: string
  status: string
}

export function BillCard({ title, totalAmount, currency, createdAt, status }: BillCardProps) {
  return (
    <div className="neo-card p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-slate-900">{title}</h1>
          <p className="mt-1 text-sm text-slate-600">Created {formatDate(createdAt)}</p>
        </div>
        <span
          className={`rounded-full border-2 border-slate-900 px-3 py-1 text-xs font-black ${
            status === 'settled' ? 'bg-emerald-100 text-emerald-700' : 'bg-white text-slate-700'
          }`}
        >
          {status.toUpperCase()}
        </span>
      </div>
      <p className="mt-5 text-3xl font-black text-blue-700">{formatAmount(totalAmount)} {currency}</p>
    </div>
  )
}
