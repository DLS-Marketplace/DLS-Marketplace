import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Form,
  Input,
  Label,
  ListBox,
  Modal,
  Select,
  Spinner,
  TextArea,
  Typography,
  useOverlayState,
} from "@heroui/react";
import { MAX_PHOTOS, fileToDataUrl } from "../lib/photos";
import { CATEGORY_LABELS, formatPrice } from "../lib/listings";
import { api, convex, uploadImage } from "../lib/convex";
import { convexMessage } from "../lib/auth";

interface CreateProductModalProps {
  state: ReturnType<typeof useOverlayState>;
  sellerName: string;
  onCreated: (category: string) => void;
}

export default function CreateProductModal({ state, sellerName, onCreated }: CreateProductModalProps) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("food");
  const [seller, setSeller] = useState(sellerName);
  const [images, setImages] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (state.isOpen) {
      setTitle("");
      setDesc("");
      setPrice("");
      setCategory("food");
      setSeller(sellerName);
      setImages([]);
      setError("");
    }
  }, [state.isOpen, sellerName]);

  const addFiles = async (files: FileList | null) => {
    if (!files) return;
    for (const file of Array.from(files)) {
      if (images.length >= MAX_PHOTOS) {
        setError(`Up to ${MAX_PHOTOS} photos.`);
        break;
      }
      try {
        const dataUrl = await fileToDataUrl(file);
        setImages((prev) => [...prev, dataUrl]);
      } catch {
        setError(`Could not read "${file.name}".`);
      }
    }
  };

  const submit = async () => {
    setError("");
    const priceCents = Math.round(Number(price) * 100);
    if (title.trim().length < 3 || !seller.trim() || !Number.isFinite(priceCents) || priceCents < 1) {
      setError("Fill in a name (3+ characters), seller name, and a valid price.");
      return;
    }
    if (images.length === 0) {
      setError("Add at least one photo.");
      return;
    }

    setBusy(true);
    try {
      if (seller.trim() !== sellerName) {
        await convex.mutation(api.users.updateProfile, { name: seller.trim() });
      }
      const imageIds: string[] = [];
      for (const src of images) {
        imageIds.push(await uploadImage(await (await fetch(src)).blob()));
      }
      await convex.mutation(api.products.create, {
        title: title.trim(),
        description: desc.trim(),
        category: category as any,
        priceCents,
        imageIds: imageIds as any,
      });
      state.close();
      onCreated(category);
    } catch (err) {
      setError(convexMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const previewPrice =
    Number.isFinite(Number(price)) && price !== "" ? formatPrice(Math.round(Number(price) * 100)) : "$0";

  return (
    <Modal state={state}>
      <Modal.Backdrop>
        <Modal.Container size="lg">
          <Modal.Dialog>
            <Modal.Header>
              <Modal.Heading>Create Product</Modal.Heading>
              <Modal.CloseTrigger />
            </Modal.Header>
            <Modal.Body>
              <Form
                className="grid grid-cols-1 gap-5 md:grid-cols-[1fr_300px]"
                onSubmit={(e) => {
                  e.preventDefault();
                  submit();
                }}
              >
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <Label className="text-sm text-[var(--muted)]">
                      Photos <span className="text-[var(--muted)]">(up to 5)</span>
                    </Label>
                    <div className="flex min-h-16 flex-wrap gap-2 rounded-lg border border-dashed p-2">
                      {images.length === 0 && (
                        <span className="self-center text-sm text-[var(--muted)]">No photos yet</span>
                      )}
                      {images.map((src, i) => (
                        <div key={i} className="relative h-14 w-[72px] overflow-hidden rounded-lg border">
                          <img src={src} alt={`Photo ${i + 1}`} className="size-full object-cover" />
                          <button
                            type="button"
                            aria-label="Remove photo"
                            className="absolute right-0.5 top-0.5 grid size-[18px] place-items-center rounded-full bg-[var(--danger)] text-xs text-white"
                            onClick={() => setImages((prev) => prev.filter((_, j) => j !== i))}
                          >
                            &times;
                          </button>
                          {i === 0 && (
                            <span className="absolute inset-x-0 bottom-0 bg-[var(--accent)]/90 text-center text-[10px] text-white">
                              Main
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                    <label className="inline-flex cursor-pointer items-center justify-center rounded-lg border px-4 py-2.5 text-sm font-semibold hover:bg-[var(--default)]">
                      + Add photos
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={(e) => {
                          addFiles(e.target.files);
                          e.target.value = "";
                        }}
                      />
                    </label>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <Label className="text-sm text-[var(--muted)]">Product name</Label>
                    <Input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Homemade cookies"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <Label className="text-sm text-[var(--muted)]">Description</Label>
                    <TextArea
                      value={desc}
                      onChange={(e) => setDesc(e.target.value)}
                      placeholder="Short description"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <Label className="text-sm text-[var(--muted)]">Price ($)</Label>
                      <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="10" required />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label className="text-sm text-[var(--muted)]">Category</Label>
                      <Select
                        aria-label="Category"
                        selectedKey={category}
                        onChange={(v) => setCategory(String(v))}
                      >
                        <Select.Trigger>
                          <Select.Value />
                          <Select.Indicator />
                        </Select.Trigger>
                        <Select.Popover>
                          <ListBox>
                            {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                              <ListBox.Item key={key} id={key} textValue={label}>
                                {label}
                                <ListBox.ItemIndicator />
                              </ListBox.Item>
                            ))}
                          </ListBox>
                        </Select.Popover>
                      </Select>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <Label className="text-sm text-[var(--muted)]">Seller name or brand</Label>
                    <Input
                      value={seller}
                      onChange={(e) => setSeller(e.target.value)}
                      placeholder="Real name or what you go by"
                      required
                    />
                  </div>

                  {error && (
                    <Alert status="danger">
                      <Alert.Indicator />
                      <Alert.Content>
                        <Alert.Description>{error}</Alert.Description>
                      </Alert.Content>
                    </Alert>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Typography color="muted" className="text-sm">
                    Live preview
                  </Typography>
                  <Card>
                    <Card.Content className="flex flex-col gap-3 p-4">
                      <div className="h-40 overflow-hidden rounded-lg bg-[var(--field-background)]">
                        {images[0] ? (
                          <img src={images[0]} alt="" className="size-full object-cover" />
                        ) : (
                          <div className="grid size-full place-items-center text-sm text-[var(--muted)]">
                            Add a photo
                          </div>
                        )}
                      </div>
                      <div className="flex items-start justify-between gap-3">
                        <span className="text-base font-semibold">{title || "Product name"}</span>
                        <span className="text-xl font-bold">{previewPrice}</span>
                      </div>
                    </Card.Content>
                  </Card>
                </div>
              </Form>
            </Modal.Body>
            <Modal.Footer className="flex justify-end gap-3">
              <Button variant="outline" slot="close">
                Cancel
              </Button>
              <Button type="submit" form="create-form" isPending={busy} onPress={submit}>
                {busy ? <Spinner size="sm" /> : "Add to marketplace"}
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
