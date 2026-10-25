// ===== Listings data =====
const LISTINGS = [
  // Food
  {
    id: 1, category: "food", title: "Homemade Empanadas (6 pc)",
    desc: "Beef and cheese empanadas, baked fresh every morning. Perfect study fuel.",
    price: "$8", priceValue: 8, popularity: 92, listedDaysAgo: 2,
    seller: "Maria G.",
    images: [
      "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop",
    ],
  },
  {
    id: 2, category: "food", title: "Matcha Latte Kit",
    desc: "Ceremonial-grade matcha, whisk, and two travel cups. Makes ~20 lattes.",
    price: "$15", priceValue: 15, popularity: 61, listedDaysAgo: 6,
    seller: "Ken T.",
    images: [
      "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1536256263959-770b4884a580?w=600&h=400&fit=crop",
    ],
  },
  {
    id: 3, category: "food", title: "Late-Night Snack Box",
    desc: "Assorted chips, candy, ramen, and energy bars delivered to your dorm.",
    price: "$12", priceValue: 12, popularity: 88, listedDaysAgo: 1,
    seller: "Dorm Delivery Co.",
    images: [
      "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=600&h=400&fit=crop",
    ],
  },

  // School assignments
  {
    id: 4, category: "assignments", title: "Calculus Problem Set Help",
    desc: "Step-by-step solutions and tutoring for MATH 141 problem sets.",
    price: "$10/hr", priceValue: 10, popularity: 75, listedDaysAgo: 4,
    seller: "Aiden P.",
    images: [
      "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&h=400&fit=crop",
    ],
  },
  {
    id: 5, category: "assignments", title: "Essay Editing & Feedback",
    desc: "Grammar, structure, and citations reviewed within 24 hours.",
    price: "$5/essay", priceValue: 5, popularity: 70, listedDaysAgo: 3,
    seller: "Sophie L.",
    images: [
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1456324504439-367cee3b3c32?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1471107340929-a87cd0f5b5f3?w=600&h=400&fit=crop",
    ],
  },
  {
    id: 6, category: "assignments", title: "Lab Report Templates",
    desc: "Formatted APA/MLA lab report templates with example write-ups.",
    price: "$3", priceValue: 3, popularity: 45, listedDaysAgo: 12,
    seller: "Bio Study Group",
    images: [
      "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1554475901-4538ddfbccc2?w=600&h=400&fit=crop",
    ],
  },

  // Clothes
  {
    id: 7, category: "clothes", title: "Vintage Denim Jacket",
    desc: "Medium-wash denim jacket, size M. Lightly worn, no tears.",
    price: "$35", priceValue: 35, popularity: 83, listedDaysAgo: 5,
    seller: "Jordan R.",
    images: [
      "https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=600&h=400&fit=crop",
    ],
  },
  {
    id: 8, category: "clothes", title: "DLS Spirit Hoodie",
    desc: "Official green-and-silver school hoodie. New with tags, sizes S–XL.",
    price: "$40", priceValue: 40, popularity: 95, listedDaysAgo: 1,
    seller: "Campus Store",
    images: [
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1509942774463-acf339cf87d5?w=600&h=400&fit=crop",
    ],
  },
  {
    id: 9, category: "clothes", title: "Sneaker Cleaning Bundle",
    desc: "Brush, solution, and microfiber cloths — make white soles pop again.",
    price: "$14", priceValue: 14, popularity: 52, listedDaysAgo: 9,
    seller: "Fresh Kicks",
    images: [
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=600&h=400&fit=crop",
    ],
  },

  // Jobs
  {
    id: 10, category: "jobs", title: "Haircuts on Campus",
    desc: "Fade, trim, or buzz — book a 30-min slot in the student center.",
    price: "$15", priceValue: 15, popularity: 90, listedDaysAgo: 2,
    seller: "DeAndre W.",
    images: [
      "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&h=400&fit=crop",
    ],
  },
  {
    id: 11, category: "jobs", title: "Custom Artwork & Portraits",
    desc: "Digital or pencil portraits from your photo. Commissions open.",
    price: "$25+", priceValue: 25, popularity: 78, listedDaysAgo: 3,
    seller: "Lila K.",
    images: [
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=600&h=400&fit=crop",
    ],
  },
  {
    id: 12, category: "jobs", title: "Resume Design Service",
    desc: "Clean one-page resume layout + LinkedIn headline rewrite.",
    price: "$20", priceValue: 20, popularity: 66, listedDaysAgo: 7,
    seller: "Career Squad",
    images: [
      "https://images.unsplash.com/photo-1586281380349-7355532d4c65?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1586282391149-3c4f5b5c0d3e?w=600&h=400&fit=crop",
    ],
  },

  // Other
  {
    id: 13, category: "other", title: "TI-84 Plus Calculator",
    desc: "Graphing calculator in great shape. Perfect for AP/college math.",
    price: "$45", priceValue: 45, popularity: 72, listedDaysAgo: 8,
    seller: "Ryan M.",
    images: [
      "https://images.unsplash.com/photo-1564466809058-bf4114d55352?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1587145820266-a5951ee6f620?w=600&h=400&fit=crop",
    ],
  },
  {
    id: 14, category: "other", title: "Mini Fridge (Silver)",
    desc: "Compact 3.2 cu ft fridge, runs quietly. Pickup near North Hall.",
    price: "$60", priceValue: 60, popularity: 58, listedDaysAgo: 4,
    seller: "Graduating Senior",
    images: [
      "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=600&h=400&fit=crop",
    ],
  },
  {
    id: 15, category: "other", title: "Bike — Silver Hybrid",
    desc: "21-speed hybrid bike, recently tuned. Lock included.",
    price: "$85", priceValue: 85, popularity: 80, listedDaysAgo: 5,
    seller: "Chris V.",
    images: [
      "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=600&h=400&fit=crop",
    ],
  },
];

