'use client'

import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { StarkZap } from 'starkzap'
import type { WalletInterface } from 'starkzap'

interface ExecuteGaslessInput {
  contractAddress: string
  entrypoint: string
  calldata: string[]
}

interface StarkzapContextValue {
  connectWallet: () => Promise<void>
  executeGasless: (input: ExecuteGaslessInput) => Promise<{ transaction_hash: string }>
  walletAddress: string | null
  isConnected: boolean
  isConnecting: boolean
}

const StarkzapContext = createContext<StarkzapContextValue | null>(null)

interface StarkzapProviderProps {
  apiKey?: string
  children: ReactNode
}

export function StarkzapProvider({ children }: StarkzapProviderProps) {
  const [wallet, setWallet] = useState<WalletInterface | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)

  const sdk = useMemo(() => {
    // `apiKey` is accepted to match expected app wiring even though
    // the current Starkzap constructor is network-driven.
    return new StarkZap({ network: 'mainnet' })
  }, [])

  const connectWallet = useCallback(async () => {
    if (wallet) return wallet

    try {
      setIsConnecting(true)
      const connected = await sdk.connectCartridge({ feeMode: 'sponsored' })
      await connected.ensureReady({ deploy: 'if_needed', feeMode: 'sponsored' })
      setWallet(connected)
      return connected
    } finally {
      setIsConnecting(false)
    }
  }, [wallet, sdk])

  const executeGasless = useCallback(
    async ({ contractAddress, entrypoint, calldata }: ExecuteGaslessInput) => {
      const connected = wallet ?? (await connectWallet())

      const tx = await connected.execute(
        [
          {
            contractAddress,
            entrypoint,
            calldata,
          },
        ],
        { feeMode: 'sponsored' },
      )

      await tx.wait()
      return { transaction_hash: tx.hash }
    },
    [wallet, connectWallet],
  )

  return (
    <StarkzapContext.Provider
      value={{
        connectWallet: async () => {
          await connectWallet()
        },
        executeGasless,
        walletAddress: wallet?.address ?? null,
        isConnected: Boolean(wallet?.address),
        isConnecting,
      }}
    >
      {children}
    </StarkzapContext.Provider>
  )
}

export function useStarkzap() {
  const ctx = useContext(StarkzapContext)
  if (!ctx) throw new Error('useStarkzap must be used inside StarkzapProvider')
  return ctx
}
