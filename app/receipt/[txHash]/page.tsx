'use client'

import useSWR from 'swr'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import toast from 'react-hot-toast'
import { ReceiptStamp } from '@/components/ReceiptStamp'
import { formatAmount, shortenTxHash } from '@/lib/utils'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function ReceiptPage() {
  const params = useParams<{ txHash: string }>()
  const txHash = params.txHash
  const { data } = useSWR(`/api/pay?txHash=${txHash}`, fetcher)

  const receipt = data?.receipt
  const billTitle = receipt?.bill?.title ?? 'my bill'
  const amount = receipt?.participant?.share_amount
  const billSlug = receipt?.bill?.slug
  const starkscan = `https://starkscan.co/tx/${txHash}`

  const copy = async (value: string, label = 'Link copied!') => {
    await navigator.clipboard.writeText(value)
    toast.success(label)
  }

  const tweet = `Just paid my share of ${billTitle} onchain with @Starknet ⚡ No gas. No MetaMask. One click. Tx: ${starkscan} Built with @StarkzapSDK #StarkSplit`

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col items-center justify-center px-4 py-10 text-center sm:px-6">
      <div className="w-full rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <ReceiptStamp />
        <h1 className="mt-6 text-3xl font-bold">Payment confirmed</h1>

        <p className="mt-3 text-gray-600">
          {amount ? `${formatAmount(Number(amount))} ${receipt?.bill?.currency}` : 'Payment recorded on Starknet.'}
        </p>

        <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-4 text-left">
          <p className="text-xs uppercase text-gray-500">Transaction hash</p>
          <div className="mt-1 flex items-center justify-between gap-3">
            <p className="font-mono text-sm">{shortenTxHash(txHash)}</p>
            <button onClick={() => copy(txHash)} className="text-sm font-semibold text-violet-700 underline">
              Copy
            </button>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3">
          <a
            href={starkscan}
            target="_blank"
            rel="noreferrer"
            className="rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white hover:bg-violet-700"
          >
            View on Starkscan
          </a>
          <button
            onClick={() => copy(tweet, 'Tweet text copied!')}
            className="rounded-xl border border-gray-300 px-5 py-3 text-sm font-semibold hover:bg-gray-100"
          >
            Share your receipt
          </button>
          {billSlug && (
            <Link href={`/b/${billSlug}`} className="text-sm text-violet-700 underline">
              Back to bill
            </Link>
          )}
        </div>
      </div>
    </main>
  )
}
