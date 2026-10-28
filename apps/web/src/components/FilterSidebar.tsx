import { useState } from "react";
import {
  Button,
  Checkbox,
  Disclosure,
  DisclosureGroup,
  Input,
  Label,
  Radio,
  RadioGroup,
  SearchField,
  Typography,
} from "@heroui/react";
import { ArrowRightIcon, ChevronDownIcon, ChevronLeftIcon, StarRow } from "./Icons";
import { CATEGORY_LABELS, PRICE_RANGE_DEFS } from "../lib/listings";

const REGIONS = [
  { name: "Asia", price: "Delivery $2.99" },
  { name: "Africa", price: "Delivery $4.99" },
  { name: "Americas", price: "Delivery $1.99" },
  { name: "Australia/Oceania", price: "Delivery $3.99" },
  { name: "Europe", price: "Delivery $1.49" },
  { name: "Antarctica", price: "Delivery $12.99" },
];

const COLORS = [
  { name: "Black", hex: "#17251a" },
  { name: "Blue", hex: "#2563eb" },
  { name: "Pink", hex: "#ec4899" },
  { name: "Teal", hex: "#0d9488" },
  { name: "Purple", hex: "#7c3aed" },
  { name: "Yellow", hex: "#eab308" },
  { name: "Green", hex: "#16a34a" },
];

const RATINGS = [
  { stars: 5, count: "(475)" },
  { stars: 4, count: "(12)" },
  { stars: 3, count: "(20)" },
  { stars: 2, count: "(11)" },
  { stars: 1, count: "(6)" },
];

const WEIGHTS = ["Under 1 kg", "1 kg to 5 kg", "5 kg to 10 kg", "10 kg to 20 kg", "Over 20 kg"];

export interface SidebarFilters {
  categories: Set<string>;
  priceRanges: Set<string>;
  priceFrom: string;
  priceTo: string;
}

interface FilterSidebarProps {
  filters: SidebarFilters;
  onChange: (next: SidebarFilters) => void;
}

function Group({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Disclosure id={id}>
      <Disclosure.Heading>
        <Button slot="trigger" variant="ghost" className="w-full justify-between px-0">
          <span className="text-base font-medium text-[var(--muted)]">{label}</span>
          <Disclosure.Indicator>
            <ChevronDownIcon />
          </Disclosure.Indicator>
        </Button>
      </Disclosure.Heading>
      <Disclosure.Content>
        <Disclosure.Body className="flex flex-col gap-4 pt-4">{children}</Disclosure.Body>
      </Disclosure.Content>
    </Disclosure>
  );
}

