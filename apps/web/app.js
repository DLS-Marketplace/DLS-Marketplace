import { Clerk } from "@clerk/clerk-js";
import { api } from "@gambit/backend/convex/_generated/api";
import { ConvexClient } from "convex/browser";
import { ConvexError } from "convex/values";

const CATEGORY_LABELS = {
  food: "Food",
  assignments: "Assignments",
  clothes: "Clothes",
  jobs: "Jobs",
  other: "Other",
};

const MAX_PHOTOS = 5;
const PRICE_RANGE_MAX = 100;
// Newest listings kept in sync live; filters and sorting below run on these.
const LISTINGS_LIMIT = 200;

// ===== State =====
let currentCategory = "all";
let currentSort = "featured";
let maxPrice = PRICE_RANGE_MAX;
let me = null;
let listings = [];
let editorImages = [];
let previewIdx = 0;
let pendingAuth = null; // in-progress Clerk sign-in or sign-up
let subscriptions = [];

const clerk = new Clerk(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY);
const convex = new ConvexClient(import.meta.env.VITE_CONVEX_URL);

function convexMessage(err) {
  return err instanceof ConvexError ? String(err.data) : err?.message || "Something went wrong";
}

async function uploadImage(blob) {
  const url = await convex.mutation(api.files.generateUploadUrl, {});
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": blob.type || "image/jpeg" },
    body: blob,
  });
  if (!res.ok) throw new Error("Photo upload failed");
  return (await res.json()).storageId;
}

function formatPrice(cents) {
  return `$${(cents / 100).toFixed(cents % 100 ? 2 : 0)}`;
}

function clerkMessage(err, fallback) {
  const first = err?.errors?.[0];
  return first?.longMessage || first?.message || err?.message || fallback;
}

// ===== DOM =====
const loginScreen = document.getElementById("login-screen");
const loginSubtitle = document.getElementById("login-subtitle");
const emailForm = document.getElementById("email-form");
const emailInput = document.getElementById("login-email");
const codeForm = document.getElementById("code-form");
const codeInput = document.getElementById("login-code");
const codeBackBtn = document.getElementById("code-back");
const loginError = document.getElementById("login-error");
const app = document.getElementById("app");
const userIdBadge = document.getElementById("user-id-badge");
const logoutBtn = document.getElementById("logout-btn");
const grid = document.getElementById("listing-grid");
const emptyState = document.getElementById("empty-state");
const tabButtons = document.querySelectorAll(".tab-btn");
const sortButtons = document.querySelectorAll(".filter-btn");
const priceRange = document.getElementById("price-range");
const priceRangeLabel = document.getElementById("price-range-label");

const createListingBtn = document.getElementById("create-listing-btn");
const createModal = document.getElementById("create-modal");
const createModalClose = document.getElementById("create-modal-close");
const createForm = document.getElementById("create-form");
const createError = document.getElementById("create-error");

// ===== Auth (Clerk email code, same flow as the mobile app) =====
function showLoginError(msg, input) {
  loginError.textContent = msg;
  loginError.hidden = false;
  if (input) {
    input.classList.remove("shake");
    void input.offsetWidth; // restart animation
    input.classList.add("shake");
  }
}

function showEmailStep() {
  pendingAuth = null;
  codeForm.hidden = true;
  emailForm.hidden = false;
  loginSubtitle.textContent = "Sign in with email";
  loginError.hidden = true;
  emailInput.focus();
}

function setBusy(form, busy) {
  form.querySelectorAll("button, input").forEach((el) => (el.disabled = busy));
}

emailInput.addEventListener("input", () => {
  loginError.hidden = true;
  emailInput.classList.remove("shake");
});

emailForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = emailInput.value.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showLoginError("Enter a valid email", emailInput);
    return;
  }
  setBusy(emailForm, true);
  loginError.hidden = true;
  try {
    pendingAuth = await sendCode(email);
    emailForm.hidden = true;
    codeForm.hidden = false;
    loginSubtitle.textContent = `Code sent to ${email}`;
    codeInput.value = "";
    codeInput.focus();
  } catch (err) {
    showLoginError(clerkMessage(err, "Couldn't send code"), emailInput);
  } finally {
    setBusy(emailForm, false);
  }
});

