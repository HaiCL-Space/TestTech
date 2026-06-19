import { loadComponent } from "../utils/loader.js";
import { buildCard } from "../utils/book-card.js";

// DOM Elements
const breadcrumbTitle = document.getElementById("breadcrumb-title");
const detailCoverBg = document.getElementById("detail-cover-bg");
const detailTag = document.getElementById("detail-tag");
const coverTitleText = document.getElementById("cover-title-text");
const coverAuthorText = document.getElementById("cover-author-text");

const detailGenreBadge = document.getElementById("detail-genre-badge");
const detailTitleText = document.getElementById("detail-title-text");
const detailAuthorText = document.getElementById("detail-author-text");
const detailRatingVal = document.getElementById("detail-rating-val");
const detailPagesVal = document.getElementById("detail-pages-val");
const detailYearVal = document.getElementById("detail-year-val");

const detailPriceSaleVal = document.getElementById("detail-price-sale-val");
const detailPriceOriginalVal = document.getElementById("detail-price-original-val");
const detailDescriptionVal = document.getElementById("detail-description-val");

const addToBagBtn = document.getElementById("add-to-bag-btn");
const wishlistBtn = document.getElementById("wishlist-btn");

const specFormat = document.getElementById("spec-format");
const specPages = document.getElementById("spec-pages");
const specPublished = document.getElementById("spec-published");
const specPublisher = document.getElementById("spec-publisher");
const specLanguage = document.getElementById("spec-language");
const specISBN = document.getElementById("spec-isbn");

const relatedGrid = document.getElementById("related-grid");

// Data State
let currentBook = null;
let allBooks = [];

async function loadBookData() {
  const res = await fetch("./data/list-data.json");
  const data = await res.json();
  allBooks = data.allBooks || [];
  
  // Parse URL parameter
  const urlParams = new URLSearchParams(window.location.search);
  const titleParam = urlParams.get("title");
  
  if (titleParam) {
    currentBook = allBooks.find(
      (b) => b.title.toLowerCase() === titleParam.toLowerCase()
    );
  }
  
  // Fallback to "The Lighthouse Keeper" if not found
  if (!currentBook) {
    currentBook = allBooks.find((b) => b.title === "The Lighthouse Keeper") || allBooks[0];
  }
  
  populatePage(currentBook);
  renderRelatedBooks(currentBook);
  updateActiveNavigation(currentBook);
}

function populatePage(book) {
  if (!book) return;
  
  // Document Title
  document.title = `${book.title} - Pages & Co. Bookstore`;
  
  // Breadcrumbs
  breadcrumbTitle.textContent = book.title;
  
  // Cover Card Area
  detailCoverBg.className = `book-cover ${book.coverColor || 'color-green'}`;
  coverTitleText.textContent = book.title;
  coverAuthorText.textContent = book.author;
  
  if (book.tag) {
    detailTag.textContent = book.tag.toUpperCase();
    detailTag.className = `cover-tag tag-${book.tag}`;
    detailTag.style.display = 'block';
  } else {
    detailTag.style.display = 'none';
  }
  
  // Info Column Text
  detailGenreBadge.textContent = (book.category || 'fiction').toUpperCase();
  detailTitleText.textContent = book.title;
  detailAuthorText.textContent = `by ${book.author}`;
  detailRatingVal.textContent = book.rating || '0.0';
  
  const pagesCount = book.pages || 300;
  const publishedYear = book.published || 2023;
  detailPagesVal.textContent = `${pagesCount} pages`;
  detailYearVal.textContent = publishedYear;
  
  // Pricing
  detailPriceSaleVal.textContent = book.priceSale;
  addToBagBtn.textContent = `Add to bag — ${book.priceSale}`;
  
  if (book.priceOriginal) {
    detailPriceOriginalVal.textContent = book.priceOriginal;
    detailPriceOriginalVal.style.display = 'inline';
  } else {
    detailPriceOriginalVal.style.display = 'none';
  }
  
  // Description
  detailDescriptionVal.textContent = book.description || 
    `A widowed keeper and a runaway girl share a winter on a remote island, learning what it means to keep a light burning for someone else.`;
  
  // Spec Sheet Grid
  specFormat.textContent = book.format || "Paperback";
  specPages.textContent = pagesCount;
  specPublished.textContent = publishedYear;
  specPublisher.textContent = book.publisher || "Harbor & Vale";
  specLanguage.textContent = book.language || "English";
  specISBN.textContent = book.isbn || "978-1-23456-001-2";
}

function renderRelatedBooks(book) {
  if (!relatedGrid || !book) return;
  
  // Filter books by same category, exclude the current book, slice 2
  const related = allBooks
    .filter((b) => b.category === book.category && b.title !== book.title)
    .slice(0, 2);
  
  // If we don't have enough matching books, add some backup books
  if (related.length < 2) {
    const fill = allBooks
      .filter((b) => b.title !== book.title && !related.some((r) => r.title === b.title))
      .slice(0, 2 - related.length);
    related.push(...fill);
  }
  
  relatedGrid.innerHTML = related.map(buildCard).join("");
}

function updateActiveNavigation(book) {
  const headerNav = document.querySelector(".header-nav");
  if (headerNav && book) {
    const links = headerNav.querySelectorAll(".nav-link");
    links.forEach((link) => {
      link.classList.remove("active");
      const href = link.getAttribute("href");
      if (href.includes(`filter=${book.category}`)) {
        link.classList.add("active");
      }
    });
  }
}

function setupActions() {
  if (!addToBagBtn || !wishlistBtn) return;

  // Add to Bag Click
  addToBagBtn.addEventListener("click", () => {
    // Dispatch bag counter update event (handled by site-header)
    window.dispatchEvent(new CustomEvent("bag-updated", { detail: { count: 1 } }));
    
    // Visual feedback on button
    const oldText = addToBagBtn.textContent;
    addToBagBtn.textContent = "Added to bag!";
    addToBagBtn.style.backgroundColor = "var(--color-green)";
    addToBagBtn.style.boxShadow = "0 4px 14px rgba(43, 76, 63, 0.25)";
    addToBagBtn.disabled = true;
    
    setTimeout(() => {
      addToBagBtn.textContent = oldText;
      addToBagBtn.style.backgroundColor = "";
      addToBagBtn.style.boxShadow = "";
      addToBagBtn.disabled = false;
    }, 1500);
  });
  
  // Wishlist Toggle Click
  wishlistBtn.addEventListener("click", () => {
    wishlistBtn.classList.toggle("active");
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  try {
    // Load common components
    await loadComponent("#header-root", "site-header");
    await loadComponent("#footer-root", "site-footer");
    
    // Load book data
    await loadBookData();
    
    // Set up click handlers
    setupActions();
  } catch (error) {
    console.error("Error loading application components:", error);
  }
});
