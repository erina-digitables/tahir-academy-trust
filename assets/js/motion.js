/**
 * Motion engine — the vanilla-JS equivalent of framer-motion's useInView,
 * stagger children, animated counters and scroll-linked transforms.
 *
 * Design rules:
 *   - Nothing is hidden until this file is actually running. It sets
 *     data-motion-ready on <html>; the CSS initial states are scoped behind
 *     that attribute. A parse error therefore leaves a readable page rather
 *     than a blank one.
 *   - Every observer unobserves once its element has resolved.
 *   - prefers-reduced-motion is read live, so toggling the OS setting mid-
 *     session takes effect without a reload.
 *
 * Public API (used by site.js after it injects content):
 *   window.Motion.refresh()
 */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var supportsIO = typeof IntersectionObserver !== 'undefined';

  var STAGGER_MS = 150;   // between children of a stagger container
  var WORD_MS = 100;      // between words of a headline
  var THRESHOLD = 0.1;    // 10% visible, per spec
  var ROOT_MARGIN = '0px 0px -100px 0px';

  document.documentElement.setAttribute('data-motion-ready', '');

  /* ==========================================================================
     ENTRANCES
     ======================================================================== */

  var revealed = new WeakSet();

  function reveal(el, delayMs) {
    if (revealed.has(el)) return;
    revealed.add(el);
    var delay = delayMs || Number(el.getAttribute('data-motion-delay')) || 0;
    el.style.transitionDelay = delay + 'ms';
    el.classList.add('is-in');
    var total = delay + 1000;
    window.setTimeout(function () {
      el.classList.add('is-done');
      el.style.transitionDelay = '';
    }, total);
  }

  var entranceObserver = supportsIO
    ? new IntersectionObserver(function (entries, observer) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          observer.unobserve(entry.target);   // closes the never-unobserved leak
          reveal(entry.target);
        });
      }, { threshold: THRESHOLD, rootMargin: ROOT_MARGIN })
    : null;

  /* ==========================================================================
     STAGGERED GROUPS
     Children animate in sequence rather than together — the stagger is what
     makes a grid read as intentional instead of as one block appearing.
     ======================================================================== */

  var staggerObserver = supportsIO
    ? new IntersectionObserver(function (entries, observer) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          observer.unobserve(entry.target);
          var kids = entry.target.querySelectorAll('[data-motion]');
          Array.prototype.forEach.call(kids, function (kid, i) {
            if (entranceObserver) entranceObserver.unobserve(kid);
            reveal(kid, i * STAGGER_MS);
          });
        });
      }, { threshold: THRESHOLD, rootMargin: ROOT_MARGIN })
    : null;

  /* ==========================================================================
     WORD-BY-WORD HEADLINES
     Splits on spaces into inline-block spans. Any <em> in the source keeps its
     styling because we walk child nodes rather than flattening textContent.
     ======================================================================== */

  function splitWords(host) {
    if (host.getAttribute('data-words-split') === 'true') return;

    var pieces = [];
    Array.prototype.forEach.call(host.childNodes, function (node) {
      if (node.nodeType === Node.TEXT_NODE) {
        node.textContent.split(/\s+/).forEach(function (w) {
          if (w) pieces.push({ text: w, em: false });
        });
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        var isEm = node.tagName === 'EM' || node.classList.contains('em-soft');
        (node.textContent || '').split(/\s+/).forEach(function (w) {
          if (w) pieces.push({ text: w, em: isEm, cls: node.className });
        });
      }
    });

    if (!pieces.length) return;

    host.textContent = '';
    host.classList.add('words');

    pieces.forEach(function (piece, i) {
      var span = document.createElement('span');
      span.className = 'word';
      span.style.setProperty('--word-delay', i * WORD_MS + 'ms');

      if (piece.em) {
        var em = document.createElement('em');
        em.className = piece.cls || 'em-soft';
        em.textContent = piece.text;
        span.appendChild(em);
      } else {
        span.textContent = piece.text;
      }
      host.appendChild(span);
      // Without a real space between spans, screen readers announce the
      // heading as one run-together word.
      if (i < pieces.length - 1) host.appendChild(document.createTextNode(' '));
    });

    host.setAttribute('data-words-split', 'true');
  }

  var wordsObserver = supportsIO
    ? new IntersectionObserver(function (entries, observer) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          observer.unobserve(entry.target);
          var words = entry.target.querySelectorAll('.word');
          Array.prototype.forEach.call(words, function (w) { w.classList.add('is-in'); });
        });
      }, { threshold: THRESHOLD })
    : null;

  /* ==========================================================================
     COUNTERS
     0 -> target over 1.4s on an easeOut curve. Snaps instantly under reduced
     motion; the number still arrives, it just doesn't travel.
     ======================================================================== */

  var COUNT_MS = 1400;

  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

  function runCounter(el) {
    var target = Number(el.getAttribute('data-count-to'));
    if (!isFinite(target)) return;

    if (reduce.matches) { el.textContent = String(target); return; }

    var start = null;
    var settled = false;

    function settle() {
      if (settled) return;
      settled = true;
      el.textContent = String(target);
    }

    function step(now) {
      if (settled) return;
      if (start === null) start = now;
      var t = Math.min((now - start) / COUNT_MS, 1);
      el.textContent = String(Math.round(easeOutCubic(t) * target));
      if (t < 1) requestAnimationFrame(step);
      else settle();
    }

    // Same guarantee as the video fade: if rAF is throttled the figure must
    // still arrive at its real value rather than sitting at 0.
    window.setTimeout(settle, COUNT_MS + 120);
    requestAnimationFrame(step);
  }

  var counterObserver = supportsIO
    ? new IntersectionObserver(function (entries, observer) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          observer.unobserve(entry.target);
          runCounter(entry.target);
        });
      }, { threshold: 0.5 })
    : null;

  /* ==========================================================================
     SCROLL-LINKED PARALLAX
     One rAF-throttled pass over registered elements. Disabled entirely under
     reduced motion.
     ======================================================================== */

  var parallaxEls = [];
  var ticking = false;

  function applyParallax() {
    ticking = false;
    if (reduce.matches) return;
    var vh = window.innerHeight;

    parallaxEls.forEach(function (item) {
      var rect = item.el.getBoundingClientRect();
      if (rect.bottom < -200 || rect.top > vh + 200) return;
      // -1 above the fold, 0 centred, +1 below
      var progress = (rect.top + rect.height / 2 - vh / 2) / vh;
      var shift = progress * item.speed * 100;
      item.el.style.transform = 'translate3d(0,' + shift.toFixed(2) + 'px,0)';
    });
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(applyParallax);
  }

  /* ==========================================================================
     WIRING
     ======================================================================== */

  function collect() {
    if (!supportsIO) {
      // No IntersectionObserver: show everything immediately.
      document.querySelectorAll('[data-motion]').forEach(function (el) { el.classList.add('is-in'); });
      document.querySelectorAll('[data-count-to]').forEach(function (el) {
        el.textContent = el.getAttribute('data-count-to');
      });
      return;
    }

    // Children of a stagger container are driven by the container, not
    // individually, so they are skipped here.
    document.querySelectorAll('[data-motion]').forEach(function (el) {
      if (revealed.has(el)) return;
      if (el.closest('[data-motion-stagger]')) return;
      entranceObserver.observe(el);
    });

    document.querySelectorAll('[data-motion-stagger]').forEach(function (el) {
      staggerObserver.observe(el);
    });

    document.querySelectorAll('[data-motion="words"]').forEach(function (el) {
      splitWords(el);
      wordsObserver.observe(el);
    });

    document.querySelectorAll('[data-count-to]').forEach(function (el) {
      counterObserver.observe(el);
    });

    parallaxEls = [];
    document.querySelectorAll('[data-parallax]').forEach(function (el) {
      var speed = parseFloat(el.getAttribute('data-parallax'));
      el.classList.add('parallax');
      parallaxEls.push({ el: el, speed: isFinite(speed) ? speed : 0.4 });
    });

    if (parallaxEls.length) {
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll, { passive: true });
      applyParallax();
    }
  }

  function onMotionPreferenceChange() {
    if (!reduce.matches) { onScroll(); return; }
    parallaxEls.forEach(function (item) { item.el.style.transform = ''; });
  }

  if (reduce.addEventListener) reduce.addEventListener('change', onMotionPreferenceChange);
  else if (reduce.addListener) reduce.addListener(onMotionPreferenceChange);

  window.Motion = { refresh: collect };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', collect);
  else collect();
})();