// New emails get a sign-up instead of a sign-in; both verify with an emailed code.
async function sendCode(email) {
  try {
    const signIn = await passProtectCheck(await clerk.client.signIn.create({ identifier: email }));
    const factor = signIn.supportedFirstFactors?.find((f) => f.strategy === "email_code");
    if (!factor) throw new Error("Email code sign-in isn't enabled");
    await signIn.prepareFirstFactor({ strategy: "email_code", emailAddressId: factor.emailAddressId });
    return { mode: "signIn", resource: signIn };
  } catch (err) {
    if (err?.errors?.[0]?.code !== "form_identifier_not_found") throw err;
    const signUp = await passProtectCheck(await clerk.client.signUp.create({ emailAddress: email }));
    await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
    return { mode: "signUp", resource: signUp };
  }
}

// Clerk Protect can require a bot check mid-flow (Clerk's prebuilt UI does this automatically).
// Run the challenge module it points to and submit the proof; checks can be chained.
const protectContainer = document.getElementById("protect-check");

async function passProtectCheck(resource) {
  for (let i = 0; resource.protectCheck && i < 3; i++) {
    const { sdkUrl, token, uiHints } = resource.protectCheck;
    if (new URL(sdkUrl).protocol !== "https:") throw new Error("Invalid security check");
    const { default: runCheck } = await import(/* @vite-ignore */ sdkUrl);
    try {
      const proofToken = await runCheck(protectContainer, {
        token,
        uiHints,
        setWidgetVisible: async (visible) => {
          protectContainer.hidden = !visible;
        },
      });
      resource = await resource.submitProtectCheck({ proofToken });
    } finally {
      protectContainer.hidden = true;
      protectContainer.replaceChildren();
    }
  }
  if (resource.protectCheck) throw new Error("Security check failed");
  return resource;
}

codeInput.addEventListener("input", () => {
  codeInput.value = codeInput.value.replace(/\D/g, "").slice(0, 6);
  loginError.hidden = true;
  codeInput.classList.remove("shake");
  if (codeInput.value.length === 6) codeForm.requestSubmit();
});

codeForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!pendingAuth || codeInput.value.length !== 6) return;
  setBusy(codeForm, true);
  try {
    const code = codeInput.value;
    const result = await passProtectCheck(
      pendingAuth.mode === "signIn"
        ? await pendingAuth.resource.attemptFirstFactor({ strategy: "email_code", code })
        : await pendingAuth.resource.attemptEmailAddressVerification({ code })
    );
    if (result.status !== "complete") throw new Error("Couldn't sign in");
    await clerk.setActive({ session: result.createdSessionId });
    await enterApp();
  } catch (err) {
    showLoginError(clerkMessage(err, "Wrong code"), codeInput);
    codeInput.value = "";
    codeInput.focus();
  } finally {
    setBusy(codeForm, false);
  }
});

codeBackBtn.addEventListener("click", showEmailStep);

// Live subscriptions: changes from any device (web or mobile) re-render right away.
function enterApp() {
  convex.setAuth(({ forceRefreshToken }) =>
    clerk.session?.getToken({ template: "convex", skipCache: forceRefreshToken }) ?? null
  );
  updateBadge();
  loginScreen.hidden = true;
  app.hidden = false;
  window.scrollTo(0, 0);

  subscriptions = [
    convex.onUpdate(api.users.me, {}, (profile) => {
      me = profile;
      updateBadge();
      renderListings();
    }),
    convex.onUpdate(
      api.products.list,
      { paginationOpts: { numItems: LISTINGS_LIMIT, cursor: null } },
      (result) => {
        listings = result.page;
        emptyState.textContent = "No listings match your filters.";
        renderListings();
      },
      (err) => {
        listings = [];
        emptyState.textContent = convexMessage(err);
        renderListings();
      }
    ),
  ];
}

function updateBadge() {
  userIdBadge.textContent = me?.name || clerk.user?.primaryEmailAddress?.emailAddress || "";
}

logoutBtn.addEventListener("click", async () => {
  subscriptions.forEach((unsubscribe) => unsubscribe());
  subscriptions = [];
  await clerk.signOut();
  convex.client.clearAuth();
  me = null;
  listings = [];
  app.hidden = true;
  createModal.hidden = true;
  loginScreen.hidden = false;
  emailInput.value = "";
  showEmailStep();
});

// ===== Listings =====
async function deleteListing(id) {
  const listing = listings.find((l) => l.id === id);
  if (!listing || !confirm(`Delete "${listing.title}"?`)) return;
  try {
    await convex.mutation(api.products.remove, { id });
  } catch (err) {
    alert(convexMessage(err));
  }
}

// ===== Create product (live preview) =====
const photoThumbs = document.getElementById("photo-thumbs");
const imageFilesInput = document.getElementById("create-image-files");
const livePreview = document.getElementById("live-preview");
const createSubmitBtn = document.querySelector(".create-submit");
const createCancelBtn = document.getElementById("create-cancel");

