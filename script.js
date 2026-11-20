// Small enhancements. The page reads fine with this file removed.
(function () {
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // 1. Hero level meter: bars fade from blue (backend) to green (speech/AI).
  var bars = document.querySelector(".bars");
  if (bars) {
    var n = 36;
    var blue = [52, 81, 224], green = [17, 176, 136];
    var mix = function (a, b, t) {
      return "rgb(" + a.map(function (v, i) { return Math.round(v + (b[i] - v) * t); }).join(",") + ")";
    };
    for (var i = 0; i < n; i++) {
      var t = i / (n - 1);
      // A speech-like envelope: two bumps, with a little fixed variation per bar.
      var env = 0.25 + 0.55 * Math.abs(Math.sin(t * Math.PI * 2.2)) + 0.2 * Math.abs(Math.sin(i * 1.7));
      var bar = document.createElement("span");
      bar.className = "bar";
      bar.style.setProperty("--i", i);
      bar.style.setProperty("--h", Math.min(100, Math.round(env * 100)) + "%");
      bar.style.setProperty("--s", (0.45 + 0.4 * Math.abs(Math.cos(i * 0.9))).toFixed(2));
      bar.style.setProperty("--dur", (1.1 + (i % 5) * 0.18).toFixed(2) + "s");
      bar.style.setProperty("--c1", mix(blue, green, Math.max(0, t - 0.08)));
      bar.style.setProperty("--c2", mix(blue, green, Math.min(1, t + 0.08)));
      bars.appendChild(bar);
    }
  }

  // 2. Header gets a shadow once you scroll.
  var header = document.querySelector(".site-header");
  var onScroll = function () { header.classList.toggle("scrolled", window.scrollY > 8); };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (!("IntersectionObserver" in window)) {
    document.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("in"); });
    return;
  }

  // 3. Highlight the nav link for the section in view.
  var links = document.querySelectorAll('.nav-list a[href^="#"]');
  var byId = {};
  links.forEach(function (a) { byId[a.getAttribute("href").slice(1)] = a; });
  var navObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      links.forEach(function (a) { a.removeAttribute("aria-current"); });
      if (byId[entry.target.id]) byId[entry.target.id].setAttribute("aria-current", "true");
    });
  }, { rootMargin: "-40% 0px -55% 0px" });
  Object.keys(byId).forEach(function (id) {
    var s = document.getElementById(id);
    if (s) navObserver.observe(s);
  });

  // 4. Case studies fade in once, and their numbers count up once.
  var countUp = function (el) {
    var target = parseFloat(el.dataset.count), suffix = el.dataset.suffix || "";
    if (reduceMotion || isNaN(target)) return;
    var start = null, dur = 1100;
    var step = function (ts) {
      if (!start) start = ts;
      var p = Math.min(1, (ts - start) / dur);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  var revealObserver = new IntersectionObserver(function (entries, obs) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("in");
      entry.target.querySelectorAll("[data-count]").forEach(countUp);
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.15 });
  document.querySelectorAll(".reveal").forEach(function (el) { revealObserver.observe(el); });
})();