export default function FilterSidebar({ filters, onChange }: FilterSidebarProps) {
  const [categoryQuery, setCategoryQuery] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(
    () => new Set(["categories", "rating"]),
  );

  const categories = Object.entries(CATEGORY_LABELS);
  const visible = categories.filter(([, label]) =>
    label.toLowerCase().includes(categoryQuery.trim().toLowerCase()),
  );
  const shown = categoryQuery || showAll ? visible : visible.slice(0, 3);

  const toggleCategory = (key: string) => {
    const next = new Set(filters.categories);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    onChange({ ...filters, categories: next });
  };

  const toggleRange = (key: string) => {
    const next = new Set(filters.priceRanges);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    onChange({ ...filters, priceRanges: next });
  };

  return (
    <DisclosureGroup
      className="flex flex-col gap-5"
      allowsMultipleExpanded
      expandedKeys={expandedKeys}
      onExpandedChange={(keys) => setExpandedKeys(new Set(keys as Set<string>))}
    >
      <Group id="categories" label="Categories">
        <SearchField
          aria-label="Search for categories"
          value={categoryQuery}
          onChange={setCategoryQuery}
        >
          <SearchField.Group>
            <SearchField.SearchIcon />
            <SearchField.Input placeholder="Search for categories" />
            <SearchField.ClearButton />
          </SearchField.Group>
        </SearchField>

        <div className="flex flex-col gap-3">
          {shown.map(([key, label]) => (
            <Checkbox
              key={key}
              isSelected={filters.categories.has(key)}
              onChange={() => toggleCategory(key)}
            >
              <Checkbox.Content>
                <Checkbox.Control>
                  <Checkbox.Indicator />
                </Checkbox.Control>
                <span className="text-sm font-medium text-[var(--foreground)]">{label}</span>
              </Checkbox.Content>
            </Checkbox>
          ))}
        </div>

        {!categoryQuery && (
          <button
            type="button"
            className="inline-flex items-center gap-1 text-sm font-medium text-[var(--link)] hover:underline"
            onClick={() => setShowAll((v) => !v)}
          >
            {showAll ? "Show less" : "See more"}
            <ArrowRightIcon />
          </button>
        )}
      </Group>

      <Group id="rating" label="Rating">
        <div className="flex flex-col gap-3">
          {RATINGS.map((r) => (
            <Checkbox key={r.stars} defaultSelected={false}>
              <Checkbox.Content>
                <Checkbox.Control>
                  <Checkbox.Indicator />
                </Checkbox.Control>
                <StarRow filled={r.stars} />
                <span className="text-sm text-[var(--muted)]">{r.count}</span>
                <span className="sr-only">{r.stars} stars</span>
              </Checkbox.Content>
            </Checkbox>
          ))}
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-1 text-sm font-medium text-[var(--link)] hover:underline"
        >
          View all
          <ArrowRightIcon />
        </button>
      </Group>

      <Group id="price" label="Price">
        <button
          type="button"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--link)] hover:underline"
          onClick={() =>
            onChange({ ...filters, priceRanges: new Set(), priceFrom: "", priceTo: "" })
          }
        >
          <ChevronLeftIcon />
          Any Price
        </button>

        <div className="flex flex-col gap-3">
          {Object.keys(PRICE_RANGE_DEFS).map((key) => (
            <Checkbox
              key={key}
              isSelected={filters.priceRanges.has(key)}
              onChange={() => toggleRange(key)}
            >
              <Checkbox.Content>
                <Checkbox.Control>
                  <Checkbox.Indicator />
                </Checkbox.Control>
                <span className="text-sm font-medium text-[var(--foreground)]">
                  {key === "under-10"
                    ? "Under $10"
                    : key === "over-100"
                      ? "Over $100"
                      : `$${key.split("-")[0]} to $${key.split("-")[1]}`}
                </span>
              </Checkbox.Content>
            </Checkbox>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <Label className="text-sm text-[var(--muted)]">From</Label>
            <Input
              variant="secondary"
              placeholder="$0"
              value={filters.priceFrom}
              onChange={(v) => onChange({ ...filters, priceFrom: v })}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-sm text-[var(--muted)]">To</Label>
            <Input
              variant="secondary"
              placeholder="Any"
              value={filters.priceTo}
              onChange={(v) => onChange({ ...filters, priceTo: v })}
            />
          </div>
        </div>
      </Group>

      <Group id="shipping" label="Shipping to">
        <RadioGroup aria-label="Shipping to" defaultValue="Asia">
          <div className="flex flex-col gap-3">
            {REGIONS.map((r) => (
              <Radio key={r.name} value={r.name} className="region-card rounded-[var(--radius)] border p-4">
                <Radio.Content>
                  <Radio.Control>
                    <Radio.Indicator />
                  </Radio.Control>
                  <span className="flex flex-col gap-0.5">
                    <span className="region-name text-sm font-medium text-[var(--foreground)]">
                      {r.name}
                    </span>
                    <span className="region-price text-sm text-[var(--muted)]">{r.price}</span>
                  </span>
                </Radio.Content>
              </Radio>
            ))}
          </div>
        </RadioGroup>
      </Group>

      <Group id="color" label="Color">
        <RadioGroup aria-label="Color" orientation="horizontal" className="flex flex-wrap gap-2">
          {COLORS.map((c) => (
            <Radio key={c.name} value={c.name} aria-label={c.name}>
              <Radio.Content>
                <Radio.Control>
                  <Radio.Indicator />
                </Radio.Control>
                <span className="swatch-dot" style={{ ["--swatch" as string]: c.hex }} />
                <span className="sr-only">{c.name}</span>
              </Radio.Content>
            </Radio>
          ))}
        </RadioGroup>
      </Group>

      <Group id="delivery" label="Delivery Method">
        <RadioGroup aria-label="Delivery Method" defaultValue="Flowbox">
          {["Flowbox", "Pick up from the store", "Fast courier"].map((m) => (
            <Radio key={m} value={m}>
              <Radio.Content>
                <Radio.Control>
                  <Radio.Indicator />
                </Radio.Control>
                <span className="text-sm font-medium text-[var(--foreground)]">{m}</span>
              </Radio.Content>
            </Radio>
          ))}
        </RadioGroup>
      </Group>

      <Group id="condition" label="Condition">
        <RadioGroup aria-label="Condition" defaultValue="New Product">
          {["New Product", "Used Product", "Resealed"].map((c) => (
            <Radio key={c} value={c}>
              <Radio.Content>
                <Radio.Control>
                  <Radio.Indicator />
                </Radio.Control>
                <span className="text-sm font-medium text-[var(--foreground)]">{c}</span>
              </Radio.Content>
            </Radio>
          ))}
        </RadioGroup>
      </Group>

      <Group id="weight" label="Weight">
        <div className="flex flex-col gap-3">
          {WEIGHTS.map((w) => (
            <Checkbox key={w} defaultSelected={false}>
              <Checkbox.Content>
                <Checkbox.Control>
                  <Checkbox.Indicator />
                </Checkbox.Control>
                <span className="text-sm font-medium text-[var(--foreground)]">{w}</span>
              </Checkbox.Content>
            </Checkbox>
          ))}
        </div>
      </Group>
    </DisclosureGroup>
  );
}
