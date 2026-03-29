import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-12 sm:px-6 lg:flex-row lg:items-start lg:justify-between">
        <section className="max-w-xl">
          <p className="mb-4 inline-block rounded-full border-2 border-slate-900 bg-white px-4 py-1 text-sm font-bold text-slate-900">
            Starknet Mainnet • Gasless
          </p>
          <h1 className="text-4xl font-black uppercase leading-[0.95] tracking-tight text-slate-900 sm:text-6xl">
            Split bills. Pay onchain. No excuses.
          </h1>
          <p className="mt-5 max-w-2xl text-2xl leading-relaxed text-slate-600">
            Gasless payments on Starknet. Every split is an immutable proof.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link
              href="/create"
              className="neo-btn inline-flex bg-blue-600 px-7 py-4 text-lg font-bold text-white"
            >
              Create a bill
            </Link>
            <a
              href="#how-it-works"
              className="neo-btn inline-flex bg-white px-7 py-4 text-lg font-bold text-slate-900"
            >
              How it works
            </a>
          </div>
          
          <div className="mt-8 flex flex-wrap gap-3 text-sm">
            {['No gas fees', 'Onchain proof'].map((pill) => (
              <span
                key={pill}
                className="rounded-full border-2 border-slate-900 bg-white px-4 py-2 font-bold text-slate-800"
              >
                {pill}
              </span>
            ))}
          </div>

          <div id="how-it-works" className="mt-16 space-y-6 scroll-mt-20">
            <h2 className="text-2xl font-black uppercase tracking-tight text-slate-900">How it works</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="neo-card p-5">
                <p className="text-lg font-bold text-blue-600 uppercase">1. Create</p>
                <p className="mt-2 text-slate-600">Enter bill details, add participants and their shares. No wallet needed to start.</p>
              </div>
              <div className="neo-card p-5">
                <p className="text-lg font-bold text-blue-600 uppercase">2. Share</p>
                <p className="mt-2 text-slate-600">Send unique payment links to your friends via any chat app.</p>
              </div>
              <div className="neo-card p-5">
                <p className="text-lg font-bold text-blue-600 uppercase">3. Pay</p>
                <p className="mt-2 text-slate-600">Friends connect their Argent X or Braavos wallet and pay gasless. Simple.</p>
              </div>
              <div className="neo-card p-5">
                <p className="text-lg font-bold text-blue-600 uppercase">4. Verify</p>
                <p className="mt-2 text-slate-600">Once paid, check the transaction on the Starknet explorer for immutable proof.</p>
              </div>
            </div>
          </div>
        </section>

        <aside className="neo-card w-full max-w-xl p-6">
          <p className="text-xs uppercase tracking-wide text-slate-600">Latest Receipt</p>
          <h2 className="mt-2 text-3xl font-black uppercase text-slate-900">Dinner at Zara&apos;s</h2>
          <div className="mt-6 space-y-3 text-sm">
            <div className="flex items-center justify-between rounded-lg border-2 border-slate-900 bg-white px-3 py-2">
              <span>Alice</span>
              <span className="font-medium">30 STRK</span>
            </div>
            <div className="flex items-center justify-between rounded-lg border-2 border-slate-900 bg-white px-3 py-2">
              <span>Bob</span>
              <span className="font-medium">30 STRK</span>
            </div>
            <div className="flex items-center justify-between rounded-lg border-2 border-slate-900 bg-white px-3 py-2">
              <span>Chris</span>
              <span className="font-extrabold text-emerald-600">PAID</span>
            </div>
          </div>
          <div className="mt-6 rounded-lg border-2 border-slate-900 bg-emerald-100 px-4 py-3 text-sm font-semibold text-emerald-800">
            Tx confirmed on Starkscan
          </div>
        </aside>
      </div>
    </main>
  )
}
