function Slider(selector, config) {
  const sliderElement = selector;
  const slidesContainer = sliderElement.querySelector(".slides-container");
  const slides = Array.from(slidesContainer.children);
  const totalSlides = slides.length;

  let currentSlideIndex = 0;
  let autoPlayInterval;
  let arrowLeft = null;
  let arrowRight = null;
  const dots = [];

  function init() {
    cacheElements();
    generateDots();
    updateActiveSlide(currentSlideIndex);
    addEventListeners();

    if (config.autoPlay) {
      autoPlay();
    }
  }

  function cacheElements() {
    arrowLeft = createArrow(
      "arrow-left",
      `
      <g transform="translate(-421.000000, -1195.000000)" fill="#e4e4e4">
        <path
          d="M423.429,1206.98 L434.686,1196.7 C435.079,1196.31 435.079,1195.67 434.686,1195.28 C434.293,1194.89 433.655,1194.89 433.263,1195.28 L421.282,1206.22 C421.073,1206.43 420.983,1206.71 420.998,1206.98 C420.983,1207.26 421.073,1207.54 421.282,1207.75 L433.263,1218.69 C433.655,1219.08 434.293,1219.08 434.686,1218.69 C435.079,1218.29 435.079,1217.66 434.686,1217.27 L423.429,1206.98"
        ></path>
      </g>
    `
    );
    arrowRight = createArrow(
      "arrow-right",
      `
      <g transform="translate(-473.000000, -1195.000000)">
        <path
          d="M486.717,1206.22 L474.71,1195.28 C474.316,1194.89 473.678,1194.89 473.283,1195.28 C472.89,1195.67 472.89,1196.31 473.283,1196.7 L484.566,1206.98 L473.283,1217.27 C472.89,1217.66 472.89,1218.29 473.283,1218.69 C473.678,1219.08 474.316,1219.08 474.71,1218.69 L486.717,1207.75 C486.927,1207.54 487.017,1207.26 487.003,1206.98 C487.017,1206.71 486.927,1206.43 486.717,1206.22"
        ></path>
      </g>
    `
    );
  }

  function createArrow(className, icon) {
    const arrow = document.createElement("div");
    arrow.classList.add("arrow", className);
    arrow.innerHTML = `
      <svg
        width="62px"
        viewBox="-5 0 24 24"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        xmlns:sketch="http://www.bohemiancoding.com/sketch/ns"
        fill="#e4e4e4"
      >
        ${icon}
      </svg>`;
    sliderElement.appendChild(arrow);
    return arrow;
  }

  function generateDots() {
    const dotsContainer = document.createElement("div");
    dotsContainer.classList.add("dots-container");

    for (let i = 0; i < totalSlides; i++) {
      const dot = document.createElement("span");
      dot.classList.add("dot");
      dot.addEventListener("click", () => slideTo(i));
      dots.push(dot);
      dotsContainer.appendChild(dot);
    }

    sliderElement.appendChild(dotsContainer);
  }

  function addEventListeners() {
    arrowLeft.addEventListener("click", () => {
      slideToPrev();
      restartAutoPlay();
    });
    arrowRight.addEventListener("click", () => {
      slideToNext();
      restartAutoPlay();
    });

    sliderElement.addEventListener("click", (event) => {
      const dotIndex = dots.indexOf(event.target);
      if (dotIndex !== -1) {
        slideTo(dotIndex);
      }
    });
  }

  function slideTo(index) {
    if (index === currentSlideIndex) return;

    const direction = index > currentSlideIndex ? "forward" : "backward";
    currentSlideIndex = index;
    updateActiveSlide(currentSlideIndex, direction);
  }

  function slideToPrev() {
    const prevIndex = (currentSlideIndex - 1 + totalSlides) % totalSlides;
    slideTo(prevIndex);
  }

  function slideToNext() {
    const nextIndex = (currentSlideIndex + 1) % totalSlides;
    slideTo(nextIndex);
  }

  function updateActiveSlide(index, direction) {
    slides.forEach((slide, i) => {
      const isCurrentSlide = i === index;
      const isForward = i > index;
      const isBackward = i < index;

      slide.classList.toggle("active", isCurrentSlide);
      slide.style.transform = `translateX(${-100 * index}%)`;
      slide.classList.toggle("forward", isForward);
      slide.classList.toggle("backward", isBackward);
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === index);
    });
  }

  function restartAutoPlay() {
    if (config.autoPlay && autoPlayInterval) {
      clearInterval(autoPlayInterval);
      autoPlay();
    }
  }

  function autoPlay() {
    autoPlayInterval = setInterval(() => {
      slideToNext();
    }, config.autoPlayDuration);
  }

  init();
}

function initSliders() {
  const sliders = document.querySelectorAll(".slider");
  sliders.forEach((slider) => {
    const autoPlay = slider.classList.contains("auto-play");
    new Slider(slider, { autoPlay, autoPlayDuration: 6000 });
  });
}

document.addEventListener("DOMContentLoaded", initSliders);
