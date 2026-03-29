export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!

export const SPLIT_BILL_ABI = [
  {
    name: 'record_payment',
    type: 'function',
    inputs: [
      { name: 'bill_id', type: 'felt252' },
      { name: 'amount', type: 'u256' },
    ],
    outputs: [],
    state_mutability: 'external',
  },
  {
    name: 'has_paid',
    type: 'function',
    inputs: [
      { name: 'bill_id', type: 'felt252' },
      { name: 'addr', type: 'ContractAddress' },
    ],
    outputs: [{ name: 'result', type: 'bool' }],
    state_mutability: 'view',
  },
  {
    name: 'get_payment_amount',
    type: 'function',
    inputs: [
      { name: 'bill_id', type: 'felt252' },
      { name: 'addr', type: 'ContractAddress' },
    ],
    outputs: [{ name: 'result', type: 'u256' }],
    state_mutability: 'view',
  },
]
 
export const TOKEN_ADDRESSES: Record<string, string> = {
  STRK: '0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d',
  USDC: '0x053c912536960ca864a95694458df50d6e3cdaec0c051a09096131c11e941113',
}
