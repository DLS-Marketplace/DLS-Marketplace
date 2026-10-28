import { useState } from "react";
import { Button, Card, Label, ListBox, Select, Tooltip, Typography } from "@heroui/react";
import { CartIcon, HeartIcon, HelpIcon, TruckIcon } from "./Icons";
import {
  COLOR_OPTIONS,
  VARIANT_OPTIONS,
  deliveryWindow,
  formatPrice,
  type Listing,
} from "../lib/listings";

interface ProductCardProps {
  listing: Listing;
  index: number;
  isFavorite: boolean;
  isOwner: boolean;
  onToggleFavorite: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function ProductCard({
  listing,
  index,
  isFavorite,
  isOwner,
  onToggleFavorite,
  onDelete,
}: ProductCardProps) {
  const [added, setAdded] = useState(false);
  const variant = VARIANT_OPTIONS[listing.category] || VARIANT_OPTIONS.other;

  return (
    <Card>
      <Card.Content className="p-0">
        <div className="relative h-64 p-6">
          <a href="#" className="block size-full" onClick={(e) => e.preventDefault()}>
            {listing.images[0] ? (
              <img
                src={listing.images[0]}
                alt={listing.title}
                loading="lazy"
                className="size-full rounded-lg object-cover"
              />
            ) : (
              <div className="grid size-full place-items-center rounded-lg bg-[var(--field-background)] text-sm text-[var(--muted)]">
                No photo
              </div>
            )}
          </a>

          {isOwner && (
            <Button
              variant="danger"
              isIconOnly
              size="sm"
              className="absolute left-4 top-4"
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
              className="absolute right-4 top-4"
              aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
              aria-pressed={isFavorite}
              onPress={() => onToggleFavorite(listing.id)}
            >
              <HeartIcon className="size-6" filled={isFavorite} />
            </Button>
            <Tooltip.Content>{isFavorite ? "Saved to favorites" : "Add to favorites"}</Tooltip.Content>
          </Tooltip>
        </div>

        <div className="flex flex-col gap-6 p-6">
          <div className="flex items-start justify-between gap-4">
            <a
              href="#"
              className="text-lg font-semibold text-[var(--foreground)] hover:underline"
              onClick={(e) => e.preventDefault()}
            >
              {listing.title}
            </a>
            <Typography weight="bold" className="whitespace-nowrap text-2xl">
              {formatPrice(listing.priceCents)}
            </Typography>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="mb-1.5 flex items-center gap-1 text-sm font-medium text-[var(--foreground)]">
                {variant.label}
                <Tooltip delay={0}>
                  <button
                    type="button"
                    aria-label={`About ${variant.label.toLowerCase()}`}
                    className="text-[var(--muted)] hover:text-[var(--foreground)]"
                  >
                    <HelpIcon />
                  </button>
                  <Tooltip.Content>Pick the {variant.label.toLowerCase()} you want</Tooltip.Content>
                </Tooltip>
              </div>
              <Select
                variant="secondary"
                fullWidth
                aria-label={variant.label}
                placeholder={variant.options[0]}
                defaultSelectedKey={variant.options[0]}
              >
                <Select.Trigger>
                  <Select.Value />
                  <Select.Indicator />
                </Select.Trigger>
                <Select.Popover>
                  <ListBox>
                    {variant.options.map((o) => (
                      <ListBox.Item key={o} id={o} textValue={o}>
                        {o}
                        <ListBox.ItemIndicator />
                      </ListBox.Item>
                    ))}
                  </ListBox>
                </Select.Popover>
              </Select>
            </div>

            <div>
              <Label className="mb-1.5 block text-sm font-medium text-[var(--foreground)]">
                Color
              </Label>
              <Select
                variant="secondary"
                fullWidth
                aria-label="Color"
                placeholder={COLOR_OPTIONS[0]}
                defaultSelectedKey={COLOR_OPTIONS[0]}
              >
                <Select.Trigger>
                  <Select.Value />
                  <Select.Indicator />
                </Select.Trigger>
                <Select.Popover>
                  <ListBox>
                    {COLOR_OPTIONS.map((o) => (
                      <ListBox.Item key={o} id={o} textValue={o}>
                        {o}
                        <ListBox.ItemIndicator />
                      </ListBox.Item>
                    ))}
                  </ListBox>
                </Select.Popover>
              </Select>
            </div>
          </div>

          <Button
            fullWidth
            className="h-auto gap-2 px-5 py-2.5 text-sm font-medium"
            onPress={() => {
              setAdded(true);
              setTimeout(() => setAdded(false), 1200);
            }}
            isDisabled={added}
          >
            <CartIcon />
            {added ? "Added to cart" : "Add to cart"}
          </Button>

          <div className="flex items-center gap-2 text-sm text-[var(--muted)]">
            <TruckIcon />
            <span>
              Estimated Delivery{" "}
              <span className="font-medium text-[var(--foreground)]">
                {deliveryWindow(index)}
              </span>
            </span>
          </div>
        </div>
      </Card.Content>
    </Card>
  );
}
