(function(){
  "use strict";

  /* Footer year */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* Footer share button */
  var shareBtn = document.getElementById('shareBtn');
  if (shareBtn) {
    var shareLabel = shareBtn.querySelector('span');
    var defaultLabel = shareLabel.textContent;
    var shareUrl = window.location.href.replace(/profile\.html.*$/, '');

    var resetTimer;
    function showCopiedFeedback(){
      shareLabel.textContent = 'Link copied!';
      shareBtn.classList.add('is-copied');
      clearTimeout(resetTimer);
      resetTimer = setTimeout(function(){
        shareLabel.textContent = defaultLabel;
        shareBtn.classList.remove('is-copied');
      }, 2000);
    }

    shareBtn.addEventListener('click', function(){
      if (navigator.share) {
        navigator.share({ title: document.title, text: 'Body Mind Zari — facial & body lymphatic therapy', url: shareUrl }).catch(function(){});
      } else if (navigator.clipboard) {
        navigator.clipboard.writeText(shareUrl).then(showCopiedFeedback);
      } else {
        showCopiedFeedback();
      }
    });
  }

  /* Mobile nav toggle */
  var toggle = document.getElementById('navToggle');
  var nav = document.querySelector('.site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function(){
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* Scroll reveal */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(function(el){ io.observe(el); });
  } else {
    revealEls.forEach(function(el){ el.classList.add('is-visible'); });
  }

  /* Parallax (background-strip image + gallery items) */
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var parallaxEls = document.querySelectorAll('[data-speed]');
  var driftEls = document.querySelectorAll('[data-drift]');
  var ticking = false;

  function updateParallax(){
    var vh = window.innerHeight;
    parallaxEls.forEach(function(el){
      var speed = parseFloat(el.getAttribute('data-speed')) || 0.1;
      var rect = el.getBoundingClientRect();
      var center = rect.top + rect.height / 2 - vh / 2;
      var offset = center * speed * -1;
      el.style.transform = 'translate3d(0,' + offset.toFixed(1) + 'px,0)';
    });

    /* Fixed-position background decor drifts with scroll position itself,
       since its own bounding rect never changes while pinned to the viewport. */
    var y = window.scrollY;
    driftEls.forEach(function(el){
      var speed = parseFloat(el.getAttribute('data-drift')) || 0.05;
      el.style.transform = 'translate3d(0,' + (y * speed).toFixed(1) + 'px,0)';
    });

    ticking = false;
  }

  function onScroll(){
    if (!ticking) {
      window.requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }

  if (!prefersReduced && (parallaxEls.length || driftEls.length)) {
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    updateParallax();
  }

  /* Header shadow on scroll */
  var header = document.querySelector('.site-header');
  function onHeaderScroll(){
    if (window.scrollY > 12) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onHeaderScroll, { passive: true });
  onHeaderScroll();

})();
