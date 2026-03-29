'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { WalletButton } from '@/components/WalletButton'

const links = [
  { href: '/', label: 'Home' },
  { href: '/create', label: 'Create Bill' },
]

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen">
      <header className="border-b-4 border-slate-900 bg-slate-100">
        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <Link href="/" className="neo-logo">
            STARKSPLIT
          </Link>

          <nav className="flex items-center gap-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`neo-tab ${pathname === link.href ? 'bg-blue-600 text-white' : 'bg-white text-slate-900'}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <WalletButton />
        </div>
      </header>

      <div>{children}</div>
    </div>
  )
}
