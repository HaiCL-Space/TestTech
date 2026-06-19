import { loadComponent } from "../../js/utils/loader.js";
import { getBagCount } from "../../js/utils/bag.js";

export function init(element) {
  const signInBtn = element.querySelector(".btn-signin");
  if (signInBtn) {
    signInBtn.addEventListener("click", () => {
      window.dispatchEvent(new CustomEvent("open-login-modal"));
    });
  }

  const bagBadge = element.querySelector(".bag-count");
  if (bagBadge) {
    bagBadge.textContent = getBagCount();

    window.addEventListener("bag-updated", () => {
      bagBadge.textContent = getBagCount();
    });
  }

  const bagBtn = element.querySelector(".btn-bag");
  if (bagBtn) {
    bagBtn.addEventListener("click", () => {
      window.location.href = "./checkout.html";
    });
  }

  // Auto-load the login modal within the header's context
  loadComponent("#login-modal-root", "login-modal").catch((err) => {
    console.error("Failed to load login modal from site-header:", err);
  });
}

