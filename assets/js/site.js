/**
 * Site behaviour: content rendering, hero video crossfade loop, mobile
 * navigation, enquiry field, contact form.
 *
 * Course and service copy is taken verbatim from tahiracademytrust.org and
 * lives in the arrays below, so adding a fourth course is a data edit rather
 * than a markup clone.
 */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ==========================================================================
     CONTENT
     ======================================================================== */

  var COURSES = [
    {
      title: 'Sanatayn Course',
      chips: ['2 years', 'Age 11+', 'Sat & Sun'],
      body: 'The essential foundations of the Islamic sciences, for both girls and boys from the age of 11.',
      image: 'course-sanatayn',
      alt: "Two students studying the Qur'an together",
      width: 560,
      height: 373,
    },
    {
      title: 'Aalimiyyah Course',
      chips: ['6 years', 'Boys & girls', 'Sat & Sun'],
      body: 'Our full scholarly programme, running at Waverley Primary School, for those going deeper into the classical texts.',
      image: 'course-aalimiyyah',
      alt: 'Arabic calligraphy on an ancient manuscript page',
      width: 560,
      height: 700,
    },
    {
      title: "Hifz ul Qur'an",
      chips: ['Flexible', 'With tajweed', 'Sat & Sun'],
      body: "A dedicated programme to memorise the Holy Qur'an with tajweed, focused on accuracy and long-term retention.",
      image: 'course-hifz',
      alt: "An open Qur'an with prayer beads",
      width: 560,
      height: 840,
    },
  ];

  var SERVICES = [
    {
      title: 'Eid Salaah',
      when: 'Jamaat starts 9:00am sharp',
      body: 'Our Eid ul Fitr Salaah at the Huntingdon Suite, Broxbourne Council, Cheshunt, Herts EN8 9XQ. Donations are collected for our fundraiser.',
    },
    {
      title: 'Jumuah prayers at Cheshunt',
      when: 'Every Friday',
      body: 'We have been providing Jumuah Salaah to the local people of Cheshunt, with special guests leading the prayers. Parking facilities are available.',
    },
    {
      title: 'Taraweeh Salaah',
      when: 'Isha followed by Taraweeh, 8:00pm sharp',
      body: 'Nightly prayers held throughout the blessed month of Ramadan.',
    },
  ];

  /* ==========================================================================
     RENDERING
     ======================================================================== */

  function esc(value) {
    return String(value).replace(/[&<>"']/g, function (ch) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
    });
  }

  function courseCard(course) {
    var base = '/assets/img/' + course.image;
    var chips = course.chips
      .map(function (c, i) {
        // First chip is the duration, which is the fact people scan for.
        return '<span class="chip' + (i === 0 ? ' chip-gold' : '') + '">' + esc(c) + '</span>';
      })
      .join('');

    return (
      '<a class="liquid-glass card rounded-xl" href="#enrol" data-motion="fade" ' +
      'aria-label="' + esc(course.title) + ', enquire about this course">' +
        '<div class="card-media-wrap aspect-[4/3]">' +
          '<img src="' + base + '-560.jpg" ' +
               'srcset="' + base + '-560.webp 560w, ' + base + '-1120.webp 1120w" ' +
               'sizes="(min-width: 768px) 30vw, 100vw" ' +
               'width="' + course.width + '" height="' + course.height + '" ' +
               'loading="lazy" decoding="async" alt="' + esc(course.alt) + '" class="card-media">' +
          '<div class="media-scrim" aria-hidden="true"></div>' +
        '</div>' +
        '<div class="card-body">' +
          '<div class="flex items-start justify-between gap-sm">' +
            '<h3 class="font-display text-title text-strong">' + esc(course.title) + '</h3>' +
            '<span class="card-arrow" aria-hidden="true">' +
              '<svg class="h-4 w-4"><use href="#i-arrow-up-right"/></svg>' +
            '</span>' +
          '</div>' +
          '<div class="flex flex-wrap gap-3xs">' + chips + '</div>' +
          '<p class="text-body-sm text-body">' + esc(course.body) + '</p>' +
          '<span class="card-action">Enquire about this course <span aria-hidden="true">&rarr;</span></span>' +
        '</div>' +
      '</a>'
    );
  }

  function serviceRow(service) {
    return (
      '<li class="row" data-motion="fade">' +
        '<h3 class="font-display text-title text-strong">' + esc(service.title) + '</h3>' +
        '<p class="label">' + esc(service.when) + '</p>' +
        '<p class="text-body-sm text-body">' + esc(service.body) + '</p>' +
      '</li>'
    );
  }

  function render() {
    var grid = document.getElementById('courses-grid');
    if (grid) grid.innerHTML = COURSES.map(courseCard).join('');

    var list = document.getElementById('services-list');
    if (list) list.innerHTML = SERVICES.map(serviceRow).join('');

    var year = document.getElementById('year');
    if (year) year.textContent = String(new Date().getFullYear());
  }

  /* ==========================================================================
     HERO VIDEO — crossfade loop
     The clip does not loop cleanly, so instead of `loop` we fade to black over
     the last 0.55s, restart, and fade back in. The result reads as one
     continuous ambient shot rather than a visible cut.
     ======================================================================== */

  var FADE_MS = 500;
  var TAIL_S = 0.55;

  function fadeTo(el, target, ms, done) {
    var from = parseFloat(el.style.opacity || '0');
    var start = null;
    var settled = false;

    if (el._fadeFrame) cancelAnimationFrame(el._fadeFrame);
    if (el._fadeGuard) clearTimeout(el._fadeGuard);

    function settle() {
      if (settled) return;
      settled = true;
      el._fadeFrame = null;
      el._fadeGuard = null;
      el.style.opacity = String(target);
      if (done) done();
    }

    function step(now) {
      if (settled) return;
      if (start === null) start = now;
      var t = Math.min((now - start) / ms, 1);
      el.style.opacity = String(from + (target - from) * t);
      if (t < 1) el._fadeFrame = requestAnimationFrame(step);
      else settle();
    }

    // requestAnimationFrame does not run in a tab that is not compositing —
    // a background tab at load, low-power mode, some embedded webviews. Without
    // this guarantee the video would stay stuck at opacity 0 over black and the
    // poster could never show through. The timer settles the end state
    // regardless; when rAF is running normally it finishes first and this is a
    // no-op.
    el._fadeGuard = window.setTimeout(settle, ms + 120);
    el._fadeFrame = requestAnimationFrame(step);
  }

  function initHeroVideo() {
    var video = document.getElementById('hero-video');
    if (!video) return;

    var fallback = document.getElementById('hero-fallback');
    function showFallback() { if (fallback) fallback.style.opacity = '1'; }

    // Reduced motion: show the still, never play.
    if (reduce.matches) {
      video.removeAttribute('autoplay');
      video.removeAttribute('src');
      showFallback();
      try { video.pause(); } catch (e) { /* not started yet */ }
      return;
    }

    // If playback has not actually begun shortly after load — autoplay refused
    // by a data saver or power saver, a stalled network, a tab opened in the
    // background — fall back to the still rather than leaving a black screen.
    window.setTimeout(function () {
      if (video.paused || video.currentTime === 0) showFallback();
    }, 1500);

    var fadingOut = false;
    var started = false;

    function begin() {
      if (started) return;
      started = true;
      var attempt = video.play();
      if (attempt && attempt.catch) attempt.catch(showFallback);
      fadeTo(video, 1, FADE_MS);
    }

    // preload="auto" on a deferred script means canplay may already have fired
    // by the time we get here. Without this check the listener never runs and
    // the hero sits at opacity 0 forever.
    if (video.readyState >= 3) begin();
    else video.addEventListener('canplay', begin, { once: true });

    // If the clip fails to load at all, show the still rather than black.
    video.addEventListener('error', showFallback);
    video.addEventListener('stalled', showFallback);

    video.addEventListener('timeupdate', function () {
      if (!video.duration || fadingOut) return;
      if (video.duration - video.currentTime <= TAIL_S) {
        fadingOut = true;
        fadeTo(video, 0, FADE_MS);
      }
    });

    video.addEventListener('ended', function () {
      video.style.opacity = '0';
      window.setTimeout(function () {
        video.currentTime = 0;
        var attempt = video.play();
        if (attempt && attempt.catch) attempt.catch(function () {});
        fadingOut = false;
        fadeTo(video, 1, FADE_MS);
      }, 100);
    });

    // Don't decode video for a tab nobody is looking at.
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) video.pause();
      else if (!reduce.matches) { var a = video.play(); if (a && a.catch) a.catch(function () {}); }
    });
  }

  /** Section videos: pause the ones that aren't on screen, and all of them
   *  under reduced motion. */
  function initAmbientVideos() {
    var videos = Array.prototype.slice.call(document.querySelectorAll('video')).filter(function (v) {
      return v.id !== 'hero-video';
    });
    if (!videos.length) return;

    if (reduce.matches) {
      videos.forEach(function (v) {
        v.removeAttribute('autoplay');
        v.removeAttribute('loop');
        try { v.pause(); } catch (e) { /* not started */ }
      });
      return;
    }

    if (typeof IntersectionObserver === 'undefined') return;

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var v = entry.target;
        if (entry.isIntersecting) { var a = v.play(); if (a && a.catch) a.catch(function () {}); }
        else v.pause();
      });
    }, { threshold: 0.15 });

    videos.forEach(function (v) { io.observe(v); });
  }

  /* ==========================================================================
     MOBILE NAVIGATION
     ======================================================================== */

  var FOCUSABLE = 'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

  function initNav() {
    var toggle = document.getElementById('nav-toggle');
    var close = document.getElementById('nav-close');
    var drawer = document.getElementById('nav-drawer');
    var scrim = document.getElementById('nav-scrim');
    if (!toggle || !drawer || !scrim) return;

    var isOpen = false;

    function focusables() {
      return Array.prototype.slice.call(drawer.querySelectorAll(FOCUSABLE));
    }

    function onKeydown(event) {
      if (event.key === 'Escape') { closeDrawer(); return; }
      if (event.key !== 'Tab') return;
      var items = focusables();
      if (!items.length) return;
      var first = items[0];
      var last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }

    function openDrawer() {
      if (isOpen) return;
      isOpen = true;
      drawer.hidden = false;
      scrim.hidden = false;
      requestAnimationFrame(function () {
        drawer.setAttribute('data-open', 'true');
        scrim.setAttribute('data-open', 'true');
      });
      toggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', onKeydown);
      var items = focusables();
      if (items.length) items[0].focus();
    }

    function closeDrawer() {
      if (!isOpen) return;
      isOpen = false;
      drawer.removeAttribute('data-open');
      scrim.removeAttribute('data-open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKeydown);
      toggle.focus();

      var ms = reduce.matches ? 0 : 300;
      window.setTimeout(function () {
        if (isOpen) return;
        drawer.hidden = true;
        scrim.hidden = true;
      }, ms);
    }

    toggle.addEventListener('click', openDrawer);
    if (close) close.addEventListener('click', closeDrawer);
    scrim.addEventListener('click', closeDrawer);
    drawer.addEventListener('click', function (event) {
      if (event.target.closest('a')) closeDrawer();
    });

    window.matchMedia('(min-width: 1024px)').addEventListener('change', function (e) {
      if (e.matches) closeDrawer();
    });
  }

  /* ==========================================================================
     ENQUIRY FIELD
     There is no backend, so this hands off to the trust's real inbox rather
     than pretending to submit. A field that silently does nothing is worse
     than no field.
     ======================================================================== */

  function initEnquiry() {
    var form = document.getElementById('enquiry-form');
    if (!form) return;
    var input = document.getElementById('enquiry-email');
    var status = document.getElementById('enquiry-status');

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var value = (input.value || '').trim();

      if (!value || !input.checkValidity()) {
        status.textContent = 'Please enter a valid email address.';
        input.focus();
        return;
      }

      status.textContent = 'Opening your email app…';
      window.location.href =
        'mailto:info@tahiracademytrust.org' +
        '?subject=' + encodeURIComponent('Enquiry from the Tahir Academy Trust website') +
        '&body=' + encodeURIComponent('Please contact me at: ' + value + '\n\nMy enquiry:\n');
    });
  }

  /* ==========================================================================
     CONTACT FORM
     Same reasoning as the enquiry field above: there is no backend behind this
     site, so submission hands the visitor's own email client a pre-filled
     message addressed to the trust's inbox, with everything they typed laid
     out for a reply. A form that silently discards input is worse than no
     form. If a real submission endpoint (Formspree, Netlify Forms, a small
     serverless function, etc.) is added later, only this handler's submit
     branch needs to change — the markup, validation and honeypot stay as-is.
     ======================================================================== */

  function initContactForm() {
    var form = document.getElementById('contact-form');
    if (!form) return;

    var status = document.getElementById('contact-status');
    var honeypot = document.getElementById('contact-company');

    var fields = ['name', 'email', 'reason', 'message'].map(function (name) {
      return document.getElementById('contact-' + name);
    });

    function clearInvalid(field) {
      field.removeAttribute('aria-invalid');
    }

    // Once a field has been flagged invalid, clear it as soon as the visitor
    // fixes it rather than waiting for the next submit attempt.
    fields.forEach(function (field) {
      var evt = field.tagName === 'SELECT' ? 'change' : 'input';
      field.addEventListener(evt, function () {
        if (field.checkValidity()) clearInvalid(field);
      });
    });

    function validate() {
      var firstInvalid = null;
      fields.forEach(function (field) {
        var ok = field.checkValidity() && field.value.trim() !== '';
        if (ok) {
          clearInvalid(field);
        } else {
          field.setAttribute('aria-invalid', 'true');
          if (!firstInvalid) firstInvalid = field;
        }
      });
      return firstInvalid;
    }

    function composeBody(data) {
      var lines = [
        'Name: ' + data.name,
        'Email: ' + data.email,
      ];
      if (data.phone) lines.push('Phone: ' + data.phone);
      lines.push('Reason: ' + data.reason);
      lines.push('', 'Message:', data.message);
      return lines.join('\n');
    }

    form.addEventListener('submit', function (event) {
      event.preventDefault();

      // A filled honeypot means a bot, not a visitor. Pretend it worked and
      // stop — never reveal to the sender that anything was rejected.
      if (honeypot && honeypot.value.trim() !== '') {
        form.reset();
        status.setAttribute('data-tone', 'success');
        status.textContent = 'Thank you — your message has been sent.';
        return;
      }

      var firstInvalid = validate();
      if (firstInvalid) {
        status.setAttribute('data-tone', 'error');
        status.textContent = 'Please check the highlighted fields and try again.';
        firstInvalid.focus();
        return;
      }

      var data = {
        name: form.name.value.trim(),
        email: form.email.value.trim(),
        phone: form.phone.value.trim(),
        reason: form.reason.value,
        message: form.message.value.trim(),
      };

      status.removeAttribute('data-tone');
      status.textContent = 'Opening your email app…';

      window.location.href =
        'mailto:info@tahiracademytrust.org' +
        '?subject=' + encodeURIComponent('Contact form: ' + data.reason) +
        '&body=' + encodeURIComponent(composeBody(data));
    });
  }

  /* ==========================================================================
     INIT
     ======================================================================== */

  /* ==========================================================================
     STICKY MOBILE CTA
     Held back until the hero has scrolled away, so it never covers the hero's
     own buttons, and hidden again over the enrolment section where the real
     form already is.
     ======================================================================== */

  function initMobileCta() {
    var bar = document.getElementById('mobile-cta');
    var enrol = document.getElementById('enrol');
    if (!bar) return;

    var pastHero = false;
    var overEnrol = false;

    function sync() {
      bar.setAttribute('data-show', String(pastHero && !overEnrol));
    }

    if (typeof IntersectionObserver === 'undefined') { bar.setAttribute('data-show', 'true'); return; }

    var hero = document.getElementById('main');
    if (hero) {
      new IntersectionObserver(function (entries) {
        pastHero = !entries[0].isIntersecting;
        sync();
      }, { threshold: 0 }).observe(hero);
    } else {
      pastHero = true;
    }

    if (enrol) {
      new IntersectionObserver(function (entries) {
        overEnrol = entries[0].isIntersecting;
        sync();
      }, { threshold: 0.25 }).observe(enrol);
    }

    sync();
  }

  function init() {
    render();
    initHeroVideo();
    initAmbientVideos();
    initNav();
    initEnquiry();
    initContactForm();
    initMobileCta();
    // Entrance animations attach after injected content exists in the DOM.
    if (window.Motion && typeof window.Motion.refresh === 'function') window.Motion.refresh();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
