import studioFreightlenis from "https://cdn.jsdelivr.net/npm/@studio-freight/lenis@1.0.42/+esm";

gsap.registerPlugin(CustomEase, ScrollTrigger, Flip);

// let lenis;
let transitionOffset = 800; /* ms */

CustomEase.create("main", "0.65, 0.01, 0.05, 0.99");
gsap.defaults({ ease: "main" });

$("document").ready(function () {
  initFunctions();
});

function initFunctions() {
  initLenis();
  initGlobalParallax();
  initDetectScrollingDirection();
  initMenu();
  initMenuDropdownHover();
  initDynamicCurrentTime();
  initSwipers();
  initVoorraad();
  initVoorraadFilter();
  initTabsComponent();
  initGallerySwiper();
  initScrollTriggerAnimations();
  initBasicFormValidation();
  initMWG031();
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

  $(window).on("scroll", function () {
    const nowScrollTop = $(window).scrollTop();

    if (Math.abs(lastScrollTop - nowScrollTop) >= threshold) {
      // Update Scroll Direction
      const direction = nowScrollTop > lastScrollTop ? "down" : "up";
      $("[data-scrolling-direction]").attr(
        "data-scrolling-direction",
        direction
      );

      // Update Scroll Started
      const started = nowScrollTop > thresholdTop;
      $("[data-scrolling-started]").attr(
        "data-scrolling-started",
        started ? "true" : "false"
      );

      lastScrollTop = nowScrollTop;
    }
  });
}

function initGlobalParallax() {
  const mm = gsap.matchMedia();

  mm.add(
    {
      isMobile: "(max-width:479px)",
      isMobileLandscape: "(max-width:767px)",
      isTablet: "(max-width:991px)",
      isDesktop: "(min-width:992px)",
    },
    (context) => {
      const { isMobile, isMobileLandscape, isTablet } = context.conditions;

      const ctx = gsap.context(() => {
        document
          .querySelectorAll('[data-parallax="trigger"]')
          .forEach((trigger) => {
            // Check if this trigger has to be disabled on smaller breakpoints
            const disable = trigger.getAttribute("data-parallax-disable");
            if (
              (disable === "mobile" && isMobile) ||
              (disable === "mobileLandscape" && isMobileLandscape) ||
              (disable === "tablet" && isTablet)
            ) {
              return;
            }

            // Optional: you can target an element inside a trigger if necessary
            const target =
              trigger.querySelector('[data-parallax="target"]') || trigger;

            // Get the direction value to decide between xPercent or yPercent tween
            const direction =
              trigger.getAttribute("data-parallax-direction") || "vertical";
            const prop = direction === "horizontal" ? "xPercent" : "yPercent";

            // Get the scrub value, our default is 'true' because that feels nice with Lenis
            const scrubAttr = trigger.getAttribute("data-parallax-scrub");
            const scrub = scrubAttr ? parseFloat(scrubAttr) : true;

            // Get the start position in %
            const startAttr = trigger.getAttribute("data-parallax-start");
            const startVal = startAttr !== null ? parseFloat(startAttr) : 20;

            // Get the end position in %
            const endAttr = trigger.getAttribute("data-parallax-end");
            const endVal = endAttr !== null ? parseFloat(endAttr) : -20;

            // Get the start value of the ScrollTrigger
            const scrollStartRaw =
              trigger.getAttribute("data-parallax-scroll-start") ||
              "top bottom";
            const scrollStart = `clamp(${scrollStartRaw})`;

            // Get the end value of the ScrollTrigger
            const scrollEndRaw =
              trigger.getAttribute("data-parallax-scroll-end") || "bottom top";
            const scrollEnd = `clamp(${scrollEndRaw})`;

            gsap.fromTo(
              target,
              { [prop]: startVal },
              {
                [prop]: endVal,
                ease: "none",
                scrollTrigger: {
                  trigger,
                  start: scrollStart,
                  end: scrollEnd,
                  scrub,
                },
              }
            );
          });
      });

      return () => ctx.revert();
    }
  );
}

