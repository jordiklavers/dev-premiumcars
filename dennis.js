gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase);

let scroll;
let transitionOffset = 825;
let stackedIndex = 2;
CustomEase.create("elastic-css", ".2, 1.33, .25 ,1");
CustomEase.create("ease-in-css", ".25, 1, 0.1 ,1");

initPageTransitions();

// Animation - Page Loader
function initLoaderShort() { 

   var tl = gsap.timeline();

   tl.set(".loading-container .logo .overlay", { 
      scaleX: 0,
   });

   tl.set(".loading-container .copyright-visual", { 
      scale: 0.9,
      autoAlpha: 0,
   }, "0");

   tl.set(".loading-container .logo svg", { 
      yPercent: -100,
      rotate: 6,
   }, "0");

   tl.set(".loading-screen", { 
      yPercent: -150,
      rotate: -6,
      duration: 0.8,
      scaleX: 1.1,
      scaleY: 1.05,
      stagger: 0.025,
      ease: "Expo.easeInOut"
   }, "0");
   
   tl.set(".transition-screen", { 
      yPercent: -150,
      rotate: 6,
      scaleX: 1.1,
      scaleY: 1.05,
   }, "0");

   tl.set(".cookie-jar", { 
      yPercent: 0,
      rotate: 0.001,
      opacity: 1,
   }, "< 2");

   tl.call(function() {
      scroll.stop();
   }, null, 0);

   tl.call(function() {
      pageTransitionOut();
   }, null, 0);

   tl.call(function() {
      $('[data-page-transition-bottom]').attr('data-page-transition-bottom', 'not-active');
   }, null, 0);

   tl.call(function() {
      $('[data-page-transition]').attr('data-page-transition', 'not-active');
   }, null, 0);

}

// Animation - Page Loader
function initLoader() { 

   var tl = gsap.timeline();
   var transitionOffset = 1.2;

   tl.set("html", { 
      cursor: "wait"
   });

   tl.set(".loading-screen", { 
      yPercent: 0,
      rotate: 0.001,
      scaleX: 1.1,
      scaleY: 1.05,
      transformOrigin: "left bottom"
   });

   tl.set(".transition-screen", { 
      yPercent: 0,
      rotate: 0.001,
      scaleX: 1.1,
      scaleY: 1.05,
      transformOrigin: "right bottom"
   });

   tl.set(".cookie-jar", { 
      yPercent: 130,
      rotate: 0.001,
      transformOrigin: "right bottom",
      rotate: -6,
      opacity: 0
   });

   tl.to(".loading-container .logo .overlay", { 
      scaleX: 0,
      duration: transitionOffset,
      ease: "Expo.easeInOut"
   });

   tl.to(".loading-container .copyright-visual", { 
      scale: 0.9,
      autoAlpha: 0,
      duration: 0.8,
      ease: "Expo.easeIn",
   }, transitionOffset - 0.35);

   tl.to(".loading-container .logo svg", { 
      yPercent: -100,
      rotate: 6,
      duration: 0.8,
      ease: "Expo.easeIn"
   }, transitionOffset - 0.25);

   tl.to(".loading-screen", { 
      yPercent: -100,
      rotate: -6,
      duration: 0.8,
      scaleX: 1.1,
      scaleY: 1.05,
      stagger: 0.025,
      ease: "Expo.easeInOut"
   }, transitionOffset + 0.2);
   
   tl.to(".transition-screen", { 
      yPercent: -100,
      rotate: 6,
      duration: 0.8,
      scaleX: 1.1,
      scaleY: 1.05,
      stagger: 0.025,
      ease: "Expo.easeInOut"
   }, "< 0.35");

   tl.to(".cookie-jar", { 
      yPercent: 0,
      rotate: 0.001,
      duration: 0.8,
      opacity: 1,
      ease: "elastic-css",
      clearProps: "all"
   }, "< 2");

   tl.set("html", { 
      cursor: "auto",
   }, transitionOffset + 0.6);

   tl.call(function() {
      scroll.stop();
   }, null, 0);

   tl.call(function() {
      pageTransitionOut();
   }, null, transitionOffset + 0.6);

   tl.call(function() {
      $('[data-page-transition-bottom]').attr('data-page-transition-bottom', 'not-active');
   }, null, transitionOffset + 0.6);

   tl.call(function() {
      $('[data-page-transition]').attr('data-page-transition', 'not-active');
   }, null, transitionOffset + 1);

}

// Animation - Page Leave
function pageTransitionIn() {
	var tl = gsap.timeline();

   if(document.querySelector('.lorem-ipsum')) {}

   tl.set(".transition-screen", { 
      yPercent: 100,
      rotate: -6,
      scaleX: 1.1,
      scaleY: 1.05,
      transformOrigin: "right top"
   });

   tl.to(".transition-screen", { 
      yPercent: 0,
      rotate: 0.001,
      duration: 0.8,
      scaleX: 1.1,
      scaleY: 1.05,
      stagger: 0.025,
      ease: "Expo.easeInOut"
   });
   
   tl.set(".transition-screen", { 
      transformOrigin: "right bottom"
   });

   tl.to(".transition-screen", { 
      delay: 0.05,
      yPercent: -100,
      rotate: 6,
      duration: 0.8,
      scaleX: 1.1,
      scaleY: 1.05,
      stagger: 0.025,
      ease: "Expo.easeInOut"
   }, "0.6");

   tl.call(function() {
      scroll.stop();
   }, null, 0);

   tl.call(function() {
      $('[data-page-transition-bottom]').attr('data-page-transition-bottom', 'active');
   }, null, 0.3);

   tl.call(function() {
      $('[data-page-transition]').attr('data-page-transition', 'active');
   }, null, 0.5);

   tl.call(function() {
      $('[data-page-transition-bottom]').attr('data-page-transition-bottom', 'not-active');
   }, null, 1);

   tl.call(function() {
      $('[data-page-transition]').attr('data-page-transition', 'not-active');
   }, null, 1.2);

}

