import { Button, Tooltip, Typography } from "@heroui/react";
import { HeartIcon, TruckIcon } from "./Icons";
import { deliveryWindow, formatPrice, type Listing } from "../lib/listings";

interface ProductCardProps {
  listing: Listing;
  index: number;
  isFavorite: boolean;
  isOwner: boolean;
  onOpen: (productId: string) => void;
  onToggleFavorite: (id: string) => void;
  onDelete: (id: string) => void;
}

/** A product inside a business page. Clicking it opens the color/size detail. */
export default function ProductCard({
  listing,
  index,
  isFavorite,
  isOwner,
  onOpen,
  onToggleFavorite,
  onDelete,
}: ProductCardProps) {
  return (
    <div className="group flex flex-col gap-4">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius)] bg-[var(--field-background)]">
        <button
          type="button"
          className="block size-full"
          onClick={() => onOpen(listing.id)}
          aria-label={`Open ${listing.title}`}
        >
          {listing.images[0] ? (
            <img
              src={listing.images[0]}
              alt={listing.title}
              loading="lazy"
              className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="grid size-full place-items-center text-sm text-[var(--muted)]">
              No photo
            </div>
          )}
        </button>

        {isOwner && (
          <Button
            variant="danger"
            isIconOnly
            size="sm"
            className="absolute left-3 top-3"
            aria-label={`Delete ${listing.title}`}
            onPress={() => onDelete(listing.id)}
          >
            &times;
          </Button>
        )}

        <Tooltip delay={0}>
          <Button
            variant="ghost"
            isIconOnly
            size="sm"
            className="absolute right-3 top-3"
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            aria-pressed={isFavorite}
            onPress={() => onToggleFavorite(listing.id)}
          >
            <HeartIcon className="size-6" filled={isFavorite} />
          </Button>
          <Tooltip.Content>{isFavorite ? "Saved to favorites" : "Add to favorites"}</Tooltip.Content>
        </Tooltip>
      </div>

      <div className="flex flex-col gap-1">
        <button
          type="button"
          className="text-left text-lg font-semibold text-[var(--foreground)] hover:underline"
          onClick={() => onOpen(listing.id)}
        >
          {listing.title}
        </button>
        <Typography weight="bold" className="text-xl">
          {formatPrice(listing.priceCents)}
        </Typography>
        <div className="flex items-center gap-2 pt-1 text-sm text-[var(--muted)]">
          <TruckIcon />
          <span>
            Estimated Delivery{" "}
            <span className="font-medium text-[var(--foreground)]">{deliveryWindow(index)}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
