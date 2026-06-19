import { loadComponent } from "../utils/loader.js";
import { buildCard } from "../utils/book-card.js";

let allBooks = [];
let currentFilter = "all";
let currentSort = "featured";

function parsePrice(priceStr) {
  if (!priceStr) return 0;
  return parseFloat(priceStr.replace("$", ""));
}

function renderBooks() {
  const grid = document.getElementById("list-grid");
  if (!grid) return;

  // Filter
  let filtered = allBooks;
  if (currentFilter !== "all") {
    filtered = allBooks.filter((book) => book.category === currentFilter);
  }

  // Sort
  if (currentSort === "price-low") {
    filtered.sort((a, b) => parsePrice(a.priceSale) - parsePrice(b.priceSale));
  } else if (currentSort === "price-high") {
    filtered.sort((a, b) => parsePrice(b.priceSale) - parsePrice(a.priceSale));
  } else if (currentSort === "newest") {
    filtered.sort((a, b) => {
      if (a.tag === "new" && b.tag !== "new") return -1;
      if (a.tag !== "new" && b.tag === "new") return 1;
      return 0;
    });
  } else {
  }

  grid.innerHTML = filtered.map(buildCard).join("");

  // Update count
  const countEl = document.getElementById("book-count");
  if (countEl) {
    countEl.textContent = `${filtered.length} title${filtered.length !== 1 ? "s" : ""} in the collection`;
  }
}

function closeDrawerIfMobile() {
  if (window.innerWidth <= 768) {
    const drawer = document.getElementById("controls-drawer");
    const overlay = document.getElementById("drawer-overlay");
    if (drawer && overlay) {
      drawer.classList.remove("open");
      overlay.classList.remove("open");
      document.body.style.overflow = "";
    }
  }
}

function setupFilters() {
  const buttons = document.querySelectorAll(".filter-pill");
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      // Update active class
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      currentFilter = btn.dataset.filter;
      renderBooks();
      closeDrawerIfMobile();
    });
  });
}

function setupSort() {
  const selectEl = document.getElementById("sort-select");
  if (!selectEl) return;

  const trigger = selectEl.querySelector(".custom-select-trigger");
  const triggerLabel = selectEl.querySelector("#sort-trigger-label");
  const options = selectEl.querySelectorAll(".custom-option");

  // Toggle dropdown open class
  trigger.addEventListener("click", (e) => {
    e.stopPropagation();
    selectEl.classList.toggle("open");
  });

  // Handle option click
  options.forEach((opt) => {
    opt.addEventListener("click", () => {
      // Remove active class from all options
      options.forEach((o) => o.classList.remove("active"));
      // Set active class
      opt.classList.add("active");

      // Update trigger label
      triggerLabel.textContent = opt.textContent;

      // Update currentSort and render
      currentSort = opt.dataset.value;
      renderBooks();

      // Close dropdown
      selectEl.classList.remove("open");
      closeDrawerIfMobile();
    });
  });

  // Close dropdown when clicking outside
  document.addEventListener("click", () => {
    selectEl.classList.remove("open");
  });
}

function setupResponsiveDrawer() {
  const openBtn = document.getElementById("mobile-filters-btn");
  const closeBtn = document.getElementById("drawer-close-btn");
  const overlay = document.getElementById("drawer-overlay");
  const drawer = document.getElementById("controls-drawer");

  if (!openBtn || !closeBtn || !overlay || !drawer) return;

  function openDrawer() {
    drawer.classList.add("open");
    overlay.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeDrawer() {
    drawer.classList.remove("open");
    overlay.classList.remove("open");
    document.body.style.overflow = "";
  }

  openBtn.addEventListener("click", openDrawer);
  closeBtn.addEventListener("click", closeDrawer);
  overlay.addEventListener("click", closeDrawer);
}

document.addEventListener("DOMContentLoaded", async () => {
  try {
    // Load common components
    await loadComponent("#header-root", "site-header");
    await loadComponent("#footer-root", "site-footer");

    // Load data
    const res = await fetch("./data/list-data.json");
    const data = await res.json();
    allBooks = data.allBooks || [];

    // Initialize list
    setupFilters();
    setupSort();
    setupResponsiveDrawer();

    // Parse URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const filterParam = urlParams.get("filter");
    const sortParam = urlParams.get("sort");

    if (filterParam) {
      currentFilter = filterParam;
      const buttons = document.querySelectorAll(".filter-pill");
      buttons.forEach((btn) => {
        if (btn.dataset.filter === filterParam) {
          btn.classList.add("active");
        } else {
          btn.classList.remove("active");
        }
      });
    }

    if (sortParam) {
      currentSort = sortParam;
      const select = document.getElementById("sort-select");
      if (select) {
        const options = select.querySelectorAll(".custom-option");
        const triggerLabel = select.querySelector("#sort-trigger-label");
        options.forEach((opt) => {
          if (opt.dataset.value === sortParam) {
            opt.classList.add("active");
            if (triggerLabel) triggerLabel.textContent = opt.textContent;
          } else {
            opt.classList.remove("active");
          }
        });
      }
    }

    // Update active nav-link in header based on current category
    const headerNav = document.querySelector(".header-nav");
    if (headerNav) {
      const links = headerNav.querySelectorAll(".nav-link");
      links.forEach((link) => {
        link.classList.remove("active");
        const href = link.getAttribute("href");
        if (filterParam && href.includes(`filter=${filterParam}`)) {
          link.classList.add("active");
        } else if (
          !filterParam &&
          href.includes("list.html") &&
          !href.includes("filter=")
        ) {
          link.classList.add("active");
        }
      });
    }

    renderBooks();
  } catch (error) {
    console.error("Error loading application components:", error);
  }
});
