export type TransactionType = 'buy' | 'sell' | 'trust_deposit' | 'trust_withdraw' | 'transfer';
export type TransactionStatus = 'completed' | 'pending' | 'cancelled';
export type PartyType = 'customer' | 'supplier' | 'shop';
export type PaymentMethod = 'cash' | 'transfer';

export type TransactionParty = {
    id: number;
    name: string;
    type: PartyType;
};

export type FullTransaction = {
    id: number;
    type: TransactionType;
    from_party: TransactionParty;
    to_party: TransactionParty;
    weight_tola: number;
    ayar: number;
    amount_usd: number | null;
    amount_afn: number | null;
    rate_per_tola_usd: number | null;
    usd_to_afn_rate: number | null;
    payment_method: PaymentMethod | null;
    notes: string | null;
    status: TransactionStatus;
    created_at: string;
};

export type PartyOption = {
    id: number;
    name: string;
};
