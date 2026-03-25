export type CustomerType = 'permanent' | 'ordinary';

export type Customer = {
    id: number;
    name: string;
    phone: string;
    whatsapp?: string | null;
    type: CustomerType;
    city?: string | null;
    address?: string | null;
    id_number?: string | null;
    pasa_balance: number;
    gold_balance: number;
    usd_balance: number;
    afn_balance: number;
    notes?: string | null;
    created_at: string;
};

export type Transaction = {
    id: number;
    type: 'buy' | 'sell' | 'trust_deposit' | 'trust_withdraw' | 'transfer';
    type_label: string;
    weight_tola: number;
    ayar: number;
    amount_usd?: number | null;
    amount_afn?: number | null;
    notes?: string | null;
    created_at: string;
};
