import gsap from "https://cdn.skypack.dev/gsap";
import CustomEase from "https://cdn.skypack.dev/gsap/CustomEase";
import ScrollTrigger from "https://cdn.skypack.dev/gsap/ScrollTrigger";
import Flip from "https://cdn.skypack.dev/gsap/Flip";
import studioFreightlenis from "https://cdn.jsdelivr.net/npm/@studio-freight/lenis@1.0.42/+esm";
import lagrangeBarbaCore from "https://cdn.skypack.dev/@lagrange/barba-core";

gsap.registerPlugin(CustomEase, ScrollTrigger, Flip);

let lenis;
let transitionOffset = 800; /* ms */

CustomEase.create("main", "0.65, 0.01, 0.05, 0.99");
gsap.defaults({ ease: "main" });

initFunctions();

initPageTransitions();

function pageTransitionIn() {
  //
  let tl = gsap.timeline();

  if ($("[data-animation-transition='fade'], [data-animation-transition='slide']").length) {
    tl.to("[data-animation-transition='fade'], [data-animation-transition='slide']", {
      autoAlpha: 0,
      ease: "none",
      duration: 0.3
    });
  }

  if ($("[data-animation-transition='fade-up']").length) {
    tl.to("[data-animation-transition='fade-up']", {
      autoAlpha: 0,
      y: "-100%",
      ease: "main",
      duration: 0.8,
      stagger: 0.075
    }, "<");
  }
}

function pageTransitionOut() {
  //

  let tl = gsap.timeline();
  if ($("[data-animation-transition='fade-up']").length) {
    tl.from("[data-animation-transition='fade-up']", {
      autoAlpha: 0,
      y: "100%",
      ease: "main",
      duration: 0.8,
      stagger: 0.1
    },"-0.1");
  }

  if ($("[data-animation-transition='fade']").length) {
    tl.from("[data-animation-transition='fade']", {
      autoAlpha: 0,
      rotate: 0.001,
      ease: "jitter-smooth",
      duration: 0.5,
      clearProps: "all"
    },"<+50%");
  }


}

function initPageTransitions() {

  history.scrollRestoration = "manual";

  lagrangeBarbaCore.hooks.afterEnter(() => {
    window.scrollTo(0, 0);
    ScrollTrigger.refresh();
    // Ensure menu is initialized after each page transition
    initMenu();
    
    // Initialize Finsweet attributes - primary initialization point
    initFinsweet();
 });
 
 lagrangeBarbaCore.hooks.leave(() => {
    // Clean up event listeners before leaving the page
    cleanupEventListeners();
    initFunctions();
 });

  //
  async function commonLeaveBeforeOffset(data) {
    //
    console.log("commonLeaveBeforeOffset");
    pageTransitionIn(data.current);
    $('[data-scrolling-direction]').attr('data-scrolling-direction', 'up');
    $('[data-scrolling-started]').attr('data-scrolling-started', 'false');
  }

  async function commonLeaveAfterOffset(data) {
    //
    console.log("commonLeaveAfterOffset");
    await delay(10);
    $('[data-scrolling-direction]').attr('data-scrolling-direction', 'up');
    $('[data-scrolling-started]').attr('data-scrolling-started', 'false');
  }

  async function commonEnter(data) {
    //
    console.log("commonEnter");
    pageTransitionOut(data.next);
  }

  async function commonBeforeEnter(data) {
    //
    console.log("commonBeforeEnter");
    initResetWebflow(data);
    initFunctions();
  }

  async function commonAfterEnter(data) {
    //
    console.log("commonAfterEnter");
    window.scrollTo(0, 0);
    ScrollTrigger.refresh();
    
  }

  lagrangeBarbaCore.init({
    sync: true,
    debug: true,
    timeout: 7000,
    preventRunning: true,
    prevent: function ({ el }) {
      if (el.hasAttribute("data-barba-prevent")) {
        return true;
      }
    },
    transitions: [{
      name: "default", 
      once(data) {
        initSmoothScroll(data.next.container);
        initFunctions();
        // Initialize Finsweet attributes on first load only
        initFinsweet();
      },
      async leave(data) {
        await commonLeaveBeforeOffset(data);
        await delay(transitionOffset);
        await commonLeaveAfterOffset(data);
      },
      async enter(data) {
        await commonEnter(data);
      },
      async beforeEnter(data) {
        await commonBeforeEnter(data);
      },
      async afterEnter(data) {
        await commonAfterEnter(data);
      }
    }]
  })

}

