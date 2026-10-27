/**
 * Selling cycle for one of your listings:
 * listed → paid (buyer paid Gambit, funds held) → delivered → released (funds added to your balance)
 */
export type SaleStage = 'paid' | 'delivered' | 'released';
export type ListingStage = 'listed' | SaleStage;

/** The bits of a listing that sales and purchases keep a copy of. */
export type ProductSnapshot = {
  id: string;
  title: string;
  priceCents: number;
};

export type Sale = {
  id: string;
  product: ProductSnapshot;
  buyer: string;
  amountCents: number;
  feeCents: number;
  stage: SaleStage;
  createdAt: number;
};

export type Purchase = {
  id: string;
  product: ProductSnapshot;
  amountCents: number;
  createdAt: number;
};

export type PayoutMethod = 'cashapp' | 'paypal' | 'venmo' | 'zelle';

export type Payout = {
  id: string;
  method: PayoutMethod;
  handle: string;
  amountCents: number;
  status: 'requested' | 'sent';
  createdAt: number;
};