const CATEGORY_LABELS = {
  food: "Food",
  assignments: "Assignments",
  clothes: "Clothes",
  jobs: "Jobs",
  other: "Other",
};

const DEV_CODE = "spartan";
const LS_KEYS = {
  admin: "dls_admin",
  sellers: "dls_seller_whitelist",
  listings: "dls_custom_listings",
  trash: "dls_trash",
  overrides: "dls_listing_overrides",
};

// ===== State =====
let currentCategory = "all";
let currentSort = "featured";
let maxPrice = 100;
let currentUserStudentId = null;
let isAdmin = localStorage.getItem(LS_KEYS.admin) === "1";
let sellerWhitelist = loadJson(LS_KEYS.sellers, []);
let customListings = loadJson(LS_KEYS.listings, []);
let trash = loadJson(LS_KEYS.trash, []);
let listingOverrides = loadJson(LS_KEYS.overrides, {});
let editorMode = "create"; // "create" | "edit"
let editorListingId = null;
let editorImages = [];
let previewIdx = 0;

function loadJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    console.error("saveJson failed:", key, err);
    return false;
  }
}

function applyOverrides(listing) {
  const o = listingOverrides[listing.id];
  const merged = o ? { ...listing, ...o } : listing;
  if (!Number.isFinite(merged.priceValue)) {
    const parsed = parseFloat(String(merged.price ?? "").replace(/[^0-9.]/g, ""));
    merged.priceValue = Number.isFinite(parsed) ? parsed : 0;
  }
  if (!Array.isArray(merged.images)) merged.images = [];
  if (!merged.socials || typeof merged.socials !== "object") merged.socials = {};
  return merged;
}

function allListings() {
  const trashIds = new Set(trash.map((t) => t.listing.id));
  const base = LISTINGS.filter((l) => !trashIds.has(l.id)).map(applyOverrides);
  const custom = customListings.filter((l) => !trashIds.has(l.id)).map(applyOverrides);
  return [...custom, ...base];
}

