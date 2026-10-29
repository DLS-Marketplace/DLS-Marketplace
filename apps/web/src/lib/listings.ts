export const LISTINGS_LIMIT = 200;
export const PAGE_SIZE = 6;

export const CATEGORY_LABELS: Record<string, string> = {
  food: "Food",
  assignments: "Assignments",
  clothes: "Clothes",
  jobs: "Jobs",
  other: "Other",
};

/** Every product uses the same size list — no per-category "portion/length/size" variants. */
export const SIZES = ["S", "M", "L", "XL"] as const;

export interface ColorOption {
  name: string;
  hex: string;
}

export const COLOR_PALETTE: ColorOption[] = [
  { name: "Black", hex: "#17251a" },
  { name: "White", hex: "#f2f1ed" },
  { name: "Navy", hex: "#0d1f33" },
  { name: "Green", hex: "#16a34a" },
  { name: "Silver", hex: "#b9c2bd" },
  { name: "Sand", hex: "#d9c9a8" },
];

export type SortKey =
  | "featured"
  | "most_products"
  | "cheapest"
  | "expensive"
  | "newest"
  | "az";

export const BUSINESS_SORT_OPTIONS: { id: SortKey; label: string }[] = [
  { id: "featured", label: "Featured" },
  { id: "most_products", label: "Most products" },
  { id: "newest", label: "Newest" },
  { id: "az", label: "Name A–Z" },
];

export const PRODUCT_SORT_OPTIONS: { id: SortKey; label: string }[] = [
  { id: "featured", label: "Featured" },
  { id: "cheapest", label: "Price: Low to High" },
  { id: "expensive", label: "Price: High to Low" },
  { id: "newest", label: "Newest" },
  { id: "az", label: "Name A–Z" },
];

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

/** A seller, treated as the business whose products fill its store page. */
export interface Business {
  id: string;
  name: string;
  listings: Listing[];
  categories: string[];
  minPriceCents: number;
  coverImages: string[];
  createdAt: number;
}

export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(cents % 100 ? 2 : 0)}`;
}

export function deliveryWindow(index: number): string {
  const fmt = (d: Date) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const start = new Date();
  start.setDate(start.getDate() + 4 + (index % 3));
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  return `${fmt(start)} - ${fmt(end)}`;
}

/** Groups listings by seller into businesses, keeping the seller's most recent order. */
export function groupBusinesses(listings: Listing[]): Business[] {
  const bySeller = new Map<string, Business>();
  for (const listing of listings) {
    const key = listing.seller.id;
    let business = bySeller.get(key);
    if (!business) {
      business = {
        id: key,
        name: listing.seller.name,
        listings: [],
        categories: [],
        minPriceCents: Infinity,
        coverImages: [],
        createdAt: listing.createdAt,
      };
      bySeller.set(key, business);
    }
    business.listings.push(listing);
    business.minPriceCents = Math.min(business.minPriceCents, listing.priceCents);
    business.createdAt = Math.max(business.createdAt, listing.createdAt);
    if (!business.categories.includes(listing.category)) business.categories.push(listing.category);
    for (const image of listing.images) {
      if (business.coverImages.length < 3 && !business.coverImages.includes(image)) {
        business.coverImages.push(image);
      }
    }
  }
  for (const business of bySeller.values()) {
    if (!Number.isFinite(business.minPriceCents)) business.minPriceCents = 0;
  }
  return [...bySeller.values()];
}

export function sortBusinesses(items: Business[], sort: SortKey): Business[] {
  const sorted = [...items];
  switch (sort) {
    case "most_products":
      sorted.sort((a, b) => b.listings.length - a.listings.length);
      break;
    case "newest":
      sorted.sort((a, b) => b.createdAt - a.createdAt);
      break;
    case "az":
      sorted.sort((a, b) => a.name.localeCompare(b.name));
      break;
    default:
      break; // featured = server order
  }
  return sorted;
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
      break;
  }
  return sorted;
}

/** Stable color options for a product, so every visit shows the same choices. */
export function productColors(listing: Listing): ColorOption[] {
  const count = 3;
  const hash = [...listing.id].reduce((acc, ch) => (acc * 31 + ch.charCodeAt(0)) >>> 0, 7);
  const picks: ColorOption[] = [];
  for (let i = 0; picks.length < count; i++) {
    const color = COLOR_PALETTE[(hash + i * 5) % COLOR_PALETTE.length];
    if (!picks.some((p) => p.name === color.name)) picks.push(color);
  }
  return picks;
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
