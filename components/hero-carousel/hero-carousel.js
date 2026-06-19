export function init(element) {
  const track = element.querySelector(".carousel-track");
  const dots = element.querySelectorAll(".indicator-dot");
  const prevBtn = element.querySelector(".prev-arrow");
  const nextBtn = element.querySelector(".next-arrow");
  if (!track || dots.length === 0) return;

  let currentIndex = 0;
  const totalSlides = dots.length;
  let intervalId = null;

  function updateCarousel() {
    track.style.transform = `translateX(-${(currentIndex * 100) / totalSlides}%)`;
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
  if (prevBtn)
    prevBtn.addEventListener("click", () => {
      prevSlide();
      restartAutoplay();
    });
  if (nextBtn)
    nextBtn.addEventListener("click", () => {
      nextSlide();
      restartAutoplay();
    });

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

  startAutoplay();
}
