export const formatAmount = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 4,
  }).format(value)
}

export const formatDate = (iso: string) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(iso))
}

export const shortenAddress = (address: string, chars = 6) => {
  if (!address) return ''
  return `${address.slice(0, chars)}...${address.slice(-4)}`
}

export const shortenTxHash = (hash: string) => shortenAddress(hash, 10)

export const toU256Parts = (value: bigint): [string, string] => {
  const shift = BigInt(128)
  const mask = (BigInt(1) << shift) - BigInt(1)
  const low = (value & mask).toString()
  const high = (value >> shift).toString()
  return [low, high]
}

export const toBaseUnits = (amount: number | string, currency: string) => {
  const decimals = currency === 'USDC' ? 6 : 18
  const value = Number(amount)
  const normalized = value.toFixed(decimals)
  const [whole, fraction] = normalized.split('.')
  const padded = `${whole}${fraction ?? ''.padEnd(decimals, '0')}`
  return BigInt(padded)
}
