import { Component, useEffect, useMemo, useState, type ReactNode } from "react";
import { useConvexAuth, useQuery, ConvexProviderWithAuth } from "convex/react";
import {
  Alert,
  Breadcrumbs,
  Button,
  Dropdown,
  Label,
  ListBox,
  Pagination,
  Spinner,
  Typography,
  useOverlayState,
} from "@heroui/react";
import { api, clerk, convex, useClerkAuth } from "./lib/convex";
import {
  LISTINGS_LIMIT,
  PAGE_SIZE,
  SORT_OPTIONS,
  filterListings,
  formatPrice,
  parsePrice,
  pageItems,
  type Listing,
  type SortKey,
} from "./lib/listings";
import LoginScreen from "./components/LoginScreen";
import FilterSidebar, { type SidebarFilters } from "./components/FilterSidebar";
import FilterDrawer from "./components/FilterDrawer";
import CreateProductModal from "./components/CreateProductModal";
import ProductCard from "./components/ProductCard";
import { ChevronLeftIcon, ChevronRightIcon, SpartanIcon } from "./components/Icons";

class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="grid min-h-screen place-items-center p-6">
          <Alert status="danger" className="max-w-lg">
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Title>Something went wrong</Alert.Title>
              <Alert.Description>{String(this.state.error?.message || this.state.error)}</Alert.Description>
            </Alert.Content>
          </Alert>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const [signedIn, setSignedIn] = useState(() => !!clerk.session);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    clerk
      .load()
      .then(() => {
        setSignedIn(!!clerk.session);
        setReady(true);
      })
      .catch(() => setReady(true));
  }, []);

  if (!ready) {
    return (
      <div className="grid min-h-screen place-items-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <ConvexProviderWithAuth client={convex} useAuth={useClerkAuth}>
      <ErrorBoundary>
        {signedIn ? (
          <Marketplace onSignOut={() => setSignedIn(false)} />
        ) : (
          <LoginScreen onSignedIn={() => setSignedIn(true)} />
        )}
      </ErrorBoundary>
    </ConvexProviderWithAuth>
  );
}

