import { CATEGORY_LABELS, formatPrice, type Business } from "../lib/listings";

interface BusinessCardProps {
  business: Business;
  onOpen: (businessId: string) => void;
}

/** A store front: one card per business selling on Loop. */
export default function BusinessCard({ business, onOpen }: BusinessCardProps) {
  const cover = business.coverImages[0];

  return (
    <button
      type="button"
      className="group flex flex-col gap-4 text-left"
      onClick={() => onOpen(business.id)}
      aria-label={`Open ${business.name}`}
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius)] bg-[var(--field-background)]">
        {cover ? (
          <img
            src={cover}
            alt=""
            loading="lazy"
            className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="grid size-full place-items-center text-sm text-[var(--muted)]">
            No photo
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-lg font-semibold text-[var(--foreground)]">{business.name}</span>
        <span className="text-sm text-[var(--muted)]">
          {business.listings.length} {business.listings.length === 1 ? "product" : "products"}
          {" · "}
          {business.categories.map((key) => CATEGORY_LABELS[key] ?? key).join(", ")}
        </span>
        <span className="text-sm text-[var(--muted)]">
          From{" "}
          <span className="font-semibold text-[var(--foreground)]">
            {formatPrice(business.minPriceCents)}
          </span>
        </span>
      </div>
    </button>
  );
}