function cleanupEventListeners() {
  // Remove menu event listeners to prevent duplicates
  $("[data-menu-toggle]").off("click");
  $(document).off("keydown.menuEscape");
  
  // Remove other event listeners as needed
  $(".nav_dropdown").off("mouseenter mouseleave");
  $(".voorraad_list-switch-item").off("click");
  $("[data-filter-menu-toggle]").off("click");
}

function initFunctions() {
  $(document).ready(function() {
    initLenis();
    initDetectScrollingDirection();
    initMenu();
    initNavDropdown();
    initDynamicCurrentTime();
    initSwipers();
    initVoorraad();
    initVoorraadFilter();
  });
}

function delay(n) {
  n = n || 2000;
  return new Promise((done) => {
    setTimeout(() => {
      done();
    }, n);
  });
}

function initResetWebflow(data) {
  let parser = new DOMParser();
  let dom = parser.parseFromString(data.next.html, "text/html");
  let webflowPageId = dom.querySelector("html").getAttribute("data-wf-page");
  $("html").attr("data-wf-page", webflowPageId);
  window.Webflow.destroy();
  window.Webflow.ready();
  // window.Webflow.require("ix2").init();
  
 
}

function initSmoothScroll(container) {
  initLenis();
  ScrollTrigger.refresh();
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

  $(window).on("scroll", function() {
    const nowScrollTop = $(window).scrollTop();

    if (Math.abs(lastScrollTop - nowScrollTop) >= threshold) {
      // Update Scroll Direction
      const direction = nowScrollTop > lastScrollTop ? "down" : "up";
      $("[data-scrolling-direction]").attr("data-scrolling-direction", direction);

      // Update Scroll Started
      const started = nowScrollTop > thresholdTop;
      $("[data-scrolling-started]").attr("data-scrolling-started", started ? "true" : "false");

      lastScrollTop = nowScrollTop;
    }
  });
}

function initMenu() {
  console.log("menu init");
  
  // First clean up any existing event listeners to prevent duplicates
  $("[data-menu-toggle]").off("click");
  $(document).off("keydown.menuEscape");
  
  let $navWrap = $(".nav_menu");
  let $navButton = $(".menu-btn");
  let $menuDivider = $(".menu-divider");
  let state = $navWrap.attr("data-nav");
  let $overlay = $navWrap.find(".overlay");
  let $menu = $navWrap.find(".menu");
  let $bgPanels = $navWrap.find(".menu-bg");
  let $bgLine = $navWrap.find(".menu-bg_line");
  let $menuToggles = $("[data-menu-toggle]");
  let $menuLinks = $navWrap.find(".menu-link");
  let $menuHeaders = $navWrap.find(".menu-header");

  let tl = gsap.timeline();

  const openNav = () => {
    $navWrap.attr("data-nav", "open");

    tl.clear()
      .set($navWrap, { display: "block" })
      .set($menu, { xPercent: 0 }, "<")
      .fromTo($overlay, { autoAlpha: 0 }, { autoAlpha: 1 }, "<")
      .fromTo(
        $bgPanels,
        { xPercent: -101 },
        { xPercent: 0, duration: 0.575 },
        "<"
      )
      .fromTo(
        $navButton,
        { rotate: -180, scale: 0 },
        { rotate: 0, scale: 1 },
        "<"
      )
      .fromTo(
        $bgLine,
        {
          transform: "translateX(-100%)",
        },
        {
          transform: "translateX(0%)",
        },
        "<+=50%"
      )
      .fromTo(
        $menuLinks,
        { yPercent: 150, rotate: 10 },
        { yPercent: 0, rotate: 0, stagger: 0.05 },
        "<+=0.15"
      )
      .fromTo(
        $menuDivider,
        { scaleX: 0, transformOrigin: "left" },
        { scaleX: 1 },
        "<+0.35"
      )
      .fromTo(
        $menuHeaders,
        { yPercent: 100 },
        { yPercent: 0, stagger: 0.2 },
        "<+=0.15"
      );
  };

  const closeNav = () => {
    $navWrap.attr("data-nav", "closed");

    tl.clear()
      .to($overlay, { autoAlpha: 0 })
      .to($menu, { xPercent: -101 }, "<")
      .set($navWrap, { display: "none" });
  };

  // Toggle menu open / close depending on its current state
  $menuToggles.each(function() {
    $(this).on("click", function() {
      state = $navWrap.attr("data-nav");
      if (state === "open") {
        closeNav();
      } else {
        openNav();
      }
    });
  });

  // If menu is open, you can close it using the "escape" key
  // Use namespaced event to easily unbind it later
  $(document).on("keydown.menuEscape", function(e) {
    if (e.key === "Escape" && $navWrap.attr("data-nav") === "open") {
      closeNav();
    }
  });
}

