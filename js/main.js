// main.js — runs on every page

(function () {
  'use strict';

  // ── NAV SCROLL ──
  var navEl = document.querySelector('nav');
  var ticking = false;
  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(function () {
        if (navEl) navEl.classList.toggle('scrolled', window.scrollY > 100);
        ticking = false;
      });
      ticking = true;
    }
  });

  // ── MOBILE TOGGLE ──
  var toggleBtn = document.getElementById('mobileToggle');
  var mobileNav = document.getElementById('mobileNav');
  if (toggleBtn && mobileNav) {
    toggleBtn.setAttribute('aria-expanded', 'false');
    toggleBtn.setAttribute('aria-controls', 'mobileNav');
    var setOpen = function (open) {
      mobileNav.classList.toggle('open', open);
      toggleBtn.setAttribute('aria-expanded', String(open));
    };
    toggleBtn.addEventListener('click', function () {
      setOpen(!mobileNav.classList.contains('open'));
    });
    // The toggle disappears above the breakpoint, so an open menu there
    // would be undismissable.
    window.addEventListener('resize', function () {
      if (window.innerWidth > 900) setOpen(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setOpen(false);
    });
    mobileNav.querySelectorAll('a').forEach(function (link) {
      // setOpen, not classList.remove: the latter left aria-expanded stale.
      link.addEventListener('click', function () {
        setOpen(false);
      });
    });
  }

  // ── REVEAL OBSERVER ──
  var revealCount = 0;
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var delay = (revealCount % 4) * 80;
        revealCount++;
        setTimeout(function () {
          entry.target.classList.add('visible');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0, rootMargin: '0px 0px -8% 0px' });

  /* Safety net. Hiding is opt-in now, but if JS runs and the observer never
     fires the content would still be stuck invisible: a background or hidden
     tab throttles IntersectionObserver, and some embedded viewers never
     deliver it at all. Reveal everything unconditionally after a grace
     period, so the animation is a nicety and never a prerequisite. */
  function revealAll() {
    document.querySelectorAll('.reveal:not(.visible)').forEach(function (el) {
      el.classList.add('visible');
    });
  }
  setTimeout(revealAll, 2500);
  // A tab that was hidden at load gets its chance as soon as it is looked at.
  document.addEventListener('visibilitychange', function () {
    if (!document.hidden) setTimeout(revealAll, 400);
  });

  // Opt in to the hidden-until-revealed state only now that JS is running.
  document.documentElement.classList.add('js-reveal');

  document.querySelectorAll('.reveal').forEach(function (el) {
    observer.observe(el);
  });

}());
