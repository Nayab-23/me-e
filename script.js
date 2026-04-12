const revealItems = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  },
  {
    threshold: 0.15,
  }
);

revealItems.forEach((item) => observer.observe(item));

const year = document.getElementById("year");

if (year) {
  year.textContent = new Date().getFullYear();
}

const carousel = document.querySelector("[data-carousel]");

if (carousel) {
  const track = carousel.querySelector(".showcase-track");
  const slides = Array.from(carousel.querySelectorAll("[data-slide]"));
  const prevButton = carousel.querySelector("[data-carousel-prev]");
  const nextButton = carousel.querySelector("[data-carousel-next]");

  let activeIndex = 0;
  let intervalId;

  const getVisibleCount = () => {
    if (window.innerWidth <= 760) {
      return 2;
    }

    if (window.innerWidth <= 1040) {
      return 2;
    }

    return 3;
  };

  const getMaxIndex = () => Math.max(0, slides.length - getVisibleCount());

  const renderCarousel = () => {
    if (!slides.length) {
      return;
    }

    const maxIndex = getMaxIndex();

    if (activeIndex > maxIndex) {
      activeIndex = maxIndex;
    }

    const gap = parseFloat(window.getComputedStyle(track).gap) || 0;
    const step = slides[0].getBoundingClientRect().width + gap;

    track.style.transform = `translateX(-${activeIndex * step}px)`;

    slides.forEach((slide, index) => {
      const isVisible = index >= activeIndex && index < activeIndex + getVisibleCount();
      slide.classList.toggle("is-active", isVisible);
    });
  };

  const goToSlide = (index) => {
    const maxIndex = getMaxIndex();

    if (index < 0) {
      activeIndex = maxIndex;
    } else if (index > maxIndex) {
      activeIndex = 0;
    } else {
      activeIndex = index;
    }

    renderCarousel();
  };

  const startAutoplay = () => {
    window.clearInterval(intervalId);
    intervalId = window.setInterval(() => {
      goToSlide(activeIndex + 1);
    }, 4200);
  };

  const resetAutoplay = () => {
    window.clearInterval(intervalId);
    startAutoplay();
  };

  prevButton?.addEventListener("click", () => {
    goToSlide(activeIndex - 1);
    resetAutoplay();
  });

  nextButton?.addEventListener("click", () => {
    goToSlide(activeIndex + 1);
    resetAutoplay();
  });

  carousel.addEventListener("mouseenter", () => window.clearInterval(intervalId));
  carousel.addEventListener("mouseleave", startAutoplay);
  window.addEventListener("resize", renderCarousel);

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      window.clearInterval(intervalId);
      return;
    }

    resetAutoplay();
  });

  renderCarousel();
  startAutoplay();
}
