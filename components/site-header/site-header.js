export function init(element) {
  const bagBadge = element.querySelector(".bag-count");
  if (!bagBadge) return;

  let count = 0;

  window.addEventListener("bag-updated", (event) => {
    const delta = event.detail?.count || 1;
    count += delta;
    bagBadge.textContent = count;
  });
}
