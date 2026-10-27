// Local, in-memory demo of the money flow (purchases, the selling cycle, payouts).
// Listings themselves come from Convex; billing isn't wired to a backend yet.
import { createContext, use, useReducer, type PropsWithChildren } from 'react';

import type { ListingStage, Payout, PayoutMethod, ProductSnapshot, Purchase, Sale } from './types';

export const PLATFORM_FEE_RATE = 0.05;

export const PAYOUT_METHODS: Record<
  PayoutMethod,
  { label: string; color: string; glyph: string; placeholder: string }
> = {
  cashapp: { label: 'Cash App', color: '#00C244', glyph: '$', placeholder: '$cashtag' },
  paypal: { label: 'PayPal', color: '#003087', glyph: 'P', placeholder: 'you@email.com' },
  venmo: { label: 'Venmo', color: '#008CFF', glyph: 'V', placeholder: '@username' },
  zelle: { label: 'Zelle', color: '#6D1ED4', glyph: 'Z', placeholder: 'Email or phone' },
};

export function formatMoney(cents: number) {
  return (cents / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

/** Like formatMoney, but drops ".00" for whole-dollar prices. */
export function formatPrice(cents: number) {
  return formatMoney(cents).replace(/\.00$/, '');
}

export function feeFor(amountCents: number) {
  return Math.round(amountCents * PLATFORM_FEE_RATE);
}

type State = {
  sales: Sale[];
  purchases: Purchase[];
  payouts: Payout[];
};

const initialState: State = { sales: [], purchases: [], payouts: [] };

type Action =
  | { type: 'buy'; product: ProductSnapshot }
  | { type: 'simulateSale'; product: ProductSnapshot }
  | { type: 'markDelivered'; saleId: string }
  | { type: 'confirmReceipt'; saleId: string }
  | { type: 'requestPayout'; method: PayoutMethod; handle: string; amountCents: number };

let idCounter = 0;
const newId = (prefix: string) => `${prefix}-${Date.now().toString(36)}-${idCounter++}`;

const DEMO_BUYERS = ['Jordan R.', 'Aaliyah M.', 'Chris V.', 'Sam K.', 'Nia W.'];

function snapshot({ id, title, priceCents }: ProductSnapshot): ProductSnapshot {
  return { id, title, priceCents };
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'buy': {
      if (isSold(state, action.product.id)) return state;
      return {
        ...state,
        purchases: [
          {
            id: newId('order'),
            product: snapshot(action.product),
            amountCents: action.product.priceCents,
            createdAt: Date.now(),
          },
          ...state.purchases,
        ],
      };
    }
    case 'simulateSale': {
      if (isSold(state, action.product.id)) return state;
      const amountCents = action.product.priceCents;
      return {
        ...state,
        sales: [
          {
            id: newId('sale'),
            product: snapshot(action.product),
            buyer: DEMO_BUYERS[state.sales.length % DEMO_BUYERS.length],
            amountCents,
            feeCents: feeFor(amountCents),
            stage: 'paid',
            createdAt: Date.now(),
          },
          ...state.sales,
        ],
      };
    }
    case 'markDelivered':
      return {
        ...state,
        sales: state.sales.map((s) =>
          s.id === action.saleId && s.stage === 'paid' ? { ...s, stage: 'delivered' } : s
        ),
      };
    case 'confirmReceipt':
      return {
        ...state,
        sales: state.sales.map((s) =>
          s.id === action.saleId && s.stage === 'delivered' ? { ...s, stage: 'released' } : s
        ),
      };
    case 'requestPayout': {
      if (action.amountCents <= 0 || action.amountCents > balancesOf(state).availableCents) return state;
      return {
        ...state,
        payouts: [
          {
            id: newId('payout'),
            method: action.method,
            handle: action.handle,
            amountCents: action.amountCents,
            status: 'requested',
            createdAt: Date.now(),
          },
          ...state.payouts,
        ],
      };
    }
  }
}

function isSold(state: State, productId: string) {
  return (
    state.sales.some((s) => s.product.id === productId) ||
    state.purchases.some((p) => p.product.id === productId)
  );
}

function balancesOf(state: State) {
  const net = (s: Sale) => s.amountCents - s.feeCents;
  const releasedCents = state.sales.filter((s) => s.stage === 'released').reduce((sum, s) => sum + net(s), 0);
  const pendingCents = state.sales.filter((s) => s.stage !== 'released').reduce((sum, s) => sum + net(s), 0);
  const paidOutCents = state.payouts.reduce((sum, p) => sum + p.amountCents, 0);
  return {
    availableCents: releasedCents - paidOutCents,
    pendingCents,
    paidOutCents,
  };
}

type MarketplaceContextValue = State & {
  dispatch: React.Dispatch<Action>;
  isSold: (productId: string) => boolean;
  balances: ReturnType<typeof balancesOf>;
  listingStage: (productId: string) => ListingStage;
  saleFor: (productId: string) => Sale | undefined;
};

const MarketplaceContext = createContext<MarketplaceContextValue | null>(null);

export function MarketplaceProvider({ children }: PropsWithChildren) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const saleFor = (productId: string) => state.sales.find((s) => s.product.id === productId);
  const value: MarketplaceContextValue = {
    ...state,
    dispatch,
    isSold: (productId) => isSold(state, productId),
    balances: balancesOf(state),
    saleFor,
    listingStage: (productId) => saleFor(productId)?.stage ?? 'listed',
  };

  return <MarketplaceContext value={value}>{children}</MarketplaceContext>;
}

export function useMarketplace() {
  const ctx = use(MarketplaceContext);
  if (!ctx) throw new Error('useMarketplace must be used inside <MarketplaceProvider>');
  return ctx;
}
