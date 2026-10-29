import { useState } from "react";
import { Button, Typography } from "@heroui/react";
import { CartIcon, ChevronLeftIcon, ChevronRightIcon, TruckIcon } from "./Icons";
import {
  CATEGORY_LABELS,
  SIZES,
  deliveryWindow,
  formatPrice,
  productColors,
  type Listing,
} from "../lib/listings";

interface ProductDetailProps {
  listing: Listing;
  index: number;
  onBack: () => void;
}

/** Saleor-style product page: photo gallery, then one card per color with its own size picker. */
export default function ProductDetail({ listing, index, onBack }: ProductDetailProps) {
  const images = listing.images.length > 0 ? listing.images : [""];
  const [imageIndex, setImageIndex] = useState(0);
  const colors = productColors(listing);
  const [sizes, setSizes] = useState<Record<string, string>>({});
  const [added, setAdded] = useState<string | null>(null);

  const prev = () => setImageIndex((i) => (i - 1 + images.length) % images.length);
  const next = () => setImageIndex((i) => (i + 1) % images.length);

  const addToCart = (color: string) => {
    setAdded(color);
    setTimeout(() => setAdded(null), 1200);
  };

  return (
    <div className="flex flex-col gap-12">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-start">
        {/* Gallery */}
        <div className="flex flex-col gap-4">
          <div className="relative aspect-square overflow-hidden rounded-[var(--radius)] bg-[var(--field-background)]">
            {images[imageIndex] ? (
              <img src={images[imageIndex]} alt={listing.title} className="size-full object-cover" />
            ) : (
              <div className="grid size-full place-items-center text-sm text-[var(--muted)]">
                No photo
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              isIconOnly
              size="sm"
              aria-label="Previous photo"
              onPress={prev}
            >
              <ChevronLeftIcon />
            </Button>
            <Button variant="outline" isIconOnly size="sm" aria-label="Next photo" onPress={next}>
              <ChevronRightIcon />
            </Button>
            <span className="text-sm text-[var(--muted)]">
              {imageIndex + 1} / {images.length}
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <Typography color="muted" className="text-sm">
              {CATEGORY_LABELS[listing.category] ?? listing.category}
            </Typography>
            <Typography type="h1" weight="bold" className="text-4xl md:text-5xl">
              {listing.title}
            </Typography>
            <Typography weight="bold" className="text-3xl">
              {formatPrice(listing.priceCents)}
            </Typography>
          </div>

          {listing.description && (
            <Typography color="muted" className="max-w-xl leading-relaxed">
              {listing.description}
            </Typography>
          )}

          <div className="flex items-center gap-2 text-sm text-[var(--muted)]">
            <TruckIcon />
            <span>
              Estimated Delivery{" "}
              <span className="font-medium text-[var(--foreground)]">
                {deliveryWindow(index)}
              </span>
            </span>
          </div>

          {/* One card per color, each with its own size picker */}
          <div className="flex flex-col gap-4">
            <Typography weight="semibold" className="text-lg">
              Choose your color
            </Typography>

            {colors.map((color, i) => {
              const size = sizes[color.name] ?? SIZES[1];
              return (
                <div
                  key={color.name}
                  className="flex flex-col gap-4 rounded-[var(--radius)] border bg-[var(--surface)] p-4 sm:flex-row sm:items-center"
                >
                  <div className="flex flex-1 items-center gap-4">
                    <div className="size-20 shrink-0 overflow-hidden rounded-lg bg-[var(--field-background)]">
                      {images[i % images.length] ? (
                        <img
                          src={images[i % images.length]}
                          alt={`${listing.title} in ${color.name}`}
                          className="size-full object-cover"
                        />
                      ) : (
                        <div
                          className="size-full"
                          style={{ backgroundColor: color.hex }}
                        />
                      )}
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="flex items-center gap-2 font-semibold">
                        <span
                          className="inline-block size-4 rounded-full border"
                          style={{ backgroundColor: color.hex }}
                        />
                        {color.name}
                      </span>
                      <span className="text-sm text-[var(--muted)]">
                        {formatPrice(listing.priceCents)}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <span className="text-sm font-medium text-[var(--muted)]">Size</span>
                    <div className="flex gap-2">
                      {SIZES.map((s) => (
                        <button
                          key={s}
                          type="button"
                          aria-pressed={size === s}
                          onClick={() =>
                            setSizes((prev) => ({ ...prev, [color.name]: s }))
                          }
                          className={`h-10 w-12 rounded-lg border text-sm font-medium transition-colors ${
                            size === s
                              ? "border-transparent bg-[var(--accent)] text-[var(--accent-foreground)]"
                              : "border-[var(--field-border)] text-[var(--foreground)] hover:border-[var(--foreground)]"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  <Button
                    className="sm:w-auto"
                    isDisabled={added === color.name}
                    onPress={() => addToCart(color.name)}
                  >
                    <CartIcon />
                    {added === color.name ? "Added to cart" : "Add to cart"}
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <button
        type="button"
        className="inline-flex items-center gap-1 self-start text-sm font-medium text-[var(--link)] hover:underline"
        onClick={onBack}
      >
        <ChevronLeftIcon />
        Back to products
      </button>
    </div>
  );
}
