import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-violet-50 to-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-14 px-4 py-16 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <section className="max-w-xl">
          <p className="mb-4 inline-block rounded-full border border-violet-200 bg-violet-100 px-4 py-1 text-sm font-medium text-violet-700">
            Starknet Mainnet • Gasless
          </p>
          <h1 className="text-4xl font-bold leading-tight text-gray-900 sm:text-5xl">
            Split bills. Pay onchain. No excuses.
          </h1>
          <p className="mt-5 text-lg text-gray-600">
            Gasless payments on Starknet. Every split is an immutable proof.
          </p>
          <Link
            href="/create"
            className="mt-8 inline-flex rounded-xl bg-violet-600 px-6 py-3 text-base font-semibold text-white transition hover:bg-violet-700"
          >
            Create a bill
          </Link>
          <div className="mt-8 flex flex-wrap gap-3 text-sm">
            {['No gas fees', 'No wallet install', 'Onchain proof'].map((pill) => (
              <span
                key={pill}
                className="rounded-full border border-gray-200 bg-gray-100 px-4 py-2 font-medium text-gray-700"
              >
                {pill}
              </span>
            ))}
          </div>
        </section>

        <aside className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-gray-500">Latest Receipt</p>
          <h2 className="mt-2 text-xl font-semibold">Dinner at Zara&apos;s</h2>
          <div className="mt-6 space-y-3 text-sm">
            <div className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
              <span>Alice</span>
              <span className="font-medium">30 STRK</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
              <span>Bob</span>
              <span className="font-medium">30 STRK</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
              <span>Chris</span>
              <span className="font-medium text-emerald-600">PAID</span>
            </div>
          </div>
          <div className="mt-6 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            Tx confirmed on Starkscan
          </div>
        </aside>
      </div>
    </main>
  )
}
