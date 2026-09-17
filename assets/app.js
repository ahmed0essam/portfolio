/* Portfolio interactions. Deliberately small: a mobile nav toggle, the
   footer year, and scroll-spy on the nav. No framework, no dependencies. */
(function () {
  "use strict";

  /* ---------- footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- mobile nav ---------- */
  var burger = document.getElementById("burger");
  var links = document.getElementById("nav-links");

  function closeNav() {
    if (!burger || !links) return;
    burger.setAttribute("aria-expanded", "false");
    links.setAttribute("data-open", "false");
  }

  if (burger && links) {
    burger.addEventListener("click", function () {
      var open = burger.getAttribute("aria-expanded") === "true";
      burger.setAttribute("aria-expanded", String(!open));
      links.setAttribute("data-open", String(!open));
    });

    // Tapping a link should navigate AND close the panel, otherwise the menu
    // covers the section it just jumped to.
    links.addEventListener("click", function (e) {
      if (e.target.closest("a")) closeNav();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeNav();
    });

    // A resize past the breakpoint must clear the open state, or the desktop
    // nav inherits display:none from the mobile rule.
    window.addEventListener("resize", function () {
      if (window.innerWidth > 860) closeNav();
    });
  }

  /* ---------- scroll spy ---------- */
  var sections = Array.prototype.slice
    .call(document.querySelectorAll("main section[id]"))
    .filter(function (s) { return s.id !== "top"; });

  var navAnchors = {};
  Array.prototype.forEach.call(document.querySelectorAll("#nav-links a[href^='#']"), function (a) {
    navAnchors[a.getAttribute("href").slice(1)] = a;
  });

  if (sections.length && "IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var a = navAnchors[entry.target.id];
          if (!a) return;
          if (entry.isIntersecting) {
            Object.keys(navAnchors).forEach(function (k) {
              navAnchors[k].removeAttribute("aria-current");
            });
            a.setAttribute("aria-current", "true");
          }
        });
      },
      // Bias towards the upper-middle of the viewport so the highlighted item
      // matches what the reader is actually looking at.
      { rootMargin: "-25% 0px -60% 0px", threshold: 0 }
    );
    sections.forEach(function (s) { observer.observe(s); });
  }
})();
