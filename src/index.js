import gsap from "https://cdn.skypack.dev/gsap";
import CustomEase from "https://cdn.skypack.dev/gsap/CustomEase";
import ScrollTrigger from "https://cdn.skypack.dev/gsap/ScrollTrigger";
import studioFreightlenis from "https://cdn.jsdelivr.net/npm/@studio-freight/lenis@1.0.42/+esm";

console.log("test vanaf jordi macbook haha");

gsap.registerPlugin(CustomEase, ScrollTrigger);

CustomEase.create("main", "0.65, 0.01, 0.05, 0.99");

gsap.defaults({
  ease: "main",
});

initFunctions();

function initFunctions() {
  document.addEventListener("DOMContentLoaded", () => {
    initLenis();
    initDetectScrollingDirection();
    initMenu();
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

function initDetectScrollingDirection() {
  let lastScrollTop = 0;
  const threshold = 10; // Minimal scroll distance to switch to up/down
  const thresholdTop = 50; // Minimal scroll distance from top of window to start

  window.addEventListener("scroll", () => {
    const nowScrollTop = window.scrollY;

    if (Math.abs(lastScrollTop - nowScrollTop) >= threshold) {
      // Update Scroll Direction
      const direction = nowScrollTop > lastScrollTop ? "down" : "up";
      document
        .querySelectorAll("[data-scrolling-direction]")
        .forEach((el) =>
          el.setAttribute("data-scrolling-direction", direction)
        );

      // Update Scroll Started
      const started = nowScrollTop > thresholdTop;
      document
        .querySelectorAll("[data-scrolling-started]")
        .forEach((el) =>
          el.setAttribute("data-scrolling-started", started ? "true" : "false")
        );

      lastScrollTop = nowScrollTop;
    }
  });
}

function initMenu() {
  let navWrap = document.querySelector(".nav_menu");
  let navButton = document.querySelector(".menu-btn");
  let menuDivider = document.querySelector(".menu-divider");
  let state = navWrap.getAttribute("data-nav");
  let overlay = navWrap.querySelector(".overlay");
  let menu = navWrap.querySelector(".menu");
  let bgPanels = navWrap.querySelectorAll(".menu-bg");
  let menuToggles = document.querySelectorAll("[data-menu-toggle]");
  let menuLinks = navWrap.querySelectorAll(".menu-link");
  let menuHeaders = navWrap.querySelectorAll(".menu-header");

  let tl = gsap.timeline();

  const openNav = () => {
    navWrap.setAttribute("data-nav", "open");

    tl.clear()
      .set(navWrap, { display: "block" })
      .set(menu, { xPercent: 0 }, "<")
      .call(() => {
        lenis.stop();
      })
      .fromTo(overlay, { autoAlpha: 0 }, { autoAlpha: 1 }, "<")
      .fromTo(
        bgPanels,
        { xPercent: -101 },
        { xPercent: 0, duration: 0.575 },
        "<"
      )
      .fromTo(
        navButton,
        { rotate: -180, scale: 0 },
        { rotate: 0, scale: 1 },
        "<"
      )
      .fromTo(
        menuLinks,
        { yPercent: 140, rotate: 10 },
        { yPercent: 0, rotate: 0, stagger: 0.05 },
        "<+=0.15"
      )
      .fromTo(
        menuDivider,
        { scaleX: 0, transformOrigin: "left" },
        { scaleX: 1 },
        "<+0.35"
      )
      .fromTo(
        menuHeaders,
        { yPercent: 100 },
        { yPercent: 0, stagger: 0.1 },
        "<+=0.15"
      );
  };

  const closeNav = () => {
    navWrap.setAttribute("data-nav", "closed");

    tl.clear()
      .to(overlay, { autoAlpha: 0 })
      .to(menu, { xPercent: -101 }, "<")
      .set(navWrap, { display: "none" });
  };

  // Toggle menu open / close depending on its current state
  menuToggles.forEach((toggle) => {
    toggle.addEventListener("click", () => {
      state = navWrap.getAttribute("data-nav");
      if (state === "open") {
        closeNav();
      } else {
        openNav();
      }
    });
  });

  // If menu is open, you can close it using the "escape" key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && navWrap.getAttribute("data-nav") === "open") {
      closeNav();
    }
  });
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
  const swiper = new Swiper(".swiper", {
    speed: 500, // Match our CSS
    slidesPerView: 3,
    spaceBetween: 24,
    createElements: true,
    loop: true,

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
      init: function () {
        updateSlideInfo(this);
      },
      slideChange: function () {
        updateSlideInfo(this);
      },
    },
  });

  // Helper function to update slide information
  function updateSlideInfo(swiper) {
    const currentSlide = swiper.realIndex + 1;

    // Get the actual number of slides (not duplicated ones)
    const slideElements = document.querySelectorAll(
      ".swiper-slide:not(.swiper-slide-duplicate)"
    );
    const totalSlides = slideElements.length || 5; // Fallback to 5 if can't determine

    // Format numbers with leading zeros
    const formatNumber = (num) => num.toString().padStart(2, "0");
    const formattedCurrentSlide = formatNumber(currentSlide);
    const formattedTotalSlides = formatNumber(totalSlides);

    // Update DOM elements if they exist
    const currentElement = document.querySelector("[data-swiper-current]");
    const totalElement = document.querySelector("[data-swiper-total]");

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
