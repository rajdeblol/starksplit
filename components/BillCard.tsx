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
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <p className="mt-1 text-sm text-gray-500">Created {formatDate(createdAt)}</p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            status === 'settled' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700'
          }`}
        >
          {status.toUpperCase()}
        </span>
      </div>
      <p className="mt-5 text-3xl font-semibold text-violet-700">{formatAmount(totalAmount)} {currency}</p>
    </div>
  )
}