function canEdit(listing) {
  if (isAdmin) return true;
  const uid = currentUserStudentId != null ? String(currentUserStudentId) : "";
  if (!uid) return false;
  if (listing.ownerId != null && String(listing.ownerId) === uid) return true;
  if (listing.custom && listing.ownerId == null && sellerWhitelist.includes(uid)) {
    return true;
  }
  return false;
}

function saveListingEdit(id, updates) {
  const existing = listingOverrides[id] || {};
  const merged = { ...existing, ...updates };
  if (merged.ownerId == null && currentUserStudentId != null) {
    merged.ownerId = String(currentUserStudentId);
  }
  listingOverrides[id] = merged;
  const ok = saveJson(LS_KEYS.overrides, listingOverrides);
  if (!ok) {
    delete listingOverrides[id];
    if (existing && Object.keys(existing).length) listingOverrides[id] = existing;
  }
  return ok;
}

function formatPhone(raw) {
  const d = String(raw).replace(/\D/g, "").slice(0, 11);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)}-${d.slice(3)}`;
  if (d.length <= 9) return `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6)}`;
  if (d.length === 10) return `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6, 10)}`;
  return `1-${d.slice(1, 4)}-${d.slice(4, 7)}-${d.slice(7, 11)}`;
}

// ===== DOM =====
const loginScreen = document.getElementById("login-screen");
const loginForm = document.getElementById("login-form");
const studentIdInput = document.getElementById("student-id");
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

const devCodeInput = document.getElementById("dev-code");
const devSubmit = document.getElementById("dev-submit");
const devStatus = document.getElementById("dev-status");
const adminPanel = document.getElementById("admin-panel");
const whitelistForm = document.getElementById("whitelist-form");
const whitelistIdInput = document.getElementById("whitelist-id");
const whitelistMsg = document.getElementById("whitelist-msg");
const whitelistList = document.getElementById("whitelist-list");
const createListingBtn = document.getElementById("create-listing-btn");
const createModal = document.getElementById("create-modal");
const createModalClose = document.getElementById("create-modal-close");
const createForm = document.getElementById("create-form");
const createError = document.getElementById("create-error");
const trashList = document.getElementById("trash-list");

// ===== Login =====
studentIdInput.addEventListener("input", () => {
  studentIdInput.value = studentIdInput.value.replace(/\D/g, "").slice(0, 5);
  loginError.hidden = true;
  studentIdInput.classList.remove("shake");
});

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const id = studentIdInput.value;
  if (!/^\d{5}$/.test(id)) {
    loginError.hidden = false;
    studentIdInput.classList.remove("shake");
    void studentIdInput.offsetWidth; // restart animation
    studentIdInput.classList.add("shake");
    return;
  }
  currentUserStudentId = id;
  userIdBadge.textContent = `ID ${id}`;
  loginScreen.hidden = true;
  app.hidden = false;
  refreshPermissions();
  window.scrollTo(0, 0);
});

logoutBtn.addEventListener("click", () => {
  currentUserStudentId = null;
  isAdmin = false;
  localStorage.removeItem(LS_KEYS.admin);
  app.hidden = true;
  loginScreen.hidden = false;
  studentIdInput.value = "";
  loginError.hidden = true;
  devCodeInput.value = "";
  devStatus.hidden = true;
  adminPanel.hidden = true;
  createListingBtn.hidden = true;
  createModal.hidden = true;
  renderListings();
});

// ===== Developer code =====
devSubmit.addEventListener("click", tryDevCode);
devCodeInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    tryDevCode();
  }
});

function tryDevCode() {
  if (devCodeInput.value.trim().toLowerCase() !== DEV_CODE) {
    showDevStatus("Incorrect code", false);
    devCodeInput.classList.remove("shake");
    void devCodeInput.offsetWidth;
    devCodeInput.classList.add("shake");
    return;
  }
  isAdmin = true;
  localStorage.setItem(LS_KEYS.admin, "1");
  devCodeInput.value = "";
  showDevStatus("Admin unlocked", true);
  refreshPermissions();
}

function showDevStatus(msg, ok) {
  devStatus.textContent = msg;
  devStatus.hidden = false;
  devStatus.classList.toggle("dev-status--ok", ok);
  devStatus.classList.toggle("dev-status--err", !ok);
}

// ===== Permissions =====
function refreshPermissions() {
  const isSeller =
    currentUserStudentId !== null && sellerWhitelist.includes(currentUserStudentId);

  adminPanel.hidden = !isAdmin;
  createListingBtn.hidden = !isSeller;

  if (isAdmin) {
    renderWhitelist();
    renderTrash();
  }
  renderListings();
}

// ===== Seller whitelist =====
whitelistForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const id = whitelistIdInput.value.trim();
  if (!/^\d{5}$/.test(id)) {
    showWhitelistMsg("Enter a valid 5-digit ID", false);
    return;
  }
  if (sellerWhitelist.includes(id)) {
    showWhitelistMsg(`${id} is already whitelisted`, false);
    return;
  }
  sellerWhitelist.push(id);
  saveJson(LS_KEYS.sellers, sellerWhitelist);
  whitelistIdInput.value = "";
  showWhitelistMsg(`${id} can now sell products`, true);
  renderWhitelist();
  refreshPermissions();
});

function showWhitelistMsg(msg, ok) {
  whitelistMsg.textContent = msg;
  whitelistMsg.hidden = false;
  whitelistMsg.classList.toggle("whitelist-msg--ok", ok);
  whitelistMsg.classList.toggle("whitelist-msg--err", !ok);
}

function renderWhitelist() {
  whitelistList.innerHTML = "";
  if (sellerWhitelist.length === 0) {
    whitelistList.innerHTML = '<li class="whitelist-empty">No sellers whitelisted yet.</li>';
    return;
  }
  sellerWhitelist.forEach((id) => {
    const li = document.createElement("li");
    li.className = "whitelist-item";
    li.innerHTML = `
      <span>${escapeHtml(id)}</span>
      <button type="button" class="whitelist-remove" data-id="${escapeHtml(id)}" aria-label="Remove ${escapeHtml(id)}">Remove</button>
    `;
    whitelistList.appendChild(li);
  });

  whitelistList.querySelectorAll(".whitelist-remove").forEach((btn) => {
    btn.addEventListener("click", () => {
      sellerWhitelist = sellerWhitelist.filter((id) => id !== btn.dataset.id);
      saveJson(LS_KEYS.sellers, sellerWhitelist);
      renderWhitelist();
      refreshPermissions();
    });
  });
}

// ===== Create / edit product (live preview) =====
const photoThumbs = document.getElementById("photo-thumbs");
const imageFilesInput = document.getElementById("create-image-files");
const imageUrlInput = document.getElementById("create-image-url");
const addUrlBtn = document.getElementById("add-url-btn");
const livePreview = document.getElementById("live-preview");
const createModalTitle = document.getElementById("create-modal-title");
const createSubmitBtn = document.querySelector(".create-submit");
const createCancelBtn = document.getElementById("create-cancel");
const createPhoneInput = document.getElementById("create-phone");

createListingBtn.addEventListener("click", () => openEditor("create"));

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

function openEditor(mode, listing) {
  editorMode = mode;
  editorListingId = mode === "edit" && listing ? listing.id : null;
  previewIdx = 0;
  createError.hidden = true;

  if (mode === "edit" && listing) {
    createModalTitle.textContent = "Edit Product";
    createSubmitBtn.textContent = "Save changes";
    document.getElementById("create-title").value = listing.title;
    document.getElementById("create-desc").value = listing.desc;
    const pv = listing.priceValue != null ? listing.priceValue : parseFloat(String(listing.price).replace(/[^0-9.]/g, ""));
    document.getElementById("create-price").value = Number.isFinite(pv) ? pv : "";
    document.getElementById("create-category").value = listing.category;
    document.getElementById("create-seller-name").value =
      listing.sellerName || listing.seller || "";
    const s = listing.socials || {};
    document.getElementById("create-instagram").value = s.instagram || "";
    document.getElementById("create-email").value = s.email || "";
    document.getElementById("create-phone").value = s.phone || "";
    document.getElementById("create-other-social").value = s.other || "";
    editorImages = Array.isArray(listing.images) ? [...listing.images] : [];
  } else {
    createModalTitle.textContent = "Create Product";
    createSubmitBtn.textContent = "Add to marketplace";
    createForm.reset();
    document.getElementById("create-category").value = "food";
    editorImages = [];
  }

  imageUrlInput.value = "";
  renderPhotoThumbs();
  updateLivePreview();
  createModal.hidden = false;
  document.getElementById("create-title").focus();
}

// Phone auto-format while typing
createPhoneInput.addEventListener("input", () => {
  createPhoneInput.value = formatPhone(createPhoneInput.value);
});

// Multi-photo upload
imageFilesInput.addEventListener("change", async (e) => {
  const files = Array.from(e.target.files || []);
  for (const file of files) {
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

addUrlBtn.addEventListener("click", () => {
  const url = imageUrlInput.value.trim();
  if (!url) return;
  editorImages.push(url);
  imageUrlInput.value = "";
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
  const price = Number.isFinite(priceNum) && priceVal !== "" ? `$${priceNum}` : "$0";
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
      <span class="listing-cta listing-cta--preview">Contact seller</span>
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
  const desc = document.getElementById("create-desc").value.trim();
  const priceNum = Number(document.getElementById("create-price").value);
  const category = document.getElementById("create-category").value;
  const sellerName = document.getElementById("create-seller-name").value.trim();
  const instagram = document.getElementById("create-instagram").value.trim();
  const email = document.getElementById("create-email").value.trim();
  const phone = document.getElementById("create-phone").value.trim();
  const otherSocial = document.getElementById("create-other-social").value.trim();

  if (!title || !desc || !sellerName || Number.isNaN(priceNum) || priceNum < 0) {
    showCreateError("Fill in name, description, seller name, and a valid price.");
    return;
  }
  if (editorImages.length === 0) {
    showCreateError("Add at least one photo.");
    return;
  }

  const socials = {};
  if (instagram) socials.instagram = instagram.replace(/^@/, "");
  if (email) socials.email = email;
  if (phone) socials.phone = formatPhone(phone);
  if (otherSocial) socials.other = otherSocial;

  const storageFullMsg =
    "Couldn't save — browser storage is full. Remove a few photos (× on thumbnails) and try again.";

  let images = editorImages;
  if (images.some(needsShrink)) {
    try {
      images = await shrinkLargeImages(images);
    } catch {
      images = editorImages;
    }
  }

  const updates = {
    category,
    title,
    desc,
    price: `$${priceNum}`,
    priceValue: priceNum,
    seller: sellerName,
    sellerName,
    socials,
    images,
  };

  if (editorMode === "edit" && editorListingId != null) {
    if (!saveListingEdit(editorListingId, updates)) {
      showCreateError(storageFullMsg);
      return;
    }
    createModal.hidden = true;
    renderListings();
    return;
  }

  const listing = {
    id: Date.now(),
    ...updates,
    popularity: 0,
    listedDaysAgo: 0,
    ownerId: currentUserStudentId,
    custom: true,
  };

  customListings.unshift(listing);
  if (!saveJson(LS_KEYS.listings, customListings)) {
    customListings.shift();
    showCreateError(storageFullMsg);
    return;
  }

  createModal.hidden = true;

  const tab = document.querySelector(`.tab-btn[data-category="${category}"]`);
  if (tab) tab.click();
  else renderListings();
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

// Downscale an already-stored data URL (legacy listings hold full-res photos)
const IMAGE_OVERSIZE = 400 * 1024; // base64 chars ≈ bytes for ASCII

function needsShrink(src) {
  return typeof src === "string" && src.startsWith("data:image/") && src.length > IMAGE_OVERSIZE;
}

async function shrinkLargeImages(images) {
  const out = [];
  for (const src of images) {
    if (needsShrink(src)) {
      try {
        out.push(await compressDataUrl(src));
        continue;
      } catch {
        /* fall through to original */
      }
    }
    out.push(src);
  }
  return out;
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

// ===== Remove / restore (admin) =====
function removeListing(id) {
  const source = allListings();
  const listing = source.find((l) => l.id === id);
  if (!listing) return;

  trash.unshift({
    listing,
    removedAt: Date.now(),
    removedBy: currentUserStudentId || "dev",
  });
  saveJson(LS_KEYS.trash, trash);
  renderTrash();
  renderListings();
}

function restoreListing(index) {
  const entry = trash[index];
  if (!entry) return;
  const snap = entry.listing;

  const ci = customListings.findIndex((l) => l.id === snap.id);
  if (ci >= 0) {
    customListings[ci] = { ...customListings[ci], ...snap };
    saveJson(LS_KEYS.listings, customListings);
  } else if (!LISTINGS.some((l) => l.id === snap.id)) {
    customListings.unshift(snap);
    saveJson(LS_KEYS.listings, customListings);
  } else {
    const { id, ...rest } = snap;
    listingOverrides[id] = { ...(listingOverrides[id] || {}), ...rest };
    saveJson(LS_KEYS.overrides, listingOverrides);
  }

  trash.splice(index, 1);
  saveJson(LS_KEYS.trash, trash);
  renderTrash();
  renderListings();
}

function renderTrash() {
  trashList.innerHTML = "";
  if (trash.length === 0) {
    trashList.innerHTML = '<li class="whitelist-empty">Nothing removed yet.</li>';
    return;
  }
  trash.forEach((entry, index) => {
    const li = document.createElement("li");
    li.className = "trash-item";
    const when = new Date(entry.removedAt).toLocaleString();
    li.innerHTML = `
      <div class="trash-info">
        <span class="trash-title">${escapeHtml(entry.listing.title)}</span>
        <span class="trash-meta">${escapeHtml(entry.listing.seller)} · removed ${escapeHtml(when)}</span>
      </div>
      <button type="button" class="trash-restore" data-index="${index}">Restore</button>
    `;
    trashList.appendChild(li);
  });

  trashList.querySelectorAll(".trash-restore").forEach((btn) => {
    btn.addEventListener("click", () => restoreListing(Number(btn.dataset.index)));
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
  priceRangeLabel.textContent = maxPrice;
  renderListings();
});

function sortItems(items) {
  const sorted = [...items];
  switch (currentSort) {
    case "cheapest":
      sorted.sort((a, b) => a.priceValue - b.priceValue);
      break;
    case "expensive":
      sorted.sort((a, b) => b.priceValue - a.priceValue);
      break;
    case "popular":
      sorted.sort((a, b) => b.popularity - a.popularity);
      break;
    case "newest":
      sorted.sort((a, b) => a.listedDaysAgo - b.listedDaysAgo);
      break;
    case "az":
      sorted.sort((a, b) => a.title.localeCompare(b.title));
      break;
    default:
      break; // featured = original order
  }
  return sorted;
}

// ===== Render listings =====
function renderListings() {
  const source = allListings();
  let items =
    currentCategory === "all"
      ? source
      : source.filter((l) => l.category === currentCategory);

  items = items.filter((l) => l.priceValue <= maxPrice);
  items = sortItems(items);

  grid.innerHTML = "";
  emptyState.hidden = items.length > 0;

  items.forEach((listing, index) => {
    const card = document.createElement("article");
    card.className = "listing-card";
    card.style.animationDelay = `${index * 60}ms`;
    const editable = canEdit(listing);
    card.innerHTML = `
      <div class="listing-actions">
        ${
          editable
            ? `<button class="listing-edit" data-id="${listing.id}" aria-label="Edit ${escapeHtml(listing.title)}" title="Edit listing">&#9998;</button>`
            : ""
        }
        ${
          isAdmin
            ? `<button class="listing-delete" data-id="${listing.id}" aria-label="Remove ${escapeHtml(listing.title)}" title="Remove listing">&times;</button>`
            : ""
        }
      </div>
      <div class="listing-thumb carousel" data-carousel>
        <div class="carousel-track">
          ${listing.images
            .map(
              (src) =>
                `<img src="${src}" alt="${escapeHtml(listing.title)}" loading="lazy" />`
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
        <p class="listing-desc">${escapeHtml(listing.desc)}</p>
        <div class="listing-meta">
          <span class="listing-price">${escapeHtml(listing.price)}</span>
          <span class="listing-seller">${escapeHtml(listing.sellerName || listing.seller)}</span>
        </div>
        <button class="listing-cta" type="button">Contact seller</button>
      </div>
    `;
    grid.appendChild(card);

    if (listing.images.length > 1) setupCarousel(card.querySelector("[data-carousel]"));

    card.querySelector(".listing-cta").addEventListener("click", () => {
      openContactModal(listing);
    });
  });

  grid.querySelectorAll(".listing-delete").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      removeListing(Number(btn.dataset.id));
    });
  });

  grid.querySelectorAll(".listing-edit").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const listing = allListings().find((l) => l.id === Number(btn.dataset.id));
      if (listing && canEdit(listing)) openEditor("edit", listing);
    });
  });
}

// ===== Contact modal =====
const contactModal = document.getElementById("contact-modal");
const contactModalClose = document.getElementById("contact-modal-close");
const contactSellerName = document.getElementById("contact-seller-name");
const contactPrimary = document.getElementById("contact-primary");
const contactApps = document.getElementById("contact-apps");
const contactPlain = document.getElementById("contact-plain");
const contactNone = document.getElementById("contact-none");

contactModalClose.addEventListener("click", () => {
  contactModal.hidden = true;
});
contactModal.addEventListener("click", (e) => {
  if (e.target === contactModal) contactModal.hidden = true;
});

function openContactModal(listing) {
  const s = listing.socials || {};
  const seller = listing.sellerName || listing.seller;
  contactSellerName.textContent = seller;

  const igHandle = s.instagram ? s.instagram.replace(/^@/, "") : "";
  const email = s.email || "";

  // Primary line: Instagram handle or email (whichever exists — IG first)
  if (igHandle) {
    contactPrimary.textContent = `@${igHandle}`;
    contactPrimary.hidden = false;
  } else if (email) {
    contactPrimary.textContent = email;
    contactPrimary.hidden = false;
  } else {
    contactPrimary.hidden = true;
    contactPrimary.textContent = "";
  }

  // App icon buttons
  contactApps.innerHTML = "";
  const apps = [];

  if (igHandle) {
    apps.push({
      key: "instagram",
      label: "Instagram",
      href: `https://instagram.com/${encodeURIComponent(igHandle)}`,
      icon: ICONS.instagram,
      cls: "app-btn--instagram",
    });
  }

  if (email) {
    const provider = emailProvider(email);
    apps.push({
      key: "email",
      label: provider.label,
      href: `mailto:${email}`,
      icon: provider.icon,
      cls: provider.cls,
    });
  }

  apps.forEach((app) => {
    const a = document.createElement("a");
    a.className = `app-btn ${app.cls}`;
    a.href = app.href;
    a.target = app.key === "email" ? "_self" : "_blank";
    a.rel = "noopener";
    a.innerHTML = `${app.icon}<span class="app-btn-label">${escapeHtml(app.label)}</span>`;
    contactApps.appendChild(a);
  });

  // Plain (non-clickable) contact info
  contactPlain.innerHTML = "";
  const plainParts = [];
  if (s.phone) {
    plainParts.push(
      `<div class="contact-plain-row"><span class="contact-plain-label">Phone</span><span>${escapeHtml(formatPhone(s.phone))}</span></div>`
    );
  }
  if (s.other) {
    plainParts.push(
      `<div class="contact-plain-row"><span class="contact-plain-label">Other</span><span>${escapeHtml(s.other)}</span></div>`
    );
  }
  contactPlain.innerHTML = plainParts.join("");

  const hasAny = apps.length > 0 || plainParts.length > 0;
  contactNone.hidden = hasAny;
  contactApps.hidden = apps.length === 0;
  contactPlain.hidden = plainParts.length === 0;

  contactModal.hidden = false;
}

