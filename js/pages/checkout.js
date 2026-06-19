import { loadComponent } from "../utils/loader.js";
import { getBag, updateQuantity, removeFromBag, clearBag } from "../utils/bag.js";

// DOM Elements
const bagItemsList = document.getElementById("bag-items-list");
const emptyBagState = document.getElementById("empty-bag-state");
const summarySidebar = document.getElementById("summary-sidebar");

const subtotalLabel = document.getElementById("subtotal-label");
const subtotalValue = document.getElementById("subtotal-value");
const totalValue = document.getElementById("total-value");
const checkoutBtn = document.getElementById("checkout-btn");

// Parse price string to number (e.g. "$18.00" -> 18)
const parsePrice = (priceStr) => {
  if (!priceStr) return 0;
  return parseFloat(priceStr.replace(/[^0-9.]/g, ""));
};

// Format number to price string (e.g. 18 -> "$18.00")
const formatPrice = (priceNum) => {
  return `$${priceNum.toFixed(2)}`;
};

function renderCheckout() {
  const items = getBag();

  if (items.length === 0) {
    // Show empty bag state
    bagItemsList.style.display = "none";
    summarySidebar.style.display = "none";
    emptyBagState.style.display = "flex";
    return;
  }

  // Hide empty state and show list/sidebar
  emptyBagState.style.display = "none";
  bagItemsList.style.display = "block";
  summarySidebar.style.display = "block";

  // Build the list HTML
  bagItemsList.innerHTML = items
    .map((item) => {
      const itemPriceTotal = parsePrice(item.priceSale) * item.quantity;
      return `
        <div class="bag-item-card" data-title="${item.title}">
          <div class="bag-item-cover-wrapper">
            <div class="bag-item-cover ${item.coverColor || 'color-green'}"></div>
          </div>
          <div class="bag-item-info">
            <div class="bag-item-title">${item.title}</div>
            <div class="bag-item-author">${item.author}</div>
            <button class="bag-item-remove" data-action="remove">Remove</button>
          </div>
          <div class="quantity-selector">
            <button class="btn-qty" data-action="dec">&minus;</button>
            <span class="qty-value">${item.quantity}</span>
            <button class="btn-qty" data-action="inc">&plus;</button>
          </div>
          <div class="bag-item-price">${formatPrice(itemPriceTotal)}</div>
        </div>
      `;
    })
    .join("");

  // Calculate totals
  let totalItemsCount = 0;
  let subtotal = 0;

  items.forEach((item) => {
    totalItemsCount += item.quantity;
    subtotal += parsePrice(item.priceSale) * item.quantity;
  });

  // Update order summary card
  subtotalLabel.textContent = `Subtotal (${totalItemsCount} item${totalItemsCount !== 1 ? 's' : ''})`;
  subtotalValue.textContent = formatPrice(subtotal);
  totalValue.textContent = formatPrice(subtotal);
}

function bindEvents() {
  // Listen for quantity adjustments and removal inside the bag items list
  bagItemsList.addEventListener("click", (e) => {
    const target = e.target;
    const action = target.getAttribute("data-action");
    if (!action) return;

    const card = target.closest(".bag-item-card");
    if (!card) return;

    const title = card.getAttribute("data-title");
    const items = getBag();
    const item = items.find((i) => i.title === title);
    if (!item) return;

    if (action === "dec") {
      updateQuantity(title, item.quantity - 1);
    } else if (action === "inc") {
      updateQuantity(title, item.quantity + 1);
    } else if (action === "remove") {
      removeFromBag(title);
    }
  });

  // Handle Checkout Click
  checkoutBtn.addEventListener("click", () => {
    const isLoggedIn = localStorage.getItem("is_logged_in") === "true";

    if (!isLoggedIn) {
      // Trigger login modal
      window.dispatchEvent(new CustomEvent("open-login-modal"));
      
      // Temporary toast/banner notification
      showToast("Please sign in to complete your checkout.", "warning");
      return;
    }

    // Process checkout since user is logged in
    processMockCheckout();
  });

  // Re-render when bag changes (either here, from header, or other pages)
  window.addEventListener("bag-updated", renderCheckout);

  // Listen for login success to automatically trigger checkout
  window.addEventListener("user-logged-in", () => {
    showToast("Signed in! Processing your checkout...", "success");
    setTimeout(() => {
      processMockCheckout();
    }, 1000);
  });
}

function processMockCheckout() {
  checkoutBtn.disabled = true;
  checkoutBtn.textContent = "Processing order...";
  checkoutBtn.style.opacity = "0.7";

  setTimeout(() => {
    // Clear bag and show beautiful success view
    clearBag();
    
    // Replace checkout layout with a gorgeous checkout completion view
    const mainContainer = document.querySelector(".checkout-page-main");
    mainContainer.innerHTML = `
      <div class="empty-bag-state" style="padding: 80px 24px; max-width: 600px; margin: 40px auto;">
        <div class="empty-icon-wrapper" style="background-color: rgba(43, 76, 63, 0.08); color: var(--color-green); width: 90px; height: 90px;">
          <svg viewBox="0 0 24 24" width="54" height="54">
            <path fill="currentColor" d="M9,16.17L4.83,12l-1.42,1.41L9,19 21,7l-1.41-1.41L9,16.17Z" />
          </svg>
        </div>
        <h2 style="font-size: 1.85rem; margin-bottom: 12px;">Order Placed Successfully!</h2>
        <p style="font-size: 1rem; color: var(--color-text-muted); margin-bottom: 8px;">
          Thank you for your purchase. Your order number is <strong>#PC-${Math.floor(100000 + Math.random() * 900000)}</strong>.
        </p>
        <p style="font-size: 0.9rem; color: var(--color-text-muted); margin-bottom: 32px; max-width: 420px;">
          We've sent a confirmation email with details of your order. It will be prepared and shipped shortly!
        </p>
        <a href="./list.html" class="btn-shop-all">Continue Shopping</a>
      </div>
    `;
  }, 2000);
}

// Simple Toast Utility
function showToast(message, type = "info") {
  // Remove existing toasts
  const existing = document.querySelectorAll(".checkout-toast");
  existing.forEach((t) => t.remove());

  const toast = document.createElement("div");
  toast.className = `checkout-toast toast-${type}`;
  toast.textContent = message;

  // Inline styling for the toast notification
  Object.assign(toast.style, {
    position: "fixed",
    bottom: "24px",
    right: "24px",
    padding: "12px 24px",
    borderRadius: "var(--radius-pill)",
    backgroundColor: type === "warning" ? "var(--color-rust)" : "var(--color-green)",
    color: "var(--color-white)",
    fontSize: "0.9rem",
    fontWeight: "600",
    boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
    zIndex: "9999",
    opacity: "0",
    transform: "translateY(20px)",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
  });

  document.body.appendChild(toast);

  // Trigger animation
  setTimeout(() => {
    toast.style.opacity = "1";
    toast.style.transform = "translateY(0)";
  }, 10);

  // Fade out
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(20px)";
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3500);
}

document.addEventListener("DOMContentLoaded", async () => {
  try {
    // Parallel load components
    await Promise.all([
      loadComponent("#header-root", "site-header"),
      loadComponent("#footer-root", "site-footer")
    ]);

    // Initial render
    renderCheckout();

    // Bind page events
    bindEvents();
  } catch (error) {
    console.error("Error loading checkout page components:", error);
  }
});
