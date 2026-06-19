export function init(element) {
    const buyButtons = element.querySelectorAll('.btn-buy');
    buyButtons.forEach((btn) => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation(); // Avoid triggering card click
            window.dispatchEvent(new CustomEvent('bag-updated', {
                detail: { count: 1 }
            }));
        });
    });
}
