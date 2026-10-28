import {
  Button,
  Checkbox,
  Drawer,
  Input,
  Label,
  ListBox,
  Radio,
  RadioGroup,
  Select,
  Slider,
  Typography,
} from "@heroui/react";
import { StarRow } from "./Icons";

const SELLERS = ["All brands", "Maria G.", "Ken T.", "Dorm Delivery Co.", "Campus Store"];

const WEIGHTS = ["Under 1 kg", "1 kg to 5 kg", "5 kg to 10 kg", "10 kg to 20 kg", "Over 20 kg"];

const COLORS = [
  { name: "Black", hex: "#17251a" },
  { name: "Blue", hex: "#2563eb" },
  { name: "Pink", hex: "#ec4899" },
  { name: "Teal", hex: "#0d9488" },
  { name: "Purple", hex: "#7c3aed" },
  { name: "Yellow", hex: "#eab308" },
  { name: "Green", hex: "#16a34a" },
];

const REGIONS = [
  { name: "USA", price: "Delivery $1.99" },
  { name: "Europe", price: "Delivery $1.49" },
  { name: "Asia", price: "Delivery $2.99" },
  { name: "Australia", price: "Delivery $3.99" },
];

interface FilterDrawerProps {
  state: { isOpen: boolean; open: () => void; close: () => void };
  onApply: () => void;
  onClear: () => void;
}