function Marketplace({ onSignOut }: { onSignOut: () => void }) {
  const { isAuthenticated } = useConvexAuth();
  const me = useQuery(api.users.me, isAuthenticated ? {} : "skip");
  const result = useQuery(
    api.products.list,
    isAuthenticated ? { paginationOpts: { numItems: LISTINGS_LIMIT, cursor: null } } : "skip",
  );
  const listings: Listing[] = (result?.page as Listing[]) ?? [];

  const [filters, setFilters] = useState<SidebarFilters>({
    categories: new Set(["food", "assignments", "clothes"]),
    priceRanges: new Set(),
    priceFrom: "",
    priceTo: "",
  });
  const [brand, setBrand] = useState("");
  const [sort, setSort] = useState<SortKey>("featured");
  const [page, setPage] = useState(1);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const drawerState = useOverlayState({ defaultOpen: false });
  const createState = useOverlayState({ defaultOpen: false });

  const items = useMemo(
    () =>
      filterListings(listings, {
        categories: filters.categories,
        priceRanges: filters.priceRanges,
        priceFromCents: parsePrice(filters.priceFrom),
        priceToCents: parsePrice(filters.priceTo),
        brand,
        sort,
      }),
    [listings, filters, brand, sort],
  );

  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageSlice = items.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const heading =
    filters.categories.size === 1
      ? ({ food: "Food", assignments: "Assignments", clothes: "Clothes", jobs: "Jobs", other: "Other" }[
          [...filters.categories][0]
        ] ?? "All Products")
      : "All Products";

  const toggleFavorite = (id: string) =>
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const deleteListing = async (id: string) => {
    const listing = listings.find((l) => l.id === id);
    if (!listing || !confirm(`Delete "${listing.title}"?`)) return;
    try {
      await convex.mutation(api.products.remove, { id: id as any });
    } catch (err: any) {
      alert(err?.data ? String(err.data) : err?.message || "Something went wrong");
    }
  };

  const signOut = async () => {
    await clerk.signOut();
    onSignOut();
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 flex flex-wrap items-center justify-between gap-4 border-b bg-[var(--surface)] px-6 py-3">
        <div className="flex items-center gap-2">
          <SpartanIcon className="size-8" />
          <span className="text-lg font-bold tracking-tight">Loop</span>
        </div>
        <div className="flex items-center gap-3">
          <Button size="sm" onPress={createState.open}>
            Create Product
          </Button>
          <span className="whitespace-nowrap text-sm text-[var(--muted)]">
            {me?.name || clerk.user?.primaryEmailAddress?.emailAddress || ""}
          </span>
          <Button size="sm" variant="outline" onPress={signOut}>
            Log out
          </Button>
        </div>
      </header>

      <main className="w-full flex-1 bg-[var(--background)] py-8 md:py-12">
        <div className="mx-auto w-full max-w-[1280px] px-4 2xl:px-0">
          {/* Toolbar */}
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <Breadcrumbs className="mb-1">
                <Breadcrumbs.Item href="#">Home</Breadcrumbs.Item>
                <Breadcrumbs.Item href="#">Products</Breadcrumbs.Item>
                <Breadcrumbs.Item>{heading}</Breadcrumbs.Item>
              </Breadcrumbs>
              <Typography type="h2" weight="semibold" className="text-xl md:text-2xl">
                {heading}
              </Typography>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="lg:hidden" onPress={drawerState.open}>
                Filters
              </Button>
              <Dropdown>
                <Button variant="outline" size="sm">
                  Sort
                </Button>
                <Dropdown.Popover>
                  <Dropdown.Menu
                    selectionMode="single"
                    selectedKeys={new Set([sort])}
                    onAction={(key) => setSort(key as SortKey)}
                  >
                    {SORT_OPTIONS.map((o) => (
                      <Dropdown.Item key={o.id} id={o.id} textValue={o.label}>
                        {o.label}
                        <Dropdown.ItemIndicator />
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown.Popover>
              </Dropdown>
            </div>
          </div>

          {/* Two-pane layout */}
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
            <aside className="hidden w-[320px] shrink-0 rounded-[var(--radius)] border bg-[var(--surface)] p-4 shadow-sm lg:block">
              <FilterSidebar filters={filters} onChange={setFilters} />
            </aside>

            <div className="flex min-w-0 flex-1 flex-col">
              {result === undefined ? (
                <div className="flex justify-center py-16">
                  <Spinner size="lg" />
                </div>
              ) : items.length === 0 ? (
                <Alert status="default" className="rounded-[var(--radius)] border border-dashed">
                  <Alert.Content>
                    <Alert.Description>No listings match your filters.</Alert.Description>
                  </Alert.Content>
                </Alert>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {pageSlice.map((listing, i) => (
                    <ProductCard
                      key={listing.id}
                      listing={listing}
                      index={(currentPage - 1) * PAGE_SIZE + i}
                      isFavorite={favorites.has(listing.id)}
                      isOwner={!!me && listing.seller.id === me.id}
                      onToggleFavorite={toggleFavorite}
                      onDelete={deleteListing}
                    />
                  ))}
                </div>
              )}

              <nav className="mt-6 flex justify-center sm:mt-8" aria-label="Pagination">
                <Pagination>
                  <Pagination.Content>
                    <Pagination.Item>
                      <Pagination.Previous isDisabled={currentPage === 1} onPress={() => setPage(currentPage - 1)}>
                        <ChevronLeftIcon />
                        Previous
                      </Pagination.Previous>
                    </Pagination.Item>
                    {pageItems(currentPage, totalPages).map((p, i) =>
                      p === "…" ? (
                        <Pagination.Item key={`e${i}`}>
                          <Pagination.Ellipsis />
                        </Pagination.Item>
                      ) : (
                        <Pagination.Item key={p}>
                          <Pagination.Link
                            isActive={p === currentPage}
                            onPress={() => setPage(p)}
                          >
                            {p}
                          </Pagination.Link>
                        </Pagination.Item>
                      ),
                    )}
                    <Pagination.Item>
                      <Pagination.Next
                        isDisabled={currentPage === totalPages}
                        onPress={() => setPage(currentPage + 1)}
                      >
                        Next
                        <ChevronRightIcon />
                      </Pagination.Next>
                    </Pagination.Item>
                  </Pagination.Content>
                </Pagination>
              </nav>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t px-6 py-5 text-center text-xs text-[var(--muted)]">
        made by startup club
      </footer>

      <FilterDrawer
        state={drawerState}
        onApply={() => drawerState.close()}
        onClear={() => drawerState.close()}
      />
      <CreateProductModal
        state={createState}
        sellerName={me?.name || ""}
        onCreated={() => {}}
      />
    </div>
  );
}
