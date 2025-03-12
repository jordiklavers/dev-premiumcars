import gsap from "https://cdn.skypack.dev/gsap";
import ScrollTrigger from "https://cdn.skypack.dev/gsap/ScrollTrigger";
import lagrangeBarbaCore from 'https://cdn.skypack.dev/@lagrange/barba-core';
import Lenis from "https://cdn.jsdelivr.net/npm/@studio-freight/lenis@1.0.42/+esm";

let lenis;
let transitionOffset = 800; /* ms */

initPageTransitions();

// Animation - Page Leave
function pageTransitionIn() {
  // Your page leave animation code here
  console.log("Page transition in (leave)");
  
  var tl = gsap.timeline();
  
  tl.call(function () {
    lenis.stop();
  });
  
  // Add your leave animations here
  
  return tl;
}

// Animation - Page Enter
function pageTransitionOut() {
  // Your page enter animation code here
  console.log("Page transition out (enter)");
  
  var tl = gsap.timeline();
  
  tl.call(function () {
    lenis.start();
    ScrollTrigger.refresh();
  }, null, 0);
  
  // Add your enter animations here
  
  return tl;
}

function initPageTransitions() {
  // # Common: leave (Before Offset)
  async function commonLeaveBeforeOffset(data) {
    pageTransitionIn(data.current);
    // Reset navigation states
    $('[data-navigation-status]').attr('data-navigation-status', 'not-active');
    $('[data-scrolling-direction]').attr('data-scrolling-direction', 'down');
    $('[data-scrolling-started]').attr('data-scrolling-started', 'false');
  }

  // # Common: leave (After Offset)
  async function commonLeaveAfterOffset(data) {
    lenis.destroy();
    killAllScrollTriggers();
    data.current.container.remove();
    await delay(100);
    // Reset navigation states again
    $('[data-navigation-status]').attr('data-navigation-status', 'not-active');
    $('[data-scrolling-direction]').attr('data-scrolling-direction', 'down');
    $('[data-scrolling-started]').attr('data-scrolling-started', 'false');
  }

  // # Common: enter
  async function commonEnter(data) {
    initBarbaNavUpdate(data);
    pageTransitionOut(data.next);
  }

  // # Common: beforeEnter
  async function commonBeforeEnter(data) {
    ScrollTrigger.getAll().forEach(t => t.kill());
    initResetWebflow(data);
    initSmoothScroll(data.next.container);
    initScript();
  }

  // # Common: afterEnter
  async function commonAfterEnter(data) {
    window.scrollTo(0, 0);
    ScrollTrigger.refresh();
  }

  barba.init({
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
      name: 'default',
      once(data) {
        initSmoothScroll(data.next.container);
        initScript();
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
    },
    // Add more transitions as needed
    {
      name: 'custom-transition',
      from: {}, // Define source route
      to: {
        namespace: ['your-namespace'] // Define target route
      },
      once(data) {
        // Initialize on first load
        initSmoothScroll(data.next.container);
        initScript();
      },
      async leave(data) {
        // Custom leave animation
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
  });

  function initSmoothScroll(container) {
    initLenis();
    ScrollTrigger.refresh();
  }

  // Function to kill all ScrollTrigger data
  function killAllScrollTriggers() {
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.killAll(); // Kill all ScrollTrigger instances
    }
  }

  // Reset scroll on page next
  history.scrollRestoration = "manual";
}

function initLenis() {
  // Lenis smooth scrolling
  lenis = new Lenis({
    // Configure as needed
  });

  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);
}

/**
 * Barba Update Links outside Main on page Transition
 */
function initBarbaNavUpdate(data) {
  const updateItems = $(data.next.html).find('[data-barba-update]');

  $('[data-barba-update]').each(function (index) {
    if ($(updateItems[index]).get(0)) {
      const newLinkStatus = $(updateItems[index]).get(0).getAttribute('data-link-status');
      $(this).attr('data-link-status', newLinkStatus);
    }
  });
}

/**
 * Reset Webflow
 */
function initResetWebflow(data) {
  let parser = new DOMParser();
  let dom = parser.parseFromString(data.next.html, "text/html");
  let webflowPageId = dom.querySelector("html").getAttribute("data-wf-page");
  document.documentElement.setAttribute("data-wf-page", webflowPageId);
  window.Webflow.destroy();
  window.Webflow.ready();
}

/**
 * Initialize your scripts here
 */
function initScript() {
  // Add your initialization functions here
  console.log("Initializing scripts");
}

// Helper function for delays
function delay(n) {
  n = n || 2000;
  return new Promise((done) => {
    setTimeout(() => {
      done();
    }, n);
  });
}

// Add barba hooks for cleanup and reinitialization
barba.hooks.beforeLeave(() => {
  // Cleanup before leaving the page
  console.log("Before leave hook");
});

barba.hooks.after(() => {
  // Reinitialize after page transition
  console.log("After hook");
}); 