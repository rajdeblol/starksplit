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
    <div className="neo-card p-5">
      <h2 className="text-base font-black uppercase">Share this bill</h2>
      <div className="mt-3 flex gap-2">
        <input
          readOnly
          value={url}
          className="w-full rounded-xl border-2 border-slate-900 bg-white px-3 py-2 text-sm"
        />
        <button
          onClick={() => copy(url)}
          className="neo-btn bg-blue-600 px-4 py-2 text-sm text-white"
        >
          Copy
        </button>
      </div>
      <div className="mt-4 flex justify-center rounded-xl border-2 border-slate-900 bg-white p-4">
        <QRCodeSVG value={url} size={140} />
      </div>
    </div>
  )
}