export default function FilterDrawer({ state, onApply, onClear }: FilterDrawerProps) {
  return (
    <Drawer state={state}>
      <Drawer.Backdrop>
        <Drawer.Content placement="left" className="w-full max-w-[384px]">
          <Drawer.Dialog>
            <Drawer.Header>
              <Drawer.Heading>
                <Typography color="muted" weight="semibold" className="text-base uppercase tracking-wide">
                  Filters mobile
                </Typography>
              </Drawer.Heading>
              <Drawer.CloseTrigger />
            </Drawer.Header>

            <Drawer.Body className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label className="text-sm text-[var(--muted)]">Product Brand</Label>
                <Select variant="secondary" fullWidth aria-label="Product Brand" defaultSelectedKey="All brands">
                  <Select.Trigger>
                    <Select.Value />
                    <Select.Indicator />
                  </Select.Trigger>
                  <Select.Popover>
                    <ListBox>
                      {SELLERS.map((s) => (
                        <ListBox.Item key={s} id={s} textValue={s}>
                          {s}
                          <ListBox.ItemIndicator />
                        </ListBox.Item>
                      ))}
                    </ListBox>
                  </Select.Popover>
                </Select>
              </div>

              <fieldset className="flex flex-col gap-3">
                <Label className="text-sm text-[var(--muted)]">Price Range</Label>
                <Slider
                  aria-label="Minimum price"
                  minValue={0}
                  maxValue={5000}
                  defaultValue={[0]}
                  className="w-full"
                >
                  <Slider.Track>
                    <Slider.Fill />
                    <Slider.Thumb index={0} />
                  </Slider.Track>
                </Slider>
                <Slider
                  aria-label="Maximum price"
                  minValue={0}
                  maxValue={5000}
                  defaultValue={[5000]}
                  className="w-full"
                >
                  <Slider.Track>
                    <Slider.Fill />
                    <Slider.Thumb index={0} />
                  </Slider.Track>
                </Slider>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-sm text-[var(--muted)]">From</Label>
                    <Input variant="secondary" type="number" placeholder="$0" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-sm text-[var(--muted)]">To</Label>
                    <Input variant="secondary" type="number" placeholder="Any" />
                  </div>
                </div>
              </fieldset>

              <div className="grid grid-cols-2 gap-4">
                <fieldset className="flex flex-col gap-3">
                  <Label className="text-sm text-[var(--muted)]">Delivery method</Label>
                  <RadioGroup aria-label="Delivery method" defaultValue="Flowbox">
                    {["Flowbox", "Pick up from the store", "Fast courier"].map((m) => (
                      <Radio key={m} value={m}>
                        <Radio.Content>
                          <Radio.Control>
                            <Radio.Indicator />
                          </Radio.Control>
                          <span className="text-sm">{m}</span>
                        </Radio.Content>
                      </Radio>
                    ))}
                  </RadioGroup>
                </fieldset>

                <fieldset className="flex flex-col gap-3">
                  <Label className="text-sm text-[var(--muted)]">Rating</Label>
                  <RadioGroup aria-label="Rating" defaultValue="5">
                    {[5, 4, 3].map((s) => (
                      <Radio key={s} value={String(s)}>
                        <Radio.Content>
                          <Radio.Control>
                            <Radio.Indicator />
                          </Radio.Control>
                          <StarRow filled={s} />
                          <span className="sr-only">{s} stars</span>
                        </Radio.Content>
                      </Radio>
                    ))}
                  </RadioGroup>
                </fieldset>
              </div>

              <fieldset className="flex flex-col gap-3">
                <Label className="text-sm text-[var(--muted)]">Condition</Label>
                <RadioGroup
                  aria-label="Condition"
                  orientation="horizontal"
                  className="segmented"
                  defaultValue="All"
                >
                  {["All", "New", "Used"].map((c) => (
                    <Radio key={c} value={c}>
                      <Radio.Content>
                        <Radio.Control>
                          <Radio.Indicator />
                        </Radio.Control>
                        <span className="text-sm">{c}</span>
                      </Radio.Content>
                    </Radio>
                  ))}
                </RadioGroup>
              </fieldset>

              <div className="grid grid-cols-2 gap-4">
                <fieldset className="flex flex-col gap-3">
                  <Label className="text-sm text-[var(--muted)]">Colour</Label>
                  <div className="flex flex-col gap-3">
                    {COLORS.map((c) => (
                      <Checkbox key={c.name} defaultSelected={false}>
                        <Checkbox.Content>
                          <Checkbox.Control>
                            <Checkbox.Indicator />
                          </Checkbox.Control>
                          <span
                            className="swatch-dot swatch-dot--inline"
                            style={{ ["--swatch" as string]: c.hex }}
                          />
                          <span className="text-sm">{c.name}</span>
                        </Checkbox.Content>
                      </Checkbox>
                    ))}
                  </div>
                </fieldset>

                <fieldset className="flex flex-col gap-3">
                  <Label className="text-sm text-[var(--muted)]">Weight</Label>
                  <div className="flex flex-col gap-3">
                    {WEIGHTS.map((w) => (
                      <Checkbox key={w} defaultSelected={false}>
                        <Checkbox.Content>
                          <Checkbox.Control>
                            <Checkbox.Indicator />
                          </Checkbox.Control>
                          <span className="text-sm">{w}</span>
                        </Checkbox.Content>
                      </Checkbox>
                    ))}
                  </div>
                </fieldset>
              </div>

              <fieldset className="flex flex-col gap-3">
                <Label className="text-sm text-[var(--muted)]">Shipping to</Label>
                <RadioGroup aria-label="Shipping to" defaultValue="USA">
                  <div className="grid grid-cols-2 gap-3">
                    {REGIONS.map((r) => (
                      <Radio
                        key={r.name}
                        value={r.name}
                        className="region-card rounded-[var(--radius)] border p-4"
                      >
                        <Radio.Content>
                          <Radio.Control>
                            <Radio.Indicator />
                          </Radio.Control>
                          <span className="flex flex-col gap-0.5">
                            <span className="region-name text-sm font-medium">{r.name}</span>
                            <span className="region-price text-sm text-[var(--muted)]">
                              {r.price}
                            </span>
                          </span>
                        </Radio.Content>
                      </Radio>
                    ))}
                  </div>
                </RadioGroup>
              </fieldset>
            </Drawer.Body>

            <Drawer.Footer className="flex gap-4">
              <Button
                fullWidth
                slot="close"
                onPress={() => {
                  onApply();
                }}
              >
                Apply filters
              </Button>
              <Button
                fullWidth
                variant="outline"
                slot="close"
                onPress={() => {
                  onClear();
                }}
              >
                Clear all
              </Button>
            </Drawer.Footer>
          </Drawer.Dialog>
        </Drawer.Content>
      </Drawer.Backdrop>
    </Drawer>
  );
}
