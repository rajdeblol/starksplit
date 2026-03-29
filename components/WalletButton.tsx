'use client'

import { useStarkzap } from '@starkzap/sdk'
import { shortenAddress } from '@/lib/utils'

export function WalletButton() {
  const { connectWallet, isConnecting, isConnected, walletAddress } = useStarkzap()

  return (
    <button
      onClick={connectWallet}
      disabled={isConnecting || isConnected}
      className="neo-btn bg-blue-600 text-white disabled:cursor-not-allowed disabled:opacity-70"
      title={walletAddress ?? 'Connect wallet'}
    >
      {isConnecting && 'Connecting...'}
      {!isConnecting && isConnected && shortenAddress(walletAddress || '', 8)}
      {!isConnecting && !isConnected && 'Connect Wallet'}
    </button>
  )
}
