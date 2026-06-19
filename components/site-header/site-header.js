import { loadComponent } from "../../js/utils/loader.js";

export function init(element) {
  const signInBtn = element.querySelector(".btn-signin");
  if (signInBtn) {
    signInBtn.addEventListener("click", () => {
      window.dispatchEvent(new CustomEvent("open-login-modal"));
    });
  }

  const bagBadge = element.querySelector(".bag-count");
  if (bagBadge) {
    let count = 0;

    window.addEventListener("bag-updated", (event) => {
      const delta = event.detail?.count || 1;
      count += delta;
      bagBadge.textContent = count;
    });
  }

  // Auto-load the login modal within the header's context
  loadComponent("#login-modal-root", "login-modal").catch((err) => {
    console.error("Failed to load login modal from site-header:", err);
  });
}
