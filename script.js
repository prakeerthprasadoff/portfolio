(function () {
  "use strict";

  var root = document.documentElement;
  var body = document.body;
  var nav = document.getElementById("nav");
  var menuToggle = document.getElementById("menuToggle");
  var scrollProgress = document.getElementById("scrollProgress");
  var backTop = document.getElementById("backTop");
  var yearEl = document.getElementById("year");
  var revealEls = document.querySelectorAll("[data-reveal]");
  var interactiveCards = document.querySelectorAll(".project, .skill-panel");

  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  var spotRaf = null;
  var pendingX = 50;
  var pendingY = 30;

  function applySpotlight() {
    spotRaf = null;
    root.style.setProperty("--spot-x", pendingX + "%");
    root.style.setProperty("--spot-y", pendingY + "%");
  }

  function onPointerMove(event) {
    pendingX = (event.clientX / window.innerWidth) * 100;
    pendingY = (event.clientY / window.innerHeight) * 100;

    if (spotRaf === null) {
      spotRaf = window.requestAnimationFrame(applySpotlight);
    }
  }

  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    window.addEventListener("pointermove", onPointerMove, { passive: true });
  }

  function setNavOpen(open) {
    body.classList.toggle("nav-open", open);

    if (menuToggle) {
      menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
      menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    }
  }

  if (menuToggle && nav) {
    menuToggle.addEventListener("click", function () {
      setNavOpen(!body.classList.contains("nav-open"));
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        setNavOpen(false);
      });
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        setNavOpen(false);
      }
    });
  }

  function onScroll() {
    var doc = document.documentElement;
    var scrollTop = doc.scrollTop || body.scrollTop;
    var max = doc.scrollHeight - doc.clientHeight;
    var pct = max > 0 ? (scrollTop / max) * 100 : 0;

    if (scrollProgress) {
      scrollProgress.style.width = pct + "%";
    }

    if (backTop) {
      backTop.style.opacity = scrollTop > 500 ? "1" : "0.55";
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  function setupCardTilt(card) {
    function resetTilt() {
      card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg)";
    }

    card.addEventListener("pointermove", function (event) {
      var rect = card.getBoundingClientRect();
      var x = event.clientX - rect.left;
      var y = event.clientY - rect.top;
      var rotateY = ((x / rect.width) - 0.5) * 5;
      var rotateX = (0.5 - (y / rect.height)) * 5;

      card.style.transform =
        "perspective(1000px) rotateX(" +
        rotateX.toFixed(2) +
        "deg) rotateY(" +
        rotateY.toFixed(2) +
        "deg)";
    });

    card.addEventListener("pointerleave", resetTilt);
    card.addEventListener("blur", resetTilt, true);
  }

  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    interactiveCards.forEach(function (card) {
      setupCardTilt(card);
    });
  }

  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add("is-visible");

          io.unobserve(entry.target);
        });
      },
      {
        root: null,
        threshold: 0.12,
        rootMargin: "0px 0px -8% 0px"
      }
    );

    revealEls.forEach(function (el) {
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }
})();
