'use client'

import toast from 'react-hot-toast'
import { formatAmount, shortenTxHash } from '@/lib/utils'

interface ParticipantRowProps {
  billSlug: string
  participant: {
    id: string
    name: string
    share_amount: number
    paid: boolean
    tx_hash: string | null
  }
  currency: string
}

export function ParticipantRow({ billSlug, participant, currency }: ParticipantRowProps) {
  const copyReminder = async () => {
    const payLink = `${window.location.origin}/b/${billSlug}/pay/${participant.id}`
    await navigator.clipboard.writeText(payLink)
    toast.success('Link copied!')
  }

  return (
    <div className="grid grid-cols-[1fr_auto_auto] items-center gap-3 rounded-xl border-2 border-slate-900 bg-white p-4 shadow-[4px_4px_0_0_#0f172a] transition hover:-translate-y-0.5">
      <div>
        <p className="font-bold text-slate-900">{participant.name}</p>
        <p className="text-sm text-slate-600">{formatAmount(participant.share_amount)} {currency}</p>
      </div>

      {participant.paid ? (
        <div className="text-right">
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">PAID</span>
          {participant.tx_hash && (
            <a
              className="mt-2 block text-xs text-violet-700 hover:underline"
              href={`https://starkscan.co/tx/${participant.tx_hash}`}
              target="_blank"
              rel="noreferrer"
            >
              {shortenTxHash(participant.tx_hash)}
            </a>
          )}
        </div>
      ) : (
        <>
          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">UNPAID</span>
          <button
            onClick={copyReminder}
            className="neo-btn bg-white px-3 py-2 text-xs font-bold text-slate-900"
          >
            Send reminder
          </button>
        </>
      )}
    </div>
  )
}