createListingBtn.addEventListener("click", openEditor);

createModalClose.addEventListener("click", () => {
  createModal.hidden = true;
});
createCancelBtn.addEventListener("click", () => {
  createModal.hidden = true;
});

createModal.addEventListener("click", (e) => {
  if (e.target === createModal) createModal.hidden = true;
});

// Surface native validation blocks (otherwise the browser silently refuses to submit)
createForm.addEventListener(
  "invalid",
  (e) => {
    showCreateError(e.target.validationMessage || "Check the highlighted field.");
  },
  true
);

function openEditor() {
  previewIdx = 0;
  createError.hidden = true;
  createForm.reset();
  document.getElementById("create-category").value = "food";
  document.getElementById("create-seller-name").value = me?.name || "";
  editorImages = [];

  renderPhotoThumbs();
  updateLivePreview();
  createModal.hidden = false;
  document.getElementById("create-title").focus();
}

// Multi-photo upload
imageFilesInput.addEventListener("change", async (e) => {
  const files = Array.from(e.target.files || []);
  for (const file of files) {
    if (editorImages.length >= MAX_PHOTOS) {
      showCreateError(`Up to ${MAX_PHOTOS} photos.`);
      break;
    }
    try {
      editorImages.push(await fileToDataUrl(file));
    } catch {
      showCreateError(`Could not read "${file.name}".`);
    }
  }
  e.target.value = "";
  renderPhotoThumbs();
  updateLivePreview();
});

function renderPhotoThumbs() {
  photoThumbs.innerHTML = "";
  if (editorImages.length === 0) {
    photoThumbs.innerHTML = '<span class="photo-thumbs-empty">No photos yet</span>';
    return;
  }
  editorImages.forEach((src, i) => {
    const div = document.createElement("div");
    div.className = "photo-thumb";
    div.innerHTML = `
      <img src="${escapeHtml(src)}" alt="Photo ${i + 1}" />
      <button type="button" class="photo-thumb-remove" data-index="${i}" aria-label="Remove photo">&times;</button>
      ${i === 0 ? '<span class="photo-thumb-main">Main</span>' : ""}
    `;
    photoThumbs.appendChild(div);
  });
  photoThumbs.querySelectorAll(".photo-thumb-remove").forEach((btn) => {
    btn.addEventListener("click", () => {
      editorImages.splice(Number(btn.dataset.index), 1);
      renderPhotoThumbs();
      updateLivePreview();
    });
  });
}

// Live preview — re-render on any field change
const previewFieldIds = [
  "create-title",
  "create-desc",
  "create-price",
  "create-category",
  "create-seller-name",
];
previewFieldIds.forEach((id) => {
  document.getElementById(id).addEventListener("input", updateLivePreview);
  document.getElementById(id).addEventListener("change", updateLivePreview);
});

let previewImgSig = null;

function updateLivePreview() {
  const title = document.getElementById("create-title").value.trim() || "Product name";
  const desc =
    document.getElementById("create-desc").value.trim() ||
    "Your description will appear here.";
  const priceVal = document.getElementById("create-price").value;
  const priceNum = Number(priceVal);
  const price =
    Number.isFinite(priceNum) && priceVal !== "" ? formatPrice(Math.round(priceNum * 100)) : "$0";
  const category = document.getElementById("create-category").value;
  const seller =
    document.getElementById("create-seller-name").value.trim() || "Your name / brand";

  const sig = editorImages.join("\u0000");
  if (sig !== previewImgSig) {
    previewImgSig = sig;
    renderPreviewCard();
  }

  // Text-only updates (never rebuild DOM here — a rebuild during mousedown
  // would destroy the arrow buttons before mouseup and swallow the click)
  livePreview.querySelector(".listing-title").textContent = title;
  livePreview.querySelector(".listing-desc").textContent = desc;
  livePreview.querySelector(".listing-price").textContent = price;
  livePreview.querySelector(".listing-seller").textContent = seller;
  livePreview.querySelector(".listing-category-chip").textContent =
    CATEGORY_LABELS[category] || category;
}

