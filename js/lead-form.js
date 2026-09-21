/* Contact form. Posts to a Cloudflare Worker, because GitHub Pages is static
   and cannot receive a POST itself.

   Progressive: the <noscript> block in the markup gives the email address, and
   if the request fails for any reason the visitor is told to email instead
   rather than being left staring at a dead button. */
(function () {
  "use strict";

  var ENDPOINT = "https://ahmed-leads.hyve-dashboard.workers.dev/submit";
  var EMAIL = "ahmed0essaam@gmail.com";

  var form = document.getElementById("lead-form");
  var status = document.getElementById("lead-status");
  var button = document.getElementById("lead-submit");
  if (!form || !status || !button) return;

  // Used server-side to reject instant submissions, which are bots.
  var loadedAt = Date.now();
  var buttonLabel = button.innerHTML;

  function setStatus(msg, kind) {
    status.textContent = msg;
    status.className = "lead-status" + (kind ? " is-" + kind : "");
  }

  function clearInvalid() {
    form.querySelectorAll("[aria-invalid]").forEach(function (el) {
      el.removeAttribute("aria-invalid");
    });
  }

  /* Validate here rather than relying on the browser bubble, so the message
     sits in one place and the first bad field gets focus. */
  function firstProblem() {
    var name = form.elements.name.value.trim();
    var email = form.elements.email.value.trim();
    var website = form.elements.website.value.trim();

    if (!name) return { field: "name", msg: "Your name, so I know who I am replying to." };
    if (!email) return { field: "email", msg: "An email address, or I cannot reply." };
    if (!/^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/.test(email)) {
      return { field: "email", msg: "That email address does not look right." };
    }
    // A bare domain is what people usually type; accept it and let the server
    // store it as-is rather than rejecting a perfectly clear answer.
    if (website && /\s/.test(website)) {
      return { field: "website", msg: "One URL please, without spaces." };
    }
    return null;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    clearInvalid();

    var problem = firstProblem();
    if (problem) {
      var el = form.elements[problem.field];
      el.setAttribute("aria-invalid", "true");
      el.focus();
      setStatus(problem.msg, "error");
      return;
    }

    button.disabled = true;
    button.innerHTML = "Sending&hellip;";
    setStatus("");

    var payload = {
      name: form.elements.name.value.trim(),
      email: form.elements.email.value.trim(),
      website: form.elements.website.value.trim(),
      goal: form.elements.goal.value.trim(),
      company: form.elements.company.value.trim(), // honeypot
      elapsed: Math.round((Date.now() - loadedAt) / 1000)
    };

    fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
      .then(function (res) {
        return res.json().then(function (data) {
          return { ok: res.ok, data: data };
        });
      })
      .then(function (r) {
        if (r.ok && r.data && r.data.ok) {
          // Replace the form so there is nothing to double-submit.
          form.innerHTML =
            '<p class="lead-status is-ok">Got it. I&rsquo;ll look at your site and come back' +
            " with the three things I&rsquo;d fix first, usually within 24 hours.</p>" +
            '<p class="lead-status">Nothing arrived? Email <a href="mailto:' +
            EMAIL + '">' + EMAIL + "</a> and it will reach me.</p>";
          return;
        }
        var msg =
          r.data && Array.isArray(r.data.errors) && r.data.errors.length
            ? r.data.errors.join(" ")
            : "That did not go through. Please email " + EMAIL + " instead.";
        setStatus(msg, "error");
        button.disabled = false;
        button.innerHTML = buttonLabel;
      })
      .catch(function () {
        // Network failure, blocked request, offline. Always give a way through.
        setStatus("Could not reach the server. Please email " + EMAIL + " instead.", "error");
        button.disabled = false;
        button.innerHTML = buttonLabel;
      });
  });

  /* Sticky CTA: only on phones, and only once the hero's own button has
     scrolled away, so the two never compete. Suppressed while the form itself
     is on screen, since nagging about a form you are looking at is noise.

     Driven by IntersectionObserver rather than a scroll listener: anchor jumps
     and smooth-scroll animations do not reliably emit scroll events, so a
     scroll-only version can leave the bar in a stale state. */
  var sticky = document.getElementById("stickyCta");
  var hero = document.querySelector(".hero");
  if (!sticky || !hero) return;

  function onScreen(el) {
    var r = el.getBoundingClientRect();
    return r.top < window.innerHeight && r.bottom > 0;
  }

  /* State is computed from geometry, never accumulated from events, so a
     missed event cannot leave the bar stuck. */
  function update() {
    sticky.hidden = onScreen(hero) || onScreen(form);
  }

  var queued = false;
  function schedule() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(function () {
      queued = false;
      update();
    });
  }

  /* Several triggers on purpose. A scroll listener misses anchor jumps and
     mid-smooth-scroll frames; IntersectionObserver covers those but is not
     guaranteed to fire in every embedded viewer. Together one of them always
     does, and update() is idempotent so firing twice costs nothing. */
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule);
  window.addEventListener("hashchange", schedule);
  window.addEventListener("load", schedule);

  if (typeof IntersectionObserver === "function") {
    var observer = new IntersectionObserver(schedule, { threshold: 0 });
    observer.observe(hero);
    observer.observe(form);
  }

  update();
})();
