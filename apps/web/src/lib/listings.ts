export const LISTINGS_LIMIT = 200;
export const PAGE_SIZE = 6;

export const CATEGORY_LABELS: Record<string, string> = {
  food: "Food",
  assignments: "Assignments",
  clothes: "Clothes",
  jobs: "Jobs",
  other: "Other",
};

export type SortKey = "featured" | "cheapest" | "expensive" | "newest" | "az";

export const SORT_OPTIONS: { id: SortKey; label: string }[] = [
  { id: "featured", label: "Featured" },
  { id: "cheapest", label: "Price: Low to High" },
  { id: "expensive", label: "Price: High to Low" },
  { id: "newest", label: "Newest" },
  { id: "az", label: "Name A–Z" },
];

export const PRICE_RANGE_DEFS: Record<string, [number, number]> = {
  "under-10": [0, 1000],
  "10-20": [1000, 2000],
  "20-50": [2000, 5000],
  "50-100": [5000, 10000],
  "over-100": [10000, Infinity],
};

export const VARIANT_OPTIONS: Record<string, { label: string; options: string[] }> = {
  food: { label: "Portion", options: ["Small", "Regular", "Large"] },
  assignments: { label: "Length", options: ["1 page", "3 pages", "5 pages"] },
  clothes: { label: "Size", options: ["S", "M", "L", "XL"] },
  jobs: { label: "Duration", options: ["30 min", "1 hour", "2 hours"] },
  other: { label: "Option", options: ["Standard", "Custom"] },
};

export const COLOR_OPTIONS = ["Black", "White", "Green", "Silver"];

export interface Listing {
  id: string;
  title: string;
  description: string;
  category: string;
  priceCents: number;
  images: string[];
  createdAt: number;
  seller: { id: string; name: string };
}

export interface Filters {
  categories: Set<string>;
  priceRanges: Set<string>;
  priceFromCents: number | null;
  priceToCents: number | null;
  brand: string;
  sort: SortKey;
}

export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(cents % 100 ? 2 : 0)}`;
}

export function parsePrice(text: string): number | null {
  const raw = String(text).replace(/[^0-9.]/g, "");
  if (raw === "") return null;
  const n = Number(raw);
  return Number.isFinite(n) && n >= 0 ? Math.round(n * 100) : null;
}

export function deliveryWindow(index: number): string {
  const fmt = (d: Date) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const start = new Date();
  start.setDate(start.getDate() + 4 + (index % 3));
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  return `${fmt(start)} - ${fmt(end)}`;
}

export function filterListings(listings: Listing[], f: Filters): Listing[] {
  let items = listings;
  if (f.categories.size > 0) {
    items = items.filter((l) => f.categories.has(l.category));
  }
  if (f.priceRanges.size > 0) {
    items = items.filter((l) =>
      [...f.priceRanges].some((key) => {
        const [min, max] = PRICE_RANGE_DEFS[key] || [0, Infinity];
        return l.priceCents >= min && l.priceCents < max;
      }),
    );
  }
  if (f.priceFromCents != null) items = items.filter((l) => l.priceCents >= f.priceFromCents);
  if (f.priceToCents != null) items = items.filter((l) => l.priceCents <= f.priceToCents);
  if (f.brand) items = items.filter((l) => l.seller.name === f.brand);
  return sortListings(items, f.sort);
}

export function sortListings(items: Listing[], sort: SortKey): Listing[] {
  const sorted = [...items];
  switch (sort) {
    case "cheapest":
      sorted.sort((a, b) => a.priceCents - b.priceCents);
      break;
    case "expensive":
      sorted.sort((a, b) => b.priceCents - a.priceCents);
      break;
    case "newest":
      sorted.sort((a, b) => b.createdAt - a.createdAt);
      break;
    case "az":
      sorted.sort((a, b) => a.title.localeCompare(b.title));
      break;
    default:
      break; // featured = server order (newest first)
  }
  return sorted;
}

/** Page numbers with ellipses: 1 … 4 5 6 … 20 */
export function pageItems(current: number, total: number): (number | "…")[] {
  const nums = new Set([1, total, current, current - 1, current + 1]);
  const visible = [...nums].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b);
  const out: (number | "…")[] = [];
  let prev = 0;
  for (const n of visible) {
    if (n - prev > 1) out.push("…");
    out.push(n);
    prev = n;
  }
  return out;
}
