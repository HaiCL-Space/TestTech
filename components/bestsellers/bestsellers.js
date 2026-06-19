import { buildCard } from '../../js/utils/book-card.js';

export async function init(element) {
  const grid = element.querySelector('#bestsellers-grid');
  if (!grid) return;

  const res = await fetch('./data/homepage-data.json');
  const data = await res.json();

  grid.innerHTML = data.bestsellers.map(buildCard).join('');
}
