/**
 * Selling cycle for one of your listings:
 * listed → paid (buyer paid Loop, funds held) → delivered → released (funds added to your balance)
 */
export type SaleStage = 'paid' | 'delivered' | 'released';
export type ListingStage = 'listed' | SaleStage;

/** The bits of a listing that sales and purchases keep a copy of. Amounts are in Loopbux. */
export type ProductSnapshot = {
  id: string;
  title: string;
  priceCents: number;
};

export type Sale = {
  id: string;
  product: ProductSnapshot;
  buyer: string;
  amount: number;
  fee: number;
  stage: SaleStage;
  createdAt: number;
};

export type Purchase = {
  id: string;
  product: ProductSnapshot;
  amount: number;
  createdAt: number;
};

export type PayoutMethod = 'cashapp' | 'paypal' | 'venmo' | 'zelle';

export type Payout = {
  id: string;
  method: PayoutMethod;
  handle: string;
  amount: number;
  usdCents: number;
  status: 'requested' | 'sent';
  createdAt: number;
};

/** Loopbux bought with USD. */
export type TopUp = {
  id: string;
  amount: number;
  usdCents: number;
  createdAt: number;
};
