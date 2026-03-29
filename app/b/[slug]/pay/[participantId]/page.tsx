'use client'

import useSWR from 'swr'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { PayButton } from '@/components/PayButton'
import { formatAmount, toBaseUnits } from '@/lib/utils'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function ParticipantPayPage() {
  const params = useParams<{ slug: string; participantId: string }>()
  const slug = params.slug
  const participantId = params.participantId

  const { data, isLoading } = useSWR(`/api/bills/${slug}`, fetcher, { refreshInterval: 5000 })

  if (isLoading) {
    return <main className="mx-auto max-w-3xl px-4 py-10">Loading payment page...</main>
  }

  const bill = data?.bill
  const participant = bill?.participants?.find((p: { id: string }) => p.id === participantId)

  if (!bill || !participant) {
    return <main className="mx-auto max-w-3xl px-4 py-10">Participant not found.</main>
  }

  if (participant.paid) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10">
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
          <h1 className="text-2xl font-bold text-emerald-700">Already paid</h1>
          <p className="mt-2 text-emerald-700">This share is already settled onchain.</p>
          {participant.tx_hash && (
            <a
              href={`https://starkscan.co/tx/${participant.tx_hash}`}
              className="mt-4 inline-block text-violet-700 underline"
              target="_blank"
              rel="noreferrer"
            >
              View transaction
            </a>
          )}
        </div>
      </main>
    )
  }

  const displayAmount = formatAmount(Number(participant.share_amount))
  const baseUnits = toBaseUnits(participant.share_amount, bill.currency).toString()

  return (
    <main className="mx-auto min-h-screen w-full max-w-3xl space-y-5 px-4 py-8 sm:px-6">
      <header>
        <h1 className="text-3xl font-black uppercase tracking-tight">{bill.title}</h1>
        <p className="mt-1 text-slate-600">Created by {bill.creator_address || 'StarkSplit user'}</p>
      </header>

      <section className="neo-card bg-blue-50 p-6">
        <p className="text-sm font-bold uppercase text-blue-700">Your share</p>
        <p className="mt-2 text-4xl font-black text-slate-900">{displayAmount} {bill.currency}</p>
      </section>

      <section className="neo-card p-5">
        <h2 className="text-lg font-black uppercase">Bill breakdown</h2>
        <div className="mt-3 space-y-2">
          {bill.participants.map((p: { id: string; name: string; share_amount: number }) => (
            <div key={p.id} className="flex items-center justify-between rounded-lg border-2 border-slate-900 bg-white px-3 py-2 text-sm">
              <span>{p.name}</span>
              <span>{formatAmount(Number(p.share_amount))} {bill.currency}</span>
            </div>
          ))}
        </div>
      </section>

      <PayButton
        billId={bill.contract_bill_id}
        participantId={participant.id}
        amount={baseUnits}
        currency={bill.currency}
        labelAmount={displayAmount}
      />

      <Link href={`/b/${slug}`} className="inline-block text-sm text-violet-700 underline">
        Back to bill
      </Link>
    </main>
  )
}
