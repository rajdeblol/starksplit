use starknet::ContractAddress;

#[starknet::interface]
trait ISplitBill<TContractState> {
    fn record_payment(ref self: TContractState, bill_id: felt252, amount: u256);
    fn has_paid(self: @TContractState, bill_id: felt252, addr: ContractAddress) -> bool;
    fn get_payment_amount(self: @TContractState, bill_id: felt252, addr: ContractAddress) -> u256;
}

#[starknet::contract]
mod SplitBill {
    use starknet::ContractAddress;
    use starknet::get_caller_address;
    use starknet::storage::{Map, StorageMapReadAccess, StorageMapWriteAccess};

    #[storage]
    struct Storage {
        payments: Map<(felt252, ContractAddress), bool>,
        payment_amounts: Map<(felt252, ContractAddress), u256>,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        PaymentRecorded: PaymentRecorded,
    }

    #[derive(Drop, starknet::Event)]
    struct PaymentRecorded {
        #[key]
        bill_id: felt252,
        payer: ContractAddress,
        amount: u256,
    }

    #[abi(embed_v0)]
    impl SplitBillImpl of super::ISplitBill<ContractState> {
        fn record_payment(ref self: ContractState, bill_id: felt252, amount: u256) {
            let payer = get_caller_address();
            assert(!self.payments.read((bill_id, payer)), 'Already paid');
            self.payments.write((bill_id, payer), true);
            self.payment_amounts.write((bill_id, payer), amount);
            self.emit(PaymentRecorded { bill_id, payer, amount });
        }

        fn has_paid(self: @ContractState, bill_id: felt252, addr: ContractAddress) -> bool {
            self.payments.read((bill_id, addr))
        }

        fn get_payment_amount(self: @ContractState, bill_id: felt252, addr: ContractAddress) -> u256 {
            self.payment_amounts.read((bill_id, addr))
        }
    }
}
