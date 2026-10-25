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

// ===== State =====
let currentCategory = "all";
let currentSort = "featured";
let maxPrice = 100;

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
  userIdBadge.textContent = `ID ${id}`;
  loginScreen.hidden = true;
  app.hidden = false;
  window.scrollTo(0, 0);
});

logoutBtn.addEventListener("click", () => {
  app.hidden = true;
  loginScreen.hidden = false;
  studentIdInput.value = "";
  loginError.hidden = true;
});

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
  let items =
    currentCategory === "all"
      ? LISTINGS
      : LISTINGS.filter((l) => l.category === currentCategory);

  items = items.filter((l) => l.priceValue <= maxPrice);
  items = sortItems(items);

  grid.innerHTML = "";
  emptyState.hidden = items.length > 0;

  items.forEach((listing, index) => {
    const card = document.createElement("article");
    card.className = "listing-card";
    card.style.animationDelay = `${index * 60}ms`;
    card.innerHTML = `
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
          <span class="listing-seller">${escapeHtml(listing.seller)}</span>
        </div>
        <button class="listing-cta">Contact seller</button>
      </div>
    `;
    grid.appendChild(card);

    if (listing.images.length > 1) setupCarousel(card.querySelector("[data-carousel]"));
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

// Initial render (hidden until login, but ready)
renderListings();
