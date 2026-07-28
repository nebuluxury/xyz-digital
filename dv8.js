/* DV8 Web - interactions: scroll reveal, glass header, mobile nav */
(function () {
  'use strict';

  // ---- scroll reveal (stagger via data-reveal-delay) ----
  var reveals = document.querySelectorAll('[data-reveal]');
  reveals.forEach(function (el) {
    var d = el.getAttribute('data-reveal-delay');
    if (d) el.style.transitionDelay = d + 'ms';
  });
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('visible'); });
  }

  // ---- glass header on scroll ----
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('scrolled', window.scrollY > 10);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ---- mobile nav ----
  var burger = document.querySelector('.burger');
  var mobileNav = document.querySelector('.mobile-nav');
  if (burger && mobileNav) {
    burger.addEventListener('click', function () {
      mobileNav.classList.toggle('open');
    });
    mobileNav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { mobileNav.classList.remove('open'); });
    });
  }

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- animated count-up numbers ----
  var counters = document.querySelectorAll('[data-count]');
  var fmt = function (el, n) {
    return (el.getAttribute('data-prefix') || '') + n + (el.getAttribute('data-suffix') || '');
  };
  var runCount = function (el) {
    var target = parseFloat(el.getAttribute('data-count')) || 0;
    if (reduce) { el.textContent = fmt(el, target); return; }
    var dur = 1400, start = null;
    var ease = function (t) { return 1 - Math.pow(1 - t, 3); };
    var step = function (ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      el.textContent = fmt(el, Math.round(ease(p) * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if (counters.length && 'IntersectionObserver' in window) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { runCount(e.target); co.unobserve(e.target); }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { co.observe(el); });
  } else {
    counters.forEach(function (el) { el.textContent = fmt(el, el.getAttribute('data-count')); });
  }

  // ---- before/after drag-to-compare sliders ----
  document.querySelectorAll('.ba-compare').forEach(function (c) {
    var range = c.querySelector('.ba-range');
    if (!range) return;
    var apply = function (v) { c.style.setProperty('--pos', v + '%'); };
    range.addEventListener('input', function () { apply(range.value); });
    apply(range.value);
    if (reduce || !('IntersectionObserver' in window)) return;
    // one-time nudge on first view to hint it drags
    var so = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        so.unobserve(c);
        var from = 66, to = 50, t0 = null, d = 900;
        var ez = function (t) { return 1 - Math.pow(1 - t, 3); };
        range.value = from; apply(from);
        var run = function (ts) {
          if (!t0) t0 = ts;
          var p = Math.min((ts - t0) / d, 1);
          var val = from + (to - from) * ez(p);
          range.value = val; apply(val);
          if (p < 1) requestAnimationFrame(run);
        };
        requestAnimationFrame(run);
      });
    }, { threshold: 0.4 });
    so.observe(c);
  });
})();
