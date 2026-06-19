const form = document.getElementById("footer-newsletter-form");
if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = form.querySelector(".footer-newsletter-input");
    if (input.value.trim()) {
      input.value = "";
      input.placeholder = "You're on the list!";
      setTimeout(() => {
        input.placeholder = "Email address";
      }, 3000);
    }
  });
}
