// Local, in-memory demo of the money flow (Loopbux top-ups, purchases, the selling cycle, cash-outs).
// Listings themselves come from Convex; billing isn't wired to a backend yet.
import { LOOPBUX_PER_USD } from '@loop/shared';
import { createContext, use, useReducer, type PropsWithChildren } from 'react';

import type { ListingStage, Payout, PayoutMethod, ProductSnapshot, Purchase, Sale, TopUp } from './types';

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

/** Loopbux packs, in Loopbux. */
export const LOOPBUX_PACKS = [500, 1_000, 2_500, 5_000];

export function formatBux(amount: number) {
  return amount.toLocaleString('en-US');
}

export function formatUsd(cents: number) {
  return (cents / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

export function buxToUsdCents(amount: number) {
  return Math.round((amount * 100) / LOOPBUX_PER_USD);
}

export function feeFor(amount: number) {
  return Math.round(amount * PLATFORM_FEE_RATE);
}

type State = {
  topUps: TopUp[];
  sales: Sale[];
  purchases: Purchase[];
  payouts: Payout[];
};

const initialState: State = { topUps: [], sales: [], purchases: [], payouts: [] };

type Action =
  | { type: 'topUp'; amount: number }
  | { type: 'buy'; product: ProductSnapshot }
  | { type: 'simulateSale'; product: ProductSnapshot }
  | { type: 'markDelivered'; saleId: string }
  | { type: 'confirmReceipt'; saleId: string }
  | { type: 'requestPayout'; method: PayoutMethod; handle: string; amount: number };

let idCounter = 0;
const newId = (prefix: string) => `${prefix}-${Date.now().toString(36)}-${idCounter++}`;

const DEMO_BUYERS = ['Jordan R.', 'Aaliyah M.', 'Chris V.', 'Sam K.', 'Nia W.'];

function snapshot({ id, title, priceCents }: ProductSnapshot): ProductSnapshot {
  return { id, title, priceCents };
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'topUp': {
      if (action.amount <= 0) return state;
      return {
        ...state,
        topUps: [
          {
            id: newId('topup'),
            amount: action.amount,
            usdCents: buxToUsdCents(action.amount),
            createdAt: Date.now(),
          },
          ...state.topUps,
        ],
      };
    }
    case 'buy': {
      if (isSold(state, action.product.id)) return state;
      if (action.product.priceCents > balancesOf(state).available) return state;
      return {
        ...state,
        purchases: [
          {
            id: newId('order'),
            product: snapshot(action.product),
            amount: action.product.priceCents,
            createdAt: Date.now(),
          },
          ...state.purchases,
        ],
      };
    }
    case 'simulateSale': {
      if (isSold(state, action.product.id)) return state;
      const amount = action.product.priceCents;
      return {
        ...state,
        sales: [
          {
            id: newId('sale'),
            product: snapshot(action.product),
            buyer: DEMO_BUYERS[state.sales.length % DEMO_BUYERS.length],
            amount,
            fee: feeFor(amount),
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
      if (action.amount <= 0 || action.amount > balancesOf(state).available) return state;
      return {
        ...state,
        payouts: [
          {
            id: newId('payout'),
            method: action.method,
            handle: action.handle,
            amount: action.amount,
            usdCents: buxToUsdCents(action.amount),
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

const sum = (items: { amount: number }[]) => items.reduce((total, i) => total + i.amount, 0);

/** Wallet totals, in Loopbux. */
function balancesOf(state: State) {
  const net = (sales: Sale[]) => sales.reduce((total, s) => total + s.amount - s.fee, 0);
  const released = net(state.sales.filter((s) => s.stage === 'released'));
  const pending = net(state.sales.filter((s) => s.stage !== 'released'));
  const paidOut = sum(state.payouts);
  return {
    available: sum(state.topUps) + released - sum(state.purchases) - paidOut,
    pending,
    paidOut,
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
