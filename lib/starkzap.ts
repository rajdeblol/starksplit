import { StarkZap } from 'starkzap'

let sdk: StarkZap | null = null

export function getStarkzapSDK() {
  if (!sdk) {
    sdk = new StarkZap({ network: 'mainnet' })
  }
  return sdk
}
