import { Component, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useConvexAuth, useQuery, ConvexProviderWithAuth } from "convex/react";
import {
  Alert,
  Breadcrumbs,
  Button,
  Dropdown,
  ListBox,
  Pagination,
  Spinner,
  Typography,
  useOverlayState,
} from "@heroui/react";
import { api, clerk, convex, useClerkAuth } from "./lib/convex";
import {
  BUSINESS_SORT_OPTIONS,
  LISTINGS_LIMIT,
  PAGE_SIZE,
  PRODUCT_SORT_OPTIONS,
  formatPrice,
  groupBusinesses,
  pageItems,
  sortBusinesses,
  sortListings,
  type Listing,
  type SortKey,
} from "./lib/listings";
import LoginScreen from "./components/LoginScreen";
import FilterDrawer from "./components/FilterDrawer";
import CreateProductModal from "./components/CreateProductModal";
import ProductCard from "./components/ProductCard";
import ProductDetail from "./components/ProductDetail";
import BusinessCard from "./components/BusinessCard";
import WelcomeHero from "./components/WelcomeHero";
import { ChevronLeftIcon, ChevronRightIcon } from "./components/Icons";
import LoopLogo from "./components/LoopLogo";
import ThemeToggle from "./components/ThemeToggle";

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

type View =
  | { kind: "home" }
  | { kind: "business"; businessId: string }
  | { kind: "product"; productId: string; businessId: string };

