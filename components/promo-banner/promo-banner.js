export function init(element) {
  const joinBtn = element.querySelector('.btn-promo-join');
  if (joinBtn) {
    joinBtn.addEventListener('click', () => {
      // Placeholder: open sign-up modal or navigate
      window.dispatchEvent(new CustomEvent('open-signup'));
    });
  }
}