function emailProvider(email) {
  const domain = (email.split("@")[1] || "").toLowerCase();
  if (domain === "gmail.com") {
    return { label: "Gmail", icon: ICONS.gmail, cls: "app-btn--gmail" };
  }
  if (domain === "outlook.com" || domain === "hotmail.com" || domain === "live.com") {
    return { label: "Outlook", icon: ICONS.outlook, cls: "app-btn--outlook" };
  }
  if (domain === "yahoo.com" || domain === "ymail.com") {
    return { label: "Yahoo Mail", icon: ICONS.yahoo, cls: "app-btn--yahoo" };
  }
  if (domain === "icloud.com" || domain === "me.com" || domain === "mac.com") {
    return { label: "iCloud Mail", icon: ICONS.icloud, cls: "app-btn--icloud" };
  }
  return { label: "Mail", icon: ICONS.mail, cls: "app-btn--mail" };
}

const ICONS = {
  instagram: `<svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="6" fill="#E1306C"/><rect x="5" y="5" width="14" height="14" rx="4" fill="none" stroke="#fff" stroke-width="2"/><circle cx="12" cy="12" r="3.5" fill="none" stroke="#fff" stroke-width="2"/><circle cx="17.2" cy="6.8" r="1.3" fill="#fff"/></svg>`,
  gmail: `<svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true"><path fill="#4285F4" d="M2 8.5V18a2 2 0 0 0 2 2h3v-8.7L12 15.5l5-6.2V20h3a2 2 0 0 0 2-2V8.5L12 15 2 8.5z"/><path fill="#34A853" d="M2 8.5 6 11.5V20H4a2 2 0 0 1-2-2V8.5z"/><path fill="#FBBC05" d="M22 8.5 18 11.5V20h2a2 2 0 0 0 2-2V8.5z"/><path fill="#EA4335" d="M2 6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v2.5L12 15 2 8.5V6z"/></svg>`,
  outlook: `<svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="3" fill="#0078D4"/><path fill="#fff" d="M5 8.5h7.5v2H5zm0 3.5h7.5v2H5z"/><ellipse cx="17" cy="11.5" rx="3.5" ry="4.5" fill="#28A8EA"/><ellipse cx="17" cy="11.5" rx="1.8" ry="2.4" fill="#0078D4"/></svg>`,
  yahoo: `<svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="3" fill="#6001D2"/><path fill="#fff" d="M5.5 8h2.2L10 11.4 12.3 8H14.5l-3.5 5.2V17H9.4v-3.8z"/><path fill="#fff" d="M15.5 8H17.3V15c0 1.2.5 1.8 1.5 1.8.4 0 .8-.1 1.1-.2v1.5c-.4.2-1 .4-1.6.4-1.6 0-2.8-1.1-2.8-3.2z"/></svg>`,
  icloud: `<svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="3" fill="#3693F3"/><path fill="#fff" d="M7.5 15a3 3 0 0 1 .3-6 4 4 0 0 1 7.6 1 2.6 2.6 0 0 1-.4 5H7.5z"/></svg>`,
  mail: `<svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="3" fill="#5F6368"/><path fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M4 7.5 12 13.5 20 7.5"/></svg>`,
};

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

// Initial render (hidden until login, but ready)
renderListings();