function Marketplace({ onSignOut }: { onSignOut: () => void }) {
  const { isAuthenticated } = useConvexAuth();
  const me = useQuery(api.users.me, isAuthenticated ? {} : "skip");
  const result = useQuery(
    api.products.list,
    isAuthenticated ? { paginationOpts: { numItems: LISTINGS_LIMIT, cursor: null } } : "skip",
  );
  const listings: Listing[] = (result?.page as Listing[]) ?? [];

  const [view, setView] = useState<View>({ kind: "home" });
  const [sort, setSort] = useState<SortKey>("featured");
  const [page, setPage] = useState(1);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const filterState = useOverlayState({ defaultOpen: false });
  const createState = useOverlayState({ defaultOpen: false });
  const businessesSection = useRef<HTMLElement>(null);

  const businesses = useMemo(() => groupBusinesses(listings), [listings]);

  const navigate = (next: View) => {
    setView(next);
    setSort("featured");
    setPage(1);
    window.scrollTo({ top: 0 });
  };

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

  const exploreBusinesses = () =>
    businessesSection.current?.scrollIntoView({ behavior: "smooth" });

  const sortMenu = (options: typeof BUSINESS_SORT_OPTIONS) => (
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
          {options.map((o) => (
            <Dropdown.Item key={o.id} id={o.id} textValue={o.label}>
              {o.label}
              <Dropdown.ItemIndicator />
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );

  const pagination = (total: number) => {
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    if (totalPages <= 1) return null;
    return (
      <nav className="mt-10 flex justify-center" aria-label="Pagination">
        <Pagination>
          <Pagination.Content>
            <Pagination.Item>
              <Pagination.Previous isDisabled={page === 1} onPress={() => setPage(page - 1)}>
                <ChevronLeftIcon />
                Previous
              </Pagination.Previous>
            </Pagination.Item>
            {pageItems(page, totalPages).map((p, i) =>
              p === "…" ? (
                <Pagination.Item key={`e${i}`}>
                  <Pagination.Ellipsis />
                </Pagination.Item>
              ) : (
                <Pagination.Item key={p}>
                  <Pagination.Link isActive={p === page} onPress={() => setPage(p)}>
                    {p}
                  </Pagination.Link>
                </Pagination.Item>
              ),
            )}
            <Pagination.Item>
              <Pagination.Next isDisabled={page === totalPages} onPress={() => setPage(page + 1)}>
                Next
                <ChevronRightIcon />
              </Pagination.Next>
            </Pagination.Item>
          </Pagination.Content>
        </Pagination>
      </nav>
    );
  };

  /** Saleor-style page head: breadcrumb, huge title, one-line intro, then the filter bar. */
  const pageHead = (
    crumbs: { label: string; onClick?: () => void }[],
    title: string,
    intro: string,
    count: number,
    countNoun: "business" | "product" = "product",
  ) => (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <Breadcrumbs>
          {crumbs.map((crumb, i) => (
            <Breadcrumbs.Item key={crumb.label} {...(crumb.onClick ? { href: "#" } : {})}>
              {crumb.onClick ? (
                <button
                  type="button"
                  onClick={crumb.onClick}
                  className="hover:underline"
                >
                  {crumb.label}
                </button>
              ) : (
                crumb.label
              )}
            </Breadcrumbs.Item>
          ))}
        </Breadcrumbs>
        <Typography type="h1" weight="bold" className="text-4xl md:text-5xl">
          {title}
        </Typography>
        <Typography color="muted" className="text-base md:text-lg">
          {intro}
        </Typography>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4">
        <Button variant="outline" size="sm" onPress={filterState.open}>
          Filters
        </Button>
        <div className="flex items-center gap-4">
          <Typography color="muted" className="text-sm">
            {count} {count === 1 ? countNoun : countNoun === "business" ? "businesses" : "products"}
          </Typography>
          {sortMenu(view.kind === "home" ? BUSINESS_SORT_OPTIONS : PRODUCT_SORT_OPTIONS)}
        </div>
      </div>
    </div>
  );

  const renderHome = () => {
    const items = sortBusinesses(businesses, sort);
    const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
    const current = Math.min(page, totalPages);
    const slice = items.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);
    return (
      <>
        <WelcomeHero image={businesses[0]?.coverImages[0]} onExplore={exploreBusinesses} />
        <section ref={businessesSection} className="mx-auto w-full max-w-[1280px] px-6 py-16">
          {pageHead(
            [{ label: "Home" }, { label: "Businesses" }],
            "Businesses",
            "Shop directly from student-run businesses on Loop.",
            businesses.length,
            "business",
          )}
          {result === undefined ? (
            <div className="flex justify-center py-16">
              <Spinner size="lg" />
            </div>
          ) : items.length === 0 ? (
            <Alert status="default" className="mt-8 rounded-[var(--radius)] border border-dashed">
              <Alert.Content>
                <Alert.Description>No businesses are open yet.</Alert.Description>
              </Alert.Content>
            </Alert>
          ) : (
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {slice.map((business) => (
                <BusinessCard
                  key={business.id}
                  business={business}
                  onOpen={(businessId) => navigate({ kind: "business", businessId })}
                />
              ))}
            </div>
          )}
          {pagination(items.length)}
        </section>
      </>
    );
  };

  const renderBusiness = (businessId: string) => {
    const business = businesses.find((b) => b.id === businessId);
    if (!business) return renderHome();
    const items = sortListings(business.listings, sort);
    const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
    const current = Math.min(page, totalPages);
    const slice = items.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);
    return (
      <section className="mx-auto w-full max-w-[1280px] px-6 py-12">
        {pageHead(
          [
            { label: "Home", onClick: () => navigate({ kind: "home" }) },
            { label: "Businesses", onClick: () => navigate({ kind: "home" }) },
            { label: business.name },
          ],
          business.name,
          `${business.listings.length} ${business.listings.length === 1 ? "product" : "products"} · from ${formatPrice(business.minPriceCents)}`,
          business.listings.length,
        )}
        {items.length === 0 ? (
          <Alert status="default" className="mt-8 rounded-[var(--radius)] border border-dashed">
            <Alert.Content>
              <Alert.Description>This business hasn't listed anything yet.</Alert.Description>
            </Alert.Content>
          </Alert>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {slice.map((listing, i) => (
              <ProductCard
                key={listing.id}
                listing={listing}
                index={(current - 1) * PAGE_SIZE + i}
                isFavorite={favorites.has(listing.id)}
                isOwner={!!me && listing.seller.id === me.id}
                onOpen={(productId) =>
                  navigate({ kind: "product", productId, businessId })
                }
                onToggleFavorite={toggleFavorite}
                onDelete={deleteListing}
              />
            ))}
          </div>
        )}
        {pagination(items.length)}
      </section>
    );
  };

  const renderProduct = (productId: string, businessId: string) => {
    const business = businesses.find((b) => b.id === businessId);
    const listing = business?.listings.find((l) => l.id === productId);
    if (!business || !listing) return renderHome();
    const index = business.listings.findIndex((l) => l.id === productId);
    return (
      <section className="mx-auto w-full max-w-[1280px] px-6 py-12">
        <Breadcrumbs className="mb-8">
          <Breadcrumbs.Item href="#">
            <button type="button" className="hover:underline" onClick={() => navigate({ kind: "home" })}>
              Home
            </button>
          </Breadcrumbs.Item>
          <Breadcrumbs.Item href="#">
            <button
              type="button"
              className="hover:underline"
              onClick={() => navigate({ kind: "business", businessId })}
            >
              {business.name}
            </button>
          </Breadcrumbs.Item>
          <Breadcrumbs.Item>{listing.title}</Breadcrumbs.Item>
        </Breadcrumbs>
        <ProductDetail
          listing={listing}
          index={index}
          onBack={() => navigate({ kind: "business", businessId })}
        />
      </section>
    );
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 flex flex-wrap items-center justify-between gap-4 border-b bg-[var(--surface)] px-6 py-3">
        <button
          type="button"
          className="flex items-center gap-2"
          onClick={() => navigate({ kind: "home" })}
          aria-label="Loop home"
        >
          <LoopLogo variant="mark" className="h-9" />
        </button>
        <div className="flex items-center gap-3">
          <Button size="sm" onPress={createState.open}>
            Create Product
          </Button>
          <ThemeToggle />
          <span className="whitespace-nowrap text-sm text-[var(--muted)]">
            {me?.name || clerk.user?.primaryEmailAddress?.emailAddress || ""}
          </span>
          <Button size="sm" variant="outline" onPress={signOut}>
            Log out
          </Button>
        </div>
      </header>

      <main className="w-full flex-1 bg-[var(--background)]">
        {result === undefined ? (
          <div className="flex justify-center py-32">
            <Spinner size="lg" />
          </div>
        ) : view.kind === "home" ? (
          renderHome()
        ) : view.kind === "business" ? (
          renderBusiness(view.businessId)
        ) : (
          renderProduct(view.productId, view.businessId)
        )}
      </main>

      <footer className="border-t px-6 py-5 text-center text-xs text-[var(--muted)]">
        made by startup club
      </footer>

      <FilterDrawer state={filterState} />
      <CreateProductModal
        state={createState}
        sellerName={me?.name || ""}
        onCreated={() => {}}
      />
    </div>
  );
}
