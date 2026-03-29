import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { Toaster } from 'react-hot-toast'
import { StarkzapProvider } from '@starkzap/sdk'
import './globals.css'

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
})

export const metadata: Metadata = {
  title: 'StarkSplit',
  description: 'Gasless onchain bill splitting on Starknet mainnet.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} bg-white text-gray-900 antialiased`}>
        <StarkzapProvider apiKey={process.env.NEXT_PUBLIC_STARKZAP_API_KEY}>
          {children}
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                borderRadius: '12px',
                border: '1px solid #E5E7EB',
                background: '#fff',
                color: '#111827',
              },
            }}
          />
        </StarkzapProvider>
      </body>
    </html>
  )
}
