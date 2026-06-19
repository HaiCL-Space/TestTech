import { loadComponent } from "./utils/loader.js";

document.addEventListener("DOMContentLoaded", async () => {
  try {
    await loadComponent("#header-root", "site-header");
    await loadComponent("#hero-carousel-root", "hero-carousel");
    await loadComponent("#genre-cards-root", "genre-cards");
    await loadComponent("#featured-picks-root", "featured-picks");
    await loadComponent("#promo-banner-root", "promo-banner");
    await loadComponent("#bestsellers-root", "bestsellers");
  } catch (error) {
    console.error("Error loading application components:", error);
  }
});
