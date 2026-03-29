'use client'

import useSWR from 'swr'
import { useParams } from 'next/navigation'
import { BillCard } from '@/components/BillCard'
import { ShareLinkBox } from '@/components/ShareLinkBox'
import { ParticipantRow } from '@/components/ParticipantRow'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function BillDashboardPage() {
  const params = useParams<{ slug: string }>()
  const slug = params.slug

  const { data, isLoading, error } = useSWR(`/api/bills/${slug}`, fetcher, {
    refreshInterval: 5000,
  })

  if (isLoading) {
    return <main className="mx-auto max-w-4xl px-4 py-10">Loading bill...</main>
  }

  if (error || !data?.bill) {
    return <main className="mx-auto max-w-4xl px-4 py-10">Could not load this bill.</main>
  }

  const bill = data.bill
  const paidCount = bill.participants.filter((p: { paid: boolean }) => p.paid).length
  const progress = bill.participants.length ? (paidCount / bill.participants.length) * 100 : 0

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? window.location.origin

  return (
    <main className="mx-auto min-h-screen w-full max-w-4xl space-y-5 px-4 py-8 sm:px-6">
      <BillCard
        title={bill.title}
        totalAmount={Number(bill.total_amount)}
        currency={bill.currency}
        createdAt={bill.created_at}
        status={bill.status}
      />

      <ShareLinkBox url={`${appUrl}/b/${bill.slug}`} />

      <section className="rounded-2xl border border-gray-200 bg-white p-5">
        <div className="mb-3 flex items-center justify-between text-sm font-medium">
          <span>{paidCount} of {bill.participants.length} paid</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 rounded-full bg-gray-100">
          <div className="h-2 rounded-full bg-violet-600 transition-all" style={{ width: `${progress}%` }} />
        </div>
      </section>

      <section className="space-y-3">
        {bill.participants.map(
          (participant: {
            id: string
            name: string
            share_amount: number
            paid: boolean
            tx_hash: string | null
          }) => (
            <ParticipantRow
              key={participant.id}
              billSlug={slug}
              participant={participant}
              currency={bill.currency}
            />
          ),
        )}
      </section>
    </main>
  )
}
