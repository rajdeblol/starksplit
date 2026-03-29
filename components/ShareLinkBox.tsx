'use client'

import { QRCodeSVG } from 'qrcode.react'
import toast from 'react-hot-toast'

interface ShareLinkBoxProps {
  url: string
}

export function ShareLinkBox({ url }: ShareLinkBoxProps) {
  const copy = async (value: string, success = 'Link copied!') => {
    await navigator.clipboard.writeText(value)
    toast.success(success)
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <h2 className="text-base font-semibold">Share this bill</h2>
      <div className="mt-3 flex gap-2">
        <input
          readOnly
          value={url}
          className="w-full rounded-xl border border-gray-300 bg-gray-50 px-3 py-2 text-sm"
        />
        <button
          onClick={() => copy(url)}
          className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700"
        >
          Copy
        </button>
      </div>
      <div className="mt-4 flex justify-center rounded-xl border border-gray-100 bg-gray-50 p-4">
        <QRCodeSVG value={url} size={140} />
      </div>
    </div>
  )
}