function renderPreviewCard() {
  previewIdx = 0;
  const imagesHtml =
    editorImages.length > 0
      ? editorImages
          .map(
            (src, i) =>
              `<img src="${escapeHtml(src)}" alt="" class="${i === 0 ? "" : "preview-extra-img"}" />`
          )
          .join("")
      : `<div class="preview-no-img">Add a photo</div>`;

  livePreview.innerHTML = `
    <div class="listing-thumb carousel">
      <div class="carousel-track">
        ${imagesHtml}
      </div>
      <span class="listing-category-chip"></span>
      ${
        editorImages.length > 1
          ? `
        <button class="carousel-arrow prev" type="button" aria-label="Previous image">&#10094;</button>
        <button class="carousel-arrow next" type="button" aria-label="Next image">&#10095;</button>
        <div class="carousel-dots">
          ${editorImages.map((_, i) => `<span class="${i === previewIdx ? "active" : ""}"></span>`).join("")}
        </div>`
          : ""
      }
    </div>
    <div class="listing-body">
      <h3 class="listing-title"></h3>
      <p class="listing-desc"></p>
      <div class="listing-meta">
        <span class="listing-price"></span>
        <span class="listing-seller"></span>
      </div>
    </div>
  `;

  const thumb = livePreview.querySelector(".listing-thumb");
  const track = livePreview.querySelector(".carousel-track");
  const dots = [...livePreview.querySelectorAll(".carousel-dots span")];
  track.style.transform = "translateX(0%)";

  if (editorImages.length > 1) {
    const goTo = (i) => {
      previewIdx = (i + editorImages.length) % editorImages.length;
      track.style.transform = `translateX(-${previewIdx * 100}%)`;
      dots.forEach((d, di) => d.classList.toggle("active", di === previewIdx));
    };

    thumb.classList.add("carousel--interactive");
    livePreview.querySelector(".carousel-arrow.prev").addEventListener("click", (e) => {
      e.stopPropagation();
      goTo(previewIdx - 1);
    });
    livePreview.querySelector(".carousel-arrow.next").addEventListener("click", (e) => {
      e.stopPropagation();
      goTo(previewIdx + 1);
    });
    dots.forEach((d, di) => d.addEventListener("click", () => goTo(di)));
    track.addEventListener("click", () => goTo(previewIdx + 1));

    // Scroll / swipe through images
    thumb.addEventListener(
      "wheel",
      (e) => {
        if (Math.abs(e.deltaY) < 4 && Math.abs(e.deltaX) < 4) return;
        e.preventDefault();
        goTo(previewIdx + (e.deltaY > 0 || e.deltaX > 0 ? 1 : -1));
      },
      { passive: false }
    );

    let dragStart = null;
    thumb.addEventListener("pointerdown", (e) => {
      dragStart = e.clientX;
    });
    thumb.addEventListener("pointerup", (e) => {
      if (dragStart == null) return;
      const dx = e.clientX - dragStart;
      dragStart = null;
      if (Math.abs(dx) > 40) goTo(previewIdx + (dx < 0 ? 1 : -1));
    });
    thumb.addEventListener("pointerleave", () => {
      dragStart = null;
    });
  }
}

createForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  createError.hidden = true;

  const title = document.getElementById("create-title").value.trim();
  const description = document.getElementById("create-desc").value.trim();
  const priceCents = Math.round(Number(document.getElementById("create-price").value) * 100);
  const category = document.getElementById("create-category").value;
  const sellerName = document.getElementById("create-seller-name").value.trim();

  if (title.length < 3 || !sellerName || !Number.isFinite(priceCents) || priceCents < 1) {
    showCreateError("Fill in a name (3+ characters), seller name, and a valid price.");
    return;
  }
  if (editorImages.length === 0) {
    showCreateError("Add at least one photo.");
    return;
  }

  const submitLabel = createSubmitBtn.textContent;
  createSubmitBtn.disabled = true;
  createSubmitBtn.textContent = "Posting…";
  try {
    // Listings show the seller's profile name (this also creates the profile on first post).
    if (sellerName !== me?.name) {
      await convex.mutation(api.users.updateProfile, { name: sellerName });
    }

    const imageIds = [];
    for (const src of editorImages) {
      imageIds.push(await uploadImage(await (await fetch(src)).blob()));
    }

    // The new listing arrives through the live subscription.
    await convex.mutation(api.products.create, {
      title,
      description,
      category,
      priceCents,
      imageIds,
    });
    createModal.hidden = true;

    const tab = document.querySelector(`.tab-btn[data-category="${category}"]`);
    if (tab) tab.click();
    else renderListings();
  } catch (err) {
    showCreateError(convexMessage(err));
  } finally {
    createSubmitBtn.disabled = false;
    createSubmitBtn.textContent = submitLabel;
  }
});

function showCreateError(msg) {
  createError.textContent = msg;
  createError.hidden = false;
  createError.classList.remove("shake");
  void createError.offsetWidth;
  createError.classList.add("shake");
}

const PHOTO_MAX_DIM = 1200;
const PHOTO_QUALITY = 0.75;

