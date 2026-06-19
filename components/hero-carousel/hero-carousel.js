export function init(element) {
  const track = element.querySelector(".carousel-track");
  const slides = element.querySelectorAll(".carousel-slide");
  let dotsContainer = element.querySelector(".carousel-indicators");
  const prevBtn = element.querySelector(".prev-arrow");
  const nextBtn = element.querySelector(".next-arrow");

  // If no track or slides
  if (!track || slides.length === 0) return;

  const totalSlides = slides.length;
  let currentIndex = 0;
  let intervalId = null;

  if (!dotsContainer) {
    dotsContainer = document.createElement("div");
    dotsContainer.className = "carousel-indicators";
    const container = element.querySelector(".carousel-container") || element;
    container.appendChild(dotsContainer);
  }

  let dots = Array.from(element.querySelectorAll(".indicator-dot"));
  if (dots.length !== totalSlides) {
    dotsContainer.innerHTML = "";
    dots = [];
    for (let i = 0; i < totalSlides; i++) {
      const dot = document.createElement("button");
      dot.className = i === 0 ? "indicator-dot active" : "indicator-dot";
      dot.setAttribute("aria-label", `Slide ${i + 1}`);
      dotsContainer.appendChild(dot);
      dots.push(dot);
    }
  }

  function updateCarousel() {
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    dots.forEach((dot, index) => {
      if (index === currentIndex) {
        dot.classList.add("active");
      } else {
        dot.classList.remove("active");
      }
    });
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % totalSlides;
    updateCarousel();
  }

  function prevSlide() {
    currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
    updateCarousel();
  }

  // Action Handlers
  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      prevSlide();
      restartAutoplay();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      nextSlide();
      restartAutoplay();
    });
  }

  dots.forEach((dot, idx) => {
    dot.addEventListener("click", () => {
      currentIndex = idx;
      updateCarousel();
      restartAutoplay();
    });
  });

  // Autoplay setup
  function startAutoplay() {
    intervalId = setInterval(nextSlide, 5000);
  }

  function stopAutoplay() {
    if (intervalId) clearInterval(intervalId);
  }

  function restartAutoplay() {
    stopAutoplay();
    startAutoplay();
  }

  element.addEventListener("mouseenter", stopAutoplay);
  element.addEventListener("mouseleave", startAutoplay);

  // Initial trigger to ensure correct state
  updateCarousel();
  startAutoplay();
}
