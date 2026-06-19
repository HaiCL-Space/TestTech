export function init(element) {
  const overlay = element.querySelector(".login-modal-overlay");
  const card = overlay.querySelector(".login-modal-card");
  const closeBtn = overlay.querySelector("#modal-close-btn");

  const viewSignin = overlay.querySelector("#view-signin");
  const viewRegister = overlay.querySelector("#view-register");

  const toRegisterBtn = overlay.querySelector("#to-register-btn");
  const toSigninBtn = overlay.querySelector("#to-signin-btn");

  const signinForm = overlay.querySelector("#signin-form");
  const registerForm = overlay.querySelector("#register-form");

  function openModal() {
    overlay.classList.add("open");
    document.body.classList.add("modal-open");
    showView("signin");
  }

  function closeModal() {
    overlay.classList.remove("open");
    document.body.classList.remove("modal-open");
  }

  function showView(viewName) {
    if (viewName === "signin") {
      viewRegister.classList.remove("active");
      // Wait for transition before hiding/showing
      setTimeout(() => {
        viewRegister.style.display = "none";
        viewSignin.style.display = "block";
        setTimeout(() => {
          viewSignin.classList.add("active");
        }, 20);
      }, 150);
    } else if (viewName === "register") {
      viewSignin.classList.remove("active");
      setTimeout(() => {
        viewSignin.style.display = "none";
        viewRegister.style.display = "block";
        setTimeout(() => {
          viewRegister.classList.add("active");
        }, 20);
      }, 150);
    }
  }

  // Event Listeners
  closeBtn.addEventListener("click", closeModal);

  // Close when clicking overlay backdrop
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      closeModal();
    }
  });

  // Esc key closes modal
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay.classList.contains("open")) {
      closeModal();
    }
  });

  // View switches
  toRegisterBtn.addEventListener("click", (e) => {
    e.preventDefault();
    showView("register");
  });

  toSigninBtn.addEventListener("click", (e) => {
    e.preventDefault();
    showView("signin");
  });

  // Form submission (mock actions)
  signinForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = overlay.querySelector("#signin-email").value;
    localStorage.setItem("is_logged_in", "true");
    alert(`Successfully signed in as: ${email}`);
    closeModal();
    // Reset form
    signinForm.reset();
    window.dispatchEvent(new CustomEvent("user-logged-in"));
  });

  registerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = overlay.querySelector("#register-email").value;
    localStorage.setItem("is_logged_in", "true");
    alert(`Successfully created account for: ${email}`);
    closeModal();
    // Reset form
    registerForm.reset();
    window.dispatchEvent(new CustomEvent("user-logged-in"));
  });

  // Global window event to trigger modal
  window.addEventListener("open-login-modal", () => {
    openModal();
  });
}