function initMenu() {
  // First clean up any existing event listeners to prevent duplicates
  $("[data-menu-toggle]").off("click");
  $(document).off("keydown.menuEscape");
  $(".menu-link").off("click.menuClose");

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
  $menuToggles.each(function () {
    $(this).on("click", function () {
      state = $navWrap.attr("data-nav");
      if (state === "open") {
        closeNav();
      } else {
        openNav();
      }
    });
  });

  // Add click handler for menu links to close menu before navigation
  $menuLinks.on("click.menuClose", function () {
    if ($navWrap.attr("data-nav") === "open") {
      closeNav();
    }
  });

  // If menu is open, you can close it using the "escape" key
  // Use namespaced event to easily unbind it later
  $(document).on("keydown.menuEscape", function (e) {
    if (e.key === "Escape" && $navWrap.attr("data-nav") === "open") {
      closeNav();
    }
  });

  // Return the closeNav function so it can be used elsewhere
  return { closeNav };
}

function initMenuDropdownHover() {
  $('[data-aanbod-dropdown-action="hover"]')
    .on("mouseenter", function () {
      if (!window.matchMedia("(hover: none) and (pointer: coarse)").matches) {
        if (
          $(".nav-secondary").attr("data-aanbod-dropdown-status") ===
          "not-active"
        ) {
          $(".nav-secondary").attr("data-aanbod-dropdown-status", "active");
        }
      }
    })
    .on("mouseleave", function () {
      if (!window.matchMedia("(hover: none) and (pointer: coarse)").matches) {
        if (
          $(".nav-secondary").attr("data-aanbod-dropdown-status") === "active"
        ) {
          $(".nav-secondary").attr("data-aanbod-dropdown-status", "not-active");
        }
      }
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
    $("[data-current-time]").each(function () {
      const timezone = $(this).attr("data-current-time") || defaultTimezone;
      const formatter = createFormatter(timezone);
      const now = new Date();
      const formattedTime = formatter.format(now);
      // Capitalize first letter of the day
      $(this).text(
        formattedTime.replace(/^[a-z]/, (letter) => letter.toUpperCase())
      );
    });
  };

  // Initial update and interval for subsequent updates
  updateTime();
  setInterval(updateTime, 1000);
}

function initSwipers() {
  // Add the updateSlideInfo function
  function updateSlideInfo(swiper) {
    const currentSlide = swiper.realIndex + 1;
    const totalSlides = swiper.slides.length;

    // Format numbers to always have two digits
    const formattedCurrent = String(currentSlide).padStart(2, "0");
    const formattedTotal = String(totalSlides).padStart(2, "0");

    // Update the slide info elements
    $("[data-swiper-current]").text(formattedCurrent);
    $("[data-swiper-total]").text(formattedTotal);
  }

  const reviewsSwiper = new Swiper(".swiper.is-reviews", {
    speed: 500,
    slidesPerView: 3,
    spaceBetween: 24,
    createElements: true,
    loop: true,

    // Pagination
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },

    // Navigation
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

  const headerImageSwiper = new Swiper(".swiper.is-auto-header", {
    speed: 700,
    slidesPerView: 1.5,
    spaceBetween: 4,
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
    },
    loop: true,
    breakpoints: {
      320: {
        slidesPerView: 1.15,
      },
      640: {
        slidesPerView: 1.5,
      },
    },
    1024: {
      slidesPerView: 1.5,
    },
  });

  const autoImageSwiper = new Swiper(".swiper.is-voorraad-img", {
    slidesPerView: 1.5,
    centeredSlides: true,
    loop: true,
    speed: 500,
    autoplay: {
      delay: 5000,
    },
    navigation: {
      nextEl: "[data-swiper-next]",
      prevEl: "[data-swiper-prev]",
    },
  });
}

function initGallerySwiper() {
  // Find the gallery wrapper and its dynamic lists
  const galleryWrapper = document.querySelector(".gallery_wrapper");
  if (!galleryWrapper) return;

  const dynamicLists = galleryWrapper.querySelectorAll(".w-dyn-list");
  if (dynamicLists.length < 1) return;

  // Create Swiper container and wrapper
  const swiperContainer = document.createElement("div");
  swiperContainer.className = "swiper gallery-swiper";

  const swiperWrapper = document.createElement("div");
  swiperWrapper.className = "swiper-wrapper";
  swiperContainer.appendChild(swiperWrapper);

  // Add navigation elements
  const prevButton = document.createElement("div");
  prevButton.className = "swiper-button-prev";
  swiperContainer.appendChild(prevButton);

  const nextButton = document.createElement("div");
  nextButton.className = "swiper-button-next";
  swiperContainer.appendChild(nextButton);

  // Get all images from the dynamic lists
  const images = galleryWrapper.querySelectorAll(".gallery_image");

  // Create slides for each image
  images.forEach((img) => {
    const slide = document.createElement("div");
    slide.className = "swiper-slide";

    // Clone the image to preserve all attributes
    const newImg = img.cloneNode(true);
    slide.appendChild(newImg);
    swiperWrapper.appendChild(slide);
  });

  // Replace gallery wrapper content with Swiper
  galleryWrapper.innerHTML = "";
  galleryWrapper.appendChild(swiperContainer);

  // Initialize Swiper with voorraad-like configuration
  new Swiper(".gallery-swiper", {
    slidesPerView: 1.75,
    centeredSlides: true,
    loop: true,
    speed: 500,
    autoplay: {
      delay: 5000,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  });
}

function initVoorraad() {
  // Count the number of voorraad items
  const voorraadItems = $(".voorraad-row.grid-main").children().length;

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
  let $viewSwitchButtons = $viewSwitchWrapper.find(
    ".voorraad_list-switch-item"
  );

  $viewSwitchButtons.on("click", function () {
    handleViewChange();
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
    $menuToggles.each(function () {
      $(this).on("click", function () {
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
    $(document).on("keydown.filterEscape", function (e) {
      if (e.key === "Escape" && $navWrap.attr("data-filters") === "open") {
        closeNav();
      }
    });
  }
}

function initFinsweet() {
  // Initialize specific Finsweet attributes if they exist
  const fsAttributesToInit = ["cmsfilter", "cmsselect", "rangeslider"];

  fsAttributesToInit.forEach((attr) => {
    if (
      window.fsAttributes &&
      window.fsAttributes[attr] &&
      typeof window.fsAttributes[attr].init === "function"
    ) {
      window.fsAttributes[attr].init();
    }
  });
}

function initScrollTriggerAnimations() {
  // Home Hero - Parralax
  $(".section_home-header").each(function () {
    let trigger = $(this);
    let textContent = $(this).find(".home-header_col");

    let tl = gsap.timeline({
      scrollTrigger: {
        trigger: trigger,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });

    tl.fromTo(
      textContent,
      {
        y: "0rem",
      },
      {
        y: "-5rem",
        ease: "linear",
      }
    );

    tl.fromTo(
      trigger,
      {
        clipPath: "inset(0% 0% 0% 0%)",
      },
      {
        clipPath: "inset(0% 0% 10% 0%)",
        ease: "linear",
      },
      "<"
    );
  });
  // Verkoopservice - Parralax
  $(".section_proces").each(function () {
    let trigger = $(this);
    let imageItem = $(this).find(".proces_img-wrap");
    let textContent = $(this).find(".proces_text-wrap");

    let tl = gsap.timeline({
      scrollTrigger: {
        trigger: trigger,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });

    tl.fromTo(
      textContent,
      {
        y: "5rem",
      },
      {
        y: "-5rem",
        ease: "linear",
      }
    );
  });
}

function initBasicFormValidation() {
  const forms = document.querySelectorAll("[data-form-validate]");

  forms.forEach((form) => {
    const fields = form.querySelectorAll(
      "[data-validate] input, [data-validate] textarea"
    );
    const submitButtonDiv = form.querySelector("[data-submit]"); // The div wrapping the submit button
    const submitInput = submitButtonDiv.querySelector('input[type="submit"]'); // The actual submit button

    // Capture the form load time
    const formLoadTime = new Date().getTime(); // Timestamp when the form was loaded

    // Function to validate individual fields (input or textarea)
    const validateField = (field) => {
      const parent = field.closest("[data-validate]"); // Get the parent div
      const minLength = field.getAttribute("min");
      const maxLength = field.getAttribute("max");
      const type = field.getAttribute("type");
      let isValid = true;

      // Check if the field has content
      if (field.value.trim() !== "") {
        parent.classList.add("is--filled");
      } else {
        parent.classList.remove("is--filled");
      }

      // Validation logic for min and max length
      if (minLength && field.value.length < minLength) {
        isValid = false;
      }

      if (maxLength && field.value.length > maxLength) {
        isValid = false;
      }

      // Validation logic for email input type
      if (type === "email" && !/\S+@\S+\.\S+/.test(field.value)) {
        isValid = false;
      }

      // Add or remove success/error classes on the parent div
      if (isValid) {
        parent.classList.remove("is--error");
        parent.classList.add("is--success");
      } else {
        parent.classList.remove("is--success");
        parent.classList.add("is--error");
      }

      return isValid;
    };

    // Function to start live validation for a field
    const startLiveValidation = (field) => {
      field.addEventListener("input", function () {
        validateField(field);
      });
    };

    // Function to validate and start live validation for all fields, focusing on the first field with an error
    const validateAndStartLiveValidationForAll = () => {
      let allValid = true;
      let firstInvalidField = null;

      fields.forEach((field) => {
        const valid = validateField(field);
        if (!valid && !firstInvalidField) {
          firstInvalidField = field; // Track the first invalid field
        }
        if (!valid) {
          allValid = false;
        }
        startLiveValidation(field); // Start live validation for all fields
      });

      // If there is an invalid field, focus on the first one
      if (firstInvalidField) {
        firstInvalidField.focus();
      }

      return allValid;
    };

    // Anti-spam: Check if form was filled too quickly
    const isSpam = () => {
      const currentTime = new Date().getTime();
      const timeDifference = (currentTime - formLoadTime) / 1000; // Convert milliseconds to seconds
      return timeDifference < 5; // Return true if form is filled within 5 seconds
    };

    // Handle clicking the custom submit button
    submitButtonDiv.addEventListener("click", function () {
      // Validate the form first
      if (validateAndStartLiveValidationForAll()) {
        // Only check for spam after all fields are valid
        if (isSpam()) {
          alert("Form submitted too quickly. Please try again.");
          return; // Stop form submission
        }
        submitInput.click(); // Simulate a click on the <input type="submit">
      }
    });

    // Handle pressing the "Enter" key
    form.addEventListener("keydown", function (event) {
      if (event.key === "Enter" && event.target.tagName !== "TEXTAREA") {
        event.preventDefault(); // Prevent the default form submission

        // Validate the form first
        if (validateAndStartLiveValidationForAll()) {
          // Only check for spam after all fields are valid
          if (isSpam()) {
            alert("Form submitted too quickly. Please try again.");
            return; // Stop form submission
          }
          submitInput.click(); // Trigger our custom form submission
        }
      }
    });
  });
}

function initMWG031() {
  const slides = document.querySelectorAll(".mwg_effect031 .slide");

  slides.forEach((slide) => {
    const contentWrapper = slide.querySelector(".content-wrapper");
    const content = slide.querySelector(".content");

    gsap.to(content, {
      rotationZ: (Math.random() - 0.5) * 10, // RotationZ between -5 and 5 degrees
      scale: 0.7, // Slight reduction of the content
      rotationX: 40,
      ease: "power1.in", // Starts gradually
      scrollTrigger: {
        pin: contentWrapper, // contentWrapper is pinned during the animation
        trigger: slide, // Listens to the slide’s position
        start: "top 0%", // Starts when its top reaches the top of the viewport
        end: "+=" + window.innerHeight, // Ends 100vh later
        scrub: true, // Progresses with the scroll
      },
    });

    gsap.to(content, {
      autoAlpha: 0, // Ends at opacity: 0 and visibility: hidden
      ease: "power1.in", // Starts gradually
      scrollTrigger: {
        trigger: content, // Listens to the position of content
        start: "top -80%", // Starts when the top exceeds 80% of the viewport
        end: "+=" + 0.2 * window.innerHeight, // Ends 20% later
        scrub: true, // Progresses with the scroll
      },
    });
  });
}

// -- Auto Pagina -- //

function initTabsComponent() {
  const wrappers = document.querySelectorAll('[data-tabs="wrapper"]');

  wrappers.forEach((wrapper) => {
    const contentItems = wrapper.querySelectorAll('[data-tabs="content-item"]');
    const visualItems = wrapper.querySelectorAll('[data-tabs="visual-item"]');

    const autoplay = wrapper.dataset.tabsAutoplay === "true";
    const autoplayDuration =
      parseInt(wrapper.dataset.tabsAutoplayDuration) || 5000;

    let activeContent = null; // keep track of active item/link
    let activeVisual = null;
    let isAnimating = false;
    let progressBarTween = null; // to stop/start the progress bar

    function startProgressBar(index) {
      if (progressBarTween) progressBarTween.kill();
      const bar = contentItems[index].querySelector(
        '[data-tabs="item-progress"]'
      );
      if (!bar) return;

      // In this function, you can basically do anything you want, that should happen as a tab is active
      // Maybe you have a circle filling, some other element growing, you name it.
      gsap.set(bar, { scaleX: 0, transformOrigin: "left center" });
      progressBarTween = gsap.to(bar, {
        scaleX: 1,
        duration: autoplayDuration / 1000,
        ease: "power1.inOut",
        onComplete: () => {
          if (!isAnimating) {
            const nextIndex = (index + 1) % contentItems.length;
            switchTab(nextIndex); // once bar is full, set next to active – this is important
          }
        },
      });
    }

    function switchTab(index) {
      if (isAnimating || contentItems[index] === activeContent) return;

      isAnimating = true;
      if (progressBarTween) progressBarTween.kill(); // Stop any running progress bar here

      const outgoingContent = activeContent;
      const outgoingVisual = activeVisual;
      const outgoingBar = outgoingContent?.querySelector(
        '[data-tabs="item-progress"]'
      );

      const incomingContent = contentItems[index];
      const incomingVisual = visualItems[index];
      const incomingBar = incomingContent.querySelector(
        '[data-tabs="item-progress"]'
      );

      outgoingContent?.classList.remove("active");
      outgoingVisual?.classList.remove("active");
      incomingContent.classList.add("active");
      incomingVisual.classList.add("active");

      const tl = gsap.timeline({
        defaults: { duration: 0.65, ease: "power3" },
        onComplete: () => {
          activeContent = incomingContent;
          activeVisual = incomingVisual;
          isAnimating = false;
          if (autoplay) startProgressBar(index); // Start autoplay bar here
        },
      });

      // Wrap 'outgoing' in a check to prevent warnings on first run of the function
      // Of course, during first run (on page load), there's no 'outgoing' tab yet!
      if (outgoingContent) {
        outgoingContent.classList.remove("active");
        outgoingVisual?.classList.remove("active");
        tl.set(outgoingBar, { transformOrigin: "right center" })
          .to(outgoingBar, { scaleX: 0, duration: 0.3 }, 0)
          .to(outgoingVisual, { autoAlpha: 0, xPercent: 3 }, 0);
      }

      incomingContent.classList.add("active");
      incomingVisual.classList.add("active");
      tl.fromTo(
        incomingVisual,
        { autoAlpha: 0, xPercent: 3 },
        { autoAlpha: 1, xPercent: 0 },
        0.3
      ).set(incomingBar, { scaleX: 0, transformOrigin: "left center" }, 0);
    }

    // on page load, set first to active
    // idea: you could wrap this in a scrollTrigger
    // so it will only start once a user reaches this section
    switchTab(0);

    // switch tabs on click
    contentItems.forEach((item, i) =>
      item.addEventListener("click", () => {
        if (item === activeContent) return; // ignore click if current one is already active
        switchTab(i);
      })
    );
  });
}
