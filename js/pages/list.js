import { loadComponent } from "../utils/loader.js";
import { buildCard } from "../utils/book-card.js";

let allBooks = [];
let currentFilter = 'all';
let currentSort = 'featured';

function parsePrice(priceStr) {
  if (!priceStr) return 0;
  return parseFloat(priceStr.replace('$', ''));
}

function renderBooks() {
  const grid = document.getElementById("list-grid");
  if (!grid) return;

  // Filter
  let filtered = allBooks;
  if (currentFilter !== 'all') {
    filtered = allBooks.filter(book => book.category === currentFilter);
  }

  // Sort
  if (currentSort === 'price-low') {
    filtered.sort((a, b) => parsePrice(a.priceSale) - parsePrice(b.priceSale));
  } else if (currentSort === 'price-high') {
    filtered.sort((a, b) => parsePrice(b.priceSale) - parsePrice(a.priceSale));
  } else if (currentSort === 'newest') {
    // Just put 'new' tag first for simplicity, then the rest
    filtered.sort((a, b) => {
      if (a.tag === 'new' && b.tag !== 'new') return -1;
      if (a.tag !== 'new' && b.tag === 'new') return 1;
      return 0;
    });
  } else {
    // Featured - just use original order or maybe bestseller first
    // For this mock, we'll revert to original index or sort by rating
    // It's simplest to just keep them as they are in the JSON if featured
    // Let's sort by rating high to low for "featured" as a fallback if needed
  }

  grid.innerHTML = filtered.map(buildCard).join("");
  
  // Update count
  const countEl = document.getElementById("book-count");
  if (countEl) {
    countEl.textContent = `${filtered.length} title${filtered.length !== 1 ? 's' : ''} in the collection`;
  }
}

function setupFilters() {
  const buttons = document.querySelectorAll(".filter-pill");
  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      // Update active class
      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      
      currentFilter = btn.dataset.filter;
      renderBooks();
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
  options.forEach(opt => {
    opt.addEventListener("click", () => {
      // Remove active class from all options
      options.forEach(o => o.classList.remove("active"));
      // Set active class
      opt.classList.add("active");
      
      // Update trigger label
      triggerLabel.textContent = opt.textContent;
      
      // Update currentSort and render
      currentSort = opt.dataset.value;
      renderBooks();
      
      // Close dropdown
      selectEl.classList.remove("open");
    });
  });

  // Close dropdown when clicking outside
  document.addEventListener("click", () => {
    selectEl.classList.remove("open");
  });
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

    // Parse URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const filterParam = urlParams.get('filter');
    const sortParam = urlParams.get('sort');

    if (filterParam) {
      currentFilter = filterParam;
      const buttons = document.querySelectorAll(".filter-pill");
      buttons.forEach(btn => {
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
        options.forEach(opt => {
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
      links.forEach(link => {
        link.classList.remove("active");
        const href = link.getAttribute("href");
        if (filterParam && href.includes(`filter=${filterParam}`)) {
          link.classList.add("active");
        } else if (!filterParam && href.includes("list.html") && !href.includes("filter=")) {
          link.classList.add("active");
        }
      });
    }

    renderBooks();

  } catch (error) {
    console.error("Error loading application components:", error);
  }
});
