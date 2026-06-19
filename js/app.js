import { loadComponent } from "./utils/loader.js";
import { buildCard } from "./utils/book-card.js";

async function renderBookGrids() {
  const res = await fetch("./data/homepage-data.json");
  const data = await res.json();

  const sections = [
    { gridId: "#featured-picks-grid", dataKey: "featuredPicks" },
    { gridId: "#bestsellers-grid",    dataKey: "bestsellers" },
    { gridId: "#blank-cards-grid",    dataKey: "newArrivals" },
  ];

  for (const { gridId, dataKey } of sections) {
    const grid = document.querySelector(gridId);
    if (grid && data[dataKey]) {
      grid.innerHTML = data[dataKey].map(buildCard).join("");
    }
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  try {
    await loadComponent("#header-root",         "site-header");
    await loadComponent("#hero-carousel-root",  "hero-carousel");
    await loadComponent("#genre-cards-root",    "genre-cards");
    await loadComponent("#featured-picks-root", "featured-picks");
    await loadComponent("#promo-banner-root",   "promo-banner");
    await loadComponent("#bestsellers-root",    "bestsellers");
    await loadComponent("#blank-cards-root",    "blank-cards");
    await renderBookGrids();
  } catch (error) {
    console.error("Error loading application components:", error);
  }
});
