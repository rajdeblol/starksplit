'use client'

import { useStarkzap } from '@starkzap/sdk'
import { CONTRACT_ADDRESS } from '@/lib/contract'
import { toU256Parts } from '@/lib/utils'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

interface PayButtonProps {
  billId: string
  participantId: string
  amount: string
  currency: string
  labelAmount: string
}

export function PayButton({ billId, participantId, amount, currency, labelAmount }: PayButtonProps) {
  const { executeGasless, walletAddress, connectWallet, isConnected, isConnecting } = useStarkzap()
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle')
  const router = useRouter()

  const handlePay = async () => {
    try {
      setStatus('pending')

      const [low, high] = toU256Parts(BigInt(amount))
      const result = await executeGasless({
        contractAddress: CONTRACT_ADDRESS,
        entrypoint: 'record_payment',
        calldata: [billId, low, high],
      })

      const txHash = result.transaction_hash

      const dbRes = await fetch('/api/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ participantId, txHash, walletAddress }),
      })

      if (!dbRes.ok) {
        const data = await dbRes.json()
        throw new Error(data?.error ?? 'Could not update payment state.')
      }

      setStatus('success')
      toast.success('Payment confirmed onchain.')
      router.push(`/receipt/${txHash}`)
    } catch (err) {
      console.error(err)
      setStatus('error')
      toast.error(err instanceof Error ? err.message : 'Failed — try again')
    }
  }

  if (!isConnected) {
    return (
      <button
        onClick={connectWallet}
        disabled={isConnecting}
        className="neo-btn w-full bg-blue-600 py-4 text-lg text-white"
      >
        {isConnecting ? 'Connecting wallet...' : 'Connect Wallet to Pay'}
      </button>
    )
  }

  return (
    <button
      onClick={handlePay}
      disabled={status === 'pending' || status === 'success'}
      className="neo-btn w-full bg-blue-600 py-4 text-lg text-white disabled:cursor-not-allowed disabled:opacity-70"
    >
      {status === 'idle' && `Pay ${labelAmount} ${currency}`}
      {status === 'pending' && 'Confirming on Starknet...'}
      {status === 'success' && 'Paid!'}
      {status === 'error' && 'Failed — try again'}
    </button>
  )
}
