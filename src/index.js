import gsap from "https://cdn.skypack.dev/gsap";
import CustomEase from "https://cdn.skypack.dev/gsap/CustomEase";
import ScrollTrigger from "https://cdn.skypack.dev/gsap/ScrollTrigger";
import studioFreightlenis from "https://cdn.jsdelivr.net/npm/@studio-freight/lenis@1.0.42/+esm";

console.log("test vanaf jordi macbook haha");

gsap.registerPlugin(CustomEase, ScrollTrigger);

CustomEase.create("custom", "M0,0 C0.504,0 0.01,1 1,1");

gsap.defaults({
  ease: "custom",
});

initFunctions();

function initFunctions() {
  document.addEventListener("DOMContentLoaded", () => {
    initLenis();
    initNavDropdown();
    initDynamicCurrentTime();
    initSwipers();
  });
}

function initLenis() {
  const lenis = new studioFreightlenis();
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);
}

function initNavDropdown() {
  const navDropdown = $(".nav_dropdown");
  const dropdownMenu = $(".nav_dropdown-menu");
  const dropdownBackground = dropdownMenu.find(".nav_dropdown-bg");
  const dropdownContent = dropdownMenu.find(".nav_dropdown-content-w");

  navDropdown.on("mouseenter", () => {
    let tl = gsap.timeline();

    tl.fromTo(
      dropdownMenu,
      {
        display: "none",
        visibility: "hidden",
        transform: "translateY(10%)",
        opacity: 0,
      },
      {
        display: "block",
        visibility: "visible",
        transform: "translateY(0)",
        opacity: 1,
        duration: 0.6,
      }
    );

    tl.to(
      [dropdownBackground, dropdownContent],
      {
        opacity: 1,
        duration: 0.6,
      },
      "<"
    );
  });

  navDropdown.on("mouseleave", () => {
    let tl = gsap.timeline();

    tl.to([dropdownBackground, dropdownContent], {
      opacity: 0,
      duration: 0.4,
    });

    tl.to(
      dropdownMenu,
      {
        opacity: 0,
        duration: 0.4,
        transform: "translateY(10%)",
      },
      "<"
    );

    tl.to(dropdownMenu, {
      display: "none",
      visibility: "hidden",
    });
  });
}

function initDynamicCurrentTime() {
  const defaultTimezone = "Europe/Amsterdam";

  // Function to create a time formatter with the correct timezone
  const createFormatter = (timezone) => {
    return new Intl.DateTimeFormat("nl-NL", {
      timeZone: timezone,
      weekday: "long",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };

  // Function to update the time for all elements
  const updateTime = () => {
    document.querySelectorAll("[data-current-time]").forEach((element) => {
      const timezone =
        element.getAttribute("data-current-time") || defaultTimezone;
      const formatter = createFormatter(timezone);
      const now = new Date();
      const formattedTime = formatter.format(now);
      // Capitalize first letter of the day
      element.textContent = formattedTime.replace(/^[a-z]/, (letter) =>
        letter.toUpperCase()
      );
    });
  };

  // Initial update and interval for subsequent updates
  updateTime();
  setInterval(updateTime, 1000);
}

function initSwipers() {
  const swiper = new Swiper('.swiper', {
    loop: true,
    speed: 750,
    slidesPerView: 3,
    spaceBetween: 24,
    createElements: true,
    
    // Pagination
    pagination: {
      el: "[data-swiper-pagination]",
      clickable: true,
    },

    navigation: {
      nextEl: "[data-swiper-next]",
      prevEl: "[data-swiper-prev]",
    },
    
    on: {
      init: function() {
        updateSlideInfo(this);
      },
      slideChange: function() {
        updateSlideInfo(this);
      }
    }
  });
  
  // Helper function to update slide information
  function updateSlideInfo(swiper) {
    const currentSlide = swiper.realIndex + 1;
    
    // Get the actual number of slides (not duplicated ones)
    const slideElements = document.querySelectorAll('.swiper-slide:not(.swiper-slide-duplicate)');
    const totalSlides = slideElements.length || 5; // Fallback to 5 if can't determine
    
    // Format numbers with leading zeros
    const formatNumber = (num) => num.toString().padStart(2, '0');
    const formattedCurrentSlide = formatNumber(currentSlide);
    const formattedTotalSlides = formatNumber(totalSlides);
    
    // Update DOM elements if they exist
    const currentElement = document.querySelector('[data-swiper-current]');
    const totalElement = document.querySelector('[data-swiper-total]');
    
    if (currentElement) {
      currentElement.textContent = formattedCurrentSlide;
    }
    
    if (totalElement) {
      totalElement.textContent = formattedTotalSlides;
    }
    
    // Log for debugging
    console.log(`Slide ${formattedCurrentSlide} of ${formattedTotalSlides}`);
  }
}