function initNavDropdown() {
  // Clean up existing event listeners
  $(".nav_dropdown").off("mouseenter mouseleave");
  
  const $navDropdown = $(".nav_dropdown");
  const $dropdownMenu = $(".nav_dropdown-menu");
  const $dropdownBackground = $dropdownMenu.find(".nav_dropdown-bg");
  const $dropdownContent = $dropdownMenu.find(".nav_dropdown-content-w");

  $navDropdown.on("mouseenter", function() {
    let tl = gsap.timeline();

    tl.fromTo(
      $dropdownMenu,
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
        duration: 0.6,
        opacity: 1,
      }
    );

    tl.to(
      [$dropdownBackground, $dropdownContent],
      {
        opacity: 1,
        duration: 0.6,
      },
      "<"
    );
  });

  $navDropdown.on("mouseleave", function() {
    let tl = gsap.timeline();

    tl.to([$dropdownBackground, $dropdownContent], {
      opacity: 0,
      duration: 0.4,
    });

    tl.to(
      $dropdownMenu,
      {
        opacity: 0,
        duration: 0.4,
        transform: "translateY(10%)",
      },
      "<"
    );

    tl.to(
      $dropdownMenu,
      {
        display: "none",
        visibility: "hidden",
      },
      "<+50%"
    );
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
    $("[data-current-time]").each(function() {
      const timezone = $(this).attr("data-current-time") || defaultTimezone;
      const formatter = createFormatter(timezone);
      const now = new Date();
      const formattedTime = formatter.format(now);
      // Capitalize first letter of the day
      $(this).text(formattedTime.replace(/^[a-z]/, (letter) =>
        letter.toUpperCase()
      ));
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
    breakpoints: {
      320: {
        slidesPerView: 1,
      },
      640: {
        slidesPerView: 2,
      },
      1024: {
        slidesPerView: 3,
      },
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
    const totalSlides = $(".swiper-slide:not(.swiper-slide-duplicate)").length || 5; // Fallback to 5 if can't determine

    // Format numbers with leading zeros
    const formatNumber = (num) => num.toString().padStart(2, "0");
    const formattedCurrentSlide = formatNumber(currentSlide);
    const formattedTotalSlides = formatNumber(totalSlides);

    // Update DOM elements if they exist
    const $currentElement = $("[data-swiper-current]");
    const $totalElement = $("[data-swiper-total]");

    if ($currentElement.length) {
      $currentElement.text(formattedCurrentSlide);
    }

    if ($totalElement.length) {
      $totalElement.text(formattedTotalSlides);
    }

    // Log for debugging
    console.log(`Slide ${formattedCurrentSlide} of ${formattedTotalSlides}`);
  }
}

function initVoorraad() {
  // Count the number of voorraad items
  const voorraadItems = $(".voorraad-row.grid-main").children().length;

  console.log(voorraadItems);

  // Format the number with leading zeros if needed
  const formatNumber = (num) => num.toString().padStart(2, "0");
  const formattedCount = formatNumber(voorraadItems);

  // Update the count in the data-voorraad-count element
  $("[data-voorraad-count]").text(formattedCount);

  // Initialize the view switch functionality
  initVoorraadViewSwitch();

  // Other voorraad initializations can go here
}

function initVoorraadViewSwitch() {
  // Clean up existing event listeners
  $(".voorraad_list-switch-item").off("click");
  
  let $viewSwitchWrapper = $(".voorraad_list-switch");
  let $viewSwitchButtons = $viewSwitchWrapper.find(".voorraad_list-switch-item");

  $viewSwitchButtons.on("click", function() {
    handleViewChange();
    console.log("clicked");
  });

  function handleViewChange() {
    // Get the current view type from the wrapper
    const $viewSwitchWrapper = $(".voorraad_list-switch");
    const currentView = $viewSwitchWrapper.attr("data-view") || "grid";
    const newView = currentView === "list" ? "grid" : "list";

    // Get all items that need to be animated
    const $items = $(".voorraad_item");

    // Get the active background element
    const $activeBg = $(".voorraad-switch_active-bg");

    // Get the current active button and the new target button
    const $currentActiveButton = $(
      `.voorraad_list-switch-item[data-view-item="${currentView}"]`
    );
    const $newActiveButton = $(
      `.voorraad_list-switch-item[data-view-item="${newView}"]`
    );

    // Record the state of the active background before moving it
    const stateBg = Flip.getState($activeBg[0]);

    // Update the view attribute on the wrapper immediately
    $viewSwitchWrapper.attr("data-view", newView);

    // Update the active state on the buttons immediately
    $(".voorraad_list-switch-item").removeClass("is-active");
    $newActiveButton.addClass("is-active");

    // Move the active background to the new button
    $newActiveButton.append($activeBg);

    // Animate the active background to its new position immediately
    Flip.from(stateBg, {
      duration: 0.5,
      ease: "main",
    });

    // Scale down animation for items (happens simultaneously with the background animation)
    gsap.to($items, {
      scale: 0.8,
      opacity: 0.5,
      duration: 0.2,
      ease: "power2.inOut",
      onComplete: () => {
        // Remove both classes from all items and add the new one
        $items.removeClass("is-list is-grid").addClass(`is-${newView}`);

        // Scale back up to normal
        gsap.to($items, {
          scale: 1,
          opacity: 1,
          duration: 0.3,
          ease: "power2.out",
        });
      },
    });
  }
}

function initVoorraadFilter() {
  initVoorraadFilterModal();

  function initVoorraadFilterModal() {
    // Clean up existing event listeners
    $("[data-filter-menu-toggle]").off("click");
    $(document).off("keydown.filterEscape");
    
    let $navWrap = $(".voorraad_filter-menu");
    // let $navButton = $(".menu-btn");
    let state = $navWrap.attr("data-filters");
    let $overlay = $navWrap.find(".overlay");
    let $menu = $navWrap.find(".filter-menu");
    let $bgPanels = $navWrap.find(".filter-menu_bg");
    let $menuToggles = $("[data-filter-menu-toggle]");
    let $menuHeader = $navWrap.find(".filter-menu_header");
    let $menuFilters = $navWrap.find(".filter-menu_filters");
    let $menuButton = $navWrap.find(".menu-btn");

    let tl = gsap.timeline({ defaults: { duration: 0.5, ease: "main" } });

    const openNav = () => {
      $navWrap.attr("data-filters", "open");

      tl.clear()
        .set($navWrap, { display: "flex" })
        .set($menu, { xPercent: 0 }, "<")
        .fromTo($overlay, { autoAlpha: 0 }, { autoAlpha: 1 }, "<")
        .fromTo(
          $bgPanels,
          { xPercent: 101 },
          { xPercent: 0, duration: 0.575 },
          "<"
        )
        .fromTo(
          $menuHeader,
          { yPercent: 100, opacity: 0 },
          { yPercent: 0, opacity: 1, stagger: 0.2 },
          "<+=0.15"
        )
        .fromTo(
          $menuButton,
          { rotate: -180, scale: 0 },
          { rotate: 0, scale: 1 },
          "<"
        )
        .fromTo(
          $menuFilters,
          { yPercent: 100, opacity: 0 },
          { yPercent: 0, opacity: 1, stagger: 0.2 },
          "<+=0.15"
        );
    };

    const closeNav = () => {
      $navWrap.attr("data-filters", "closed");

      tl.clear()
        .to($overlay, { autoAlpha: 0 })
        .to($menu, { xPercent: 101 }, "<")
        .set($navWrap, { display: "none" });
    };

    // Toggle menu open / close depending on its current state
    $menuToggles.each(function() {
      $(this).on("click", function() {
        state = $navWrap.attr("data-filters");
        if (state === "open") {
          closeNav();
        } else {
          openNav();
        }
      });
    });

    // If menu is open, you can close it using the "escape" key
    // Use namespaced event to easily unbind it later
    $(document).on("keydown.filterEscape", function(e) {
      if (
        e.key === "Escape" &&
        $navWrap.attr("data-filters") === "open"
      ) {
        closeNav();
      }
    });
  }
}

function initFinsweet() {
  // Initialize specific Finsweet attributes if they exist
  const fsAttributesToInit = ['cmsfilter', 'cmsselect', 'rangeslider'];
  
  fsAttributesToInit.forEach(attr => {
    if (window.fsAttributes && window.fsAttributes[attr] && typeof window.fsAttributes[attr].init === 'function') {
      console.log(`Initializing ${attr}`);
      window.fsAttributes[attr].init();
    }
  });
}
