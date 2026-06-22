/* Pet Health Alternatives — shared interactions */
(function () {
  "use strict";

  /* -------- Mobile hamburger nav -------- */
  function initNav() {
    var toggle = document.querySelector("[data-nav-toggle]");
    var menu = document.querySelector("[data-nav-menu]");
    if (!toggle || !menu) return;

    function setOpen(open) {
      menu.dataset.open = open ? "true" : "false";
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.style.overflow = open ? "hidden" : "";
    }
    toggle.addEventListener("click", function () {
      setOpen(menu.dataset.open !== "true");
    });
    // Close when a link is tapped
    menu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { setOpen(false); });
    });
    // Close on resize to desktop
    window.addEventListener("resize", function () {
      if (window.innerWidth >= 768) setOpen(false);
    });
    // Close on Escape
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setOpen(false);
    });
  }

  /* -------- Sticky header shadow on scroll -------- */
  function initHeaderScroll() {
    var header = document.querySelector("[data-header]");
    if (!header) return;
    var onScroll = function () {
      if (window.scrollY > 12) header.setAttribute("data-scrolled", "true");
      else header.removeAttribute("data-scrolled");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* -------- Entrance animation flag --------
     The subtle slide-up is pure CSS (html.js + @keyframes pha-rise), and never
     hides content via opacity, so it is safe even without paint. We only confirm
     JS is alive so the <head> failsafe leaves the html.js class in place. */
  function initReveal() {
    window.__revealInit = true;
  }

  /* -------- Form submission (preserves legacy endpoint) -------- */
  function initForms() {
    var url = "https://tmqph.online/handler/webapps/email";
    var pathname = window.location.href;
    var forms = document.querySelectorAll("form[data-handled]");
    forms.forEach(function (form) {
      var done = form.querySelector("[data-form-done]");
      var fail = form.querySelector("[data-form-fail]");
      var btn = form.querySelector("button[type='submit'], input[type='submit']");
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        if (done) done.hidden = true;
        if (fail) fail.hidden = true;
        if (btn) { btn.disabled = true; btn.dataset.label = btn.textContent; btn.textContent = "Please wait..."; }
        var data = new FormData(form);
        data.append("url", pathname);
        fetch(url, { method: "POST", body: data })
          .then(function (res) {
            if (res.status === 200) {
              if (done) done.hidden = false;
              form.reset();
            } else if (fail) { fail.hidden = false; }
          })
          .catch(function () { if (fail) fail.hidden = false; })
          .finally(function () {
            if (btn) { btn.disabled = false; btn.textContent = btn.dataset.label || "Submit"; }
          });
      });
    });
  }

  /* -------- Footer year -------- */
  function initYear() {
    var el = document.querySelector("[data-year]");
    if (el) el.textContent = new Date().getFullYear();
  }

  document.addEventListener("DOMContentLoaded", function () {
    initNav();
    initHeaderScroll();
    initReveal();
    initForms();
    initYear();
  });
})();
