'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { useStarkzap } from '@starkzap/sdk'

type SplitType = 'even' | 'custom'
type Currency = 'STRK' | 'USDC'

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

export default function CreateBillPage() {
  const router = useRouter()
  const { walletAddress } = useStarkzap()
  const [title, setTitle] = useState('')
  const [totalAmount, setTotalAmount] = useState<number>(120)
  const [currency, setCurrency] = useState<Currency>('STRK')
  const [count, setCount] = useState(3)
  const [splitType, setSplitType] = useState<SplitType>('even')
  const [loading, setLoading] = useState(false)

  const [names, setNames] = useState<string[]>(['Person 1', 'Person 2', 'Person 3'])
  const [customAmounts, setCustomAmounts] = useState<number[]>([40, 40, 40])

  const evenShare = useMemo(() => {
    if (!count || totalAmount <= 0) return 0
    return Number((totalAmount / count).toFixed(4))
  }, [count, totalAmount])

  const totalCustom = useMemo(
    () => customAmounts.reduce((acc, curr) => acc + (Number(curr) || 0), 0),
    [customAmounts],
  )

  const resizeArrays = (nextCount: number) => {
    setNames((prev) =>
      Array.from({ length: nextCount }, (_, i) => prev[i] ?? `Person ${i + 1}`),
    )
    setCustomAmounts((prev) =>
      Array.from({ length: nextCount }, (_, i) => prev[i] ?? Number((totalAmount / nextCount).toFixed(4))),
    )
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) return toast.error('Please add a bill title.')
    if (totalAmount <= 0) return toast.error('Total amount must be greater than 0.')

    const normalizedNames = names.map((n, i) => n.trim() || `Person ${i + 1}`)

    const shares =
      splitType === 'even'
        ? Array.from({ length: count }, () => evenShare)
        : customAmounts.map((n) => Number(n || 0))

    const roundedTotal = Number(totalAmount.toFixed(4))
    const roundedShares = Number(shares.reduce((a, b) => a + b, 0).toFixed(4))

    if (splitType === 'custom' && roundedShares !== roundedTotal) {
      return toast.error('Custom amounts must sum to total amount.')
    }

    setLoading(true)
    try {
      const res = await fetch('/api/bills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          total_amount: roundedTotal,
          currency,
          creator_address: walletAddress,
          participants: normalizedNames.map((name, index) => ({
            name,
            share_amount: shares[index],
          })),
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data?.error ?? 'Failed to create bill.')

      toast.success('Bill created! Share the link.')
      router.push(`/b/${data.slug}`)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not create bill.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-3xl px-4 py-10 sm:px-6">
      <div className="neo-card p-6 sm:p-8">
        <h1 className="text-3xl font-black uppercase tracking-tight text-slate-900">Create a bill</h1>
        <p className="mt-2 text-slate-600">Set participants, choose split strategy, and share payment links.</p>
        {walletAddress && <p className="mt-2 text-sm text-blue-700">Creator wallet: {walletAddress}</p>}

      <form onSubmit={onSubmit} className="mt-8 space-y-6">
        <div>
          <label className="mb-2 block text-sm font-medium">Bill title</label>
          <input
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none ring-violet-200 focus:ring"
            placeholder="Dinner at Nobu"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium">Total amount</label>
            <input
              type="number"
              min="0"
              step="0.0001"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none ring-violet-200 focus:ring"
              placeholder="120"
              value={totalAmount}
              onChange={(e) => setTotalAmount(Number(e.target.value || 0))}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Currency</label>
            <div className="grid grid-cols-2 rounded-xl border-2 border-slate-900 bg-white p-1">
              {(['STRK', 'USDC'] as const).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCurrency(c)}
                  className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                    currency === c ? 'bg-violet-600 text-white' : 'text-gray-600'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Number of people</label>
          <div className="flex w-fit items-center gap-3 rounded-xl border-2 border-slate-900 bg-white p-1">
            <button
              type="button"
              className="rounded-lg px-3 py-2 text-lg hover:bg-gray-100"
              onClick={() => {
                const next = clamp(count - 1, 2, 10)
                setCount(next)
                resizeArrays(next)
              }}
            >
              -
            </button>
            <span className="w-8 text-center font-semibold">{count}</span>
            <button
              type="button"
              className="rounded-lg px-3 py-2 text-lg hover:bg-gray-100"
              onClick={() => {
                const next = clamp(count + 1, 2, 10)
                setCount(next)
                resizeArrays(next)
              }}
            >
              +
            </button>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Split type</label>
          <div className="grid grid-cols-2 rounded-xl border-2 border-slate-900 bg-white p-1">
            <button
              type="button"
              onClick={() => setSplitType('even')}
              className={`rounded-lg px-4 py-2 text-sm font-semibold ${
                splitType === 'even' ? 'bg-violet-600 text-white' : 'text-gray-600'
              }`}
            >
              Even split
            </button>
            <button
              type="button"
              onClick={() => setSplitType('custom')}
              className={`rounded-lg px-4 py-2 text-sm font-semibold ${
                splitType === 'custom' ? 'bg-violet-600 text-white' : 'text-gray-600'
              }`}
            >
              Custom amounts
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="grid gap-3 sm:grid-cols-[1fr_auto]">
              <input
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none ring-violet-200 focus:ring"
                value={names[i] ?? ''}
                onChange={(e) => {
                  const next = [...names]
                  next[i] = e.target.value
                  setNames(next)
                }}
                placeholder={`Person ${i + 1}`}
              />
              {splitType === 'custom' ? (
                <input
                  type="number"
                  step="0.0001"
                  min="0"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none ring-violet-200 focus:ring sm:w-40"
                  value={customAmounts[i] ?? 0}
                  onChange={(e) => {
                    const next = [...customAmounts]
                    next[i] = Number(e.target.value || 0)
                    setCustomAmounts(next)
                  }}
                />
              ) : (
                <div className="flex items-center rounded-xl bg-gray-100 px-4 text-sm font-medium text-gray-600 sm:w-40">
                  {evenShare} {currency}
                </div>
              )}
            </div>
          ))}

          {splitType === 'custom' && (
            <p className={`text-sm ${Number(totalCustom.toFixed(4)) === Number(totalAmount.toFixed(4)) ? 'text-emerald-600' : 'text-red-500'}`}>
              Sum: {totalCustom.toFixed(4)} / {totalAmount.toFixed(4)} {currency}
            </p>
          )}
        </div>

        <button disabled={loading} className="neo-btn w-full bg-blue-600 py-4 text-lg text-white disabled:opacity-70">
          {loading ? 'Creating bill...' : 'Create bill'}
        </button>
      </form>
      </div>
    </main>
  )
}