function fileToDataUrl(file) {
  if (!file.type.startsWith("image/")) return readRawFile(file);
  return compressImage(file).catch(() => readRawFile(file));
}

function readRawFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function compressImage(file) {
  return readRawFile(file).then(compressDataUrl);
}

function compressDataUrl(dataUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      let { width: w, height: h } = img;
      const scale = Math.min(1, PHOTO_MAX_DIM / Math.max(w, h));
      w = Math.round(w * scale);
      h = Math.round(h * scale);

      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL("image/jpeg", PHOTO_QUALITY));
    };
    img.onerror = reject;
    img.src = dataUrl;
  });
}

// ===== Tabs =====
tabButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    tabButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentCategory = btn.dataset.category;
    renderListings();
  });
});

// ===== Sort / filter =====
sortButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    sortButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentSort = btn.dataset.sort;
    renderListings();
  });
});

priceRange.addEventListener("input", () => {
  maxPrice = Number(priceRange.value);
  priceRangeLabel.textContent = maxPrice >= PRICE_RANGE_MAX ? `${maxPrice}+` : maxPrice;
  renderListings();
});

function sortItems(items) {
  const sorted = [...items];
  switch (currentSort) {
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
      break; // featured = server order (newest first)
  }
  return sorted;
}

// ===== Render listings =====
function renderListings() {
  let items =
    currentCategory === "all"
      ? listings
      : listings.filter((l) => l.category === currentCategory);

  // The top of the slider means no limit.
  if (maxPrice < PRICE_RANGE_MAX) items = items.filter((l) => l.priceCents <= maxPrice * 100);
  items = sortItems(items);

  grid.innerHTML = "";
  emptyState.hidden = items.length > 0;

  items.forEach((listing, index) => {
    const card = document.createElement("article");
    card.className = "listing-card";
    card.style.animationDelay = `${index * 60}ms`;
    const mine = me && listing.seller.id === me.id;
    card.innerHTML = `
      <div class="listing-actions">
        ${
          mine
            ? `<button class="listing-delete" aria-label="Delete ${escapeHtml(listing.title)}" title="Delete listing">&times;</button>`
            : ""
        }
      </div>
      <div class="listing-thumb carousel" data-carousel>
        <div class="carousel-track">
          ${listing.images
            .map(
              (src) =>
                `<img src="${escapeHtml(src)}" alt="${escapeHtml(listing.title)}" loading="lazy" />`
            )
            .join("")}
        </div>
        <span class="listing-category-chip">${CATEGORY_LABELS[listing.category]}</span>
        ${
          listing.images.length > 1
            ? `
          <button class="carousel-arrow prev" aria-label="Previous image">&#10094;</button>
          <button class="carousel-arrow next" aria-label="Next image">&#10095;</button>
          <div class="carousel-dots">
            ${listing.images
              .map((_, i) => `<span class="${i === 0 ? "active" : ""}"></span>`)
              .join("")}
          </div>`
            : ""
        }
      </div>
      <div class="listing-body">
        <h3 class="listing-title">${escapeHtml(listing.title)}</h3>
        <p class="listing-desc">${escapeHtml(listing.description)}</p>
        <div class="listing-meta">
          <span class="listing-price">${formatPrice(listing.priceCents)}</span>
          <span class="listing-seller">${escapeHtml(listing.seller.name)}</span>
        </div>
      </div>
    `;
    grid.appendChild(card);

    if (listing.images.length > 1) setupCarousel(card.querySelector("[data-carousel]"));

    card.querySelector(".listing-delete")?.addEventListener("click", (e) => {
      e.stopPropagation();
      deleteListing(listing.id);
    });
  });
}

function setupCarousel(carousel) {
  const track = carousel.querySelector(".carousel-track");
  const slides = track.children;
  const dots = carousel.querySelectorAll(".carousel-dots span");
  let index = 0;

  function go(i) {
    index = (i + slides.length) % slides.length;
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((d, di) => d.classList.toggle("active", di === index));
  }

  carousel.querySelector(".prev").addEventListener("click", (e) => {
    e.stopPropagation();
    go(index - 1);
  });
  carousel.querySelector(".next").addEventListener("click", (e) => {
    e.stopPropagation();
    go(index + 1);
  });
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

// ===== Start =====
setBusy(emailForm, true);
clerk
  .load()
  .then(() => (clerk.session ? enterApp() : null))
  .catch((err) => showLoginError(clerkMessage(err, "Couldn't reach sign-in")))
  .finally(() => setBusy(emailForm, false));