// Animation - Page Enter
function pageTransitionOut() {
	var tl = gsap.timeline();

   if(document.querySelector('.split-words.animate-transition')) {
      tl.set(".split-words.animate-transition .single-word-inner", { 
         yPercent: 120,
         rotate: 6,
      });
   }

   if(document.querySelector('.split-words.animate-transition')) {
      tl.to(".split-words.animate-transition .single-word-inner", { 
         yPercent: 0,
         rotate: 0.001,
         stagger: 0.05,
         duration: 1,
         ease: "elastic-css",
         delay: 0.3,
         clearProps: "all"
      });
   }

   if(document.querySelector('.animate-slide-in')) {
      tl.fromTo(".animate-slide-in", {
         yPercent: 101
      }, {
         yPercent: 0,
         rotate: 0.001,
         stagger: 0.05,
         duration: 1,
         ease: "ease-in-css",
         delay: 0.2,
         clearProps: "all"
      }, "<");
   }

   if(document.querySelector('.animate-fade-in')) {
      tl.fromTo(".animate-fade-in", {
         y: "40px",
         opacity: 0,
      }, {
         y: "0px",
         opacity: 1,
         rotate: 0.001,
         stagger: 0.05,
         duration: 1,
         ease: "elastic-css",
         clearProps: "all"
      }, "<");
   }
  
   tl.call(function() {
      scroll.start();
   }, null, 0);

   tl.call(function() {
      initLoopLines();
   }, null, 0.2);

   tl.call(function() {
      ScrollTrigger.refresh();
   }, null, 0.4);

}

function initPageTransitions() {

   // Reset scroll on page next
   history.scrollRestoration = "manual";

   barba.hooks.afterEnter(() => {
      window.scrollTo(0, 0);
      ScrollTrigger.refresh();
   });
   
   barba.hooks.leave(() => {
      initBasicFunctions();
   });

   // Functions Before
   function initResetDataBefore() {
      // $('[data-navigation-status]').attr('data-navigation-status', 'not-active');
   }

   // Functions After
   function initResetDataAfter() {
      $('[data-navigation-status]').attr('data-navigation-status', 'not-active');
      $('[data-scrolling-direction]').attr('data-scrolling-direction', 'down');
      $('[data-scrolling-started]').attr('data-scrolling-started', 'false');
      stackedIndex = 2;
      $('[data-stacked-image-id]').removeAttr('style');
      $('.single-stacked-image[data-link-status="active"]').css('z-index', stackedIndex).attr('data-stacked-image-status', 'active').siblings().attr('data-stacked-image-status', 'not-active');
      $('[data-nav-id]').parent().parent().attr('data-links-hover', 'false');
      $('[data-cursor-init]').attr('data-cursor-init', 'false');
      $('[data-cursor-bubble]').attr('data-cursor-bubble', 'not-active');
      $('[data-cursor-status-drag]').attr('data-cursor-status-drag', 'not-active');
      $('[data-cursor-status-move]').attr('data-cursor-status-move', 'not-active');
   }


   barba.init({
      sync: true,
      debug: true,
      timeout:7000,
      transitions: [{
         name: 'self',
         async leave(data) {
            pageTransitionIn(data.current);
            initResetDataBefore();
            await delay(transitionOffset);
            initBarbaNavUpdate(data);
            initResetDataAfter();
            scroll.destroy();
            data.current.container.remove();
         },
         async enter(data) {
            pageTransitionOut(data.next);
         },
         async beforeEnter(data) {
            ScrollTrigger.getAll().forEach(t => t.kill());
            initSmoothScroll(data.next.container);
            initScript(); 
         },
      },{
         name: 'default',
         once(data) {
            initSmoothScroll(data.next.container);
            initScript();
            initLoader();
         },
         async leave(data) {
            pageTransitionIn(data.current);
            initResetDataBefore();
            await delay(transitionOffset);
            initBarbaNavUpdate(data);
            initResetDataAfter();
            scroll.destroy();
            data.current.container.remove();
         },
         async enter(data) {
            pageTransitionOut(data.next);
         },
         async beforeEnter(data) {
            ScrollTrigger.getAll().forEach(t => t.kill());
            initSmoothScroll(data.next.container);
            initScript(); 
         },
      }]
   });

   function initSmoothScroll(container) {

      // Lenis: https://github.com/studio-freight/lenis
      scroll = new Lenis({
         // duration: 1
      });
     
      scroll.on('scroll', ScrollTrigger.update);

      gsap.ticker.add((time)=>{
         scroll.raf(time * 1000)
      });
      
      gsap.ticker.lagSmoothing(0)
      
      ScrollTrigger.refresh();
   }  
}  
