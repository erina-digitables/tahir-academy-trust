/**
 * Site behaviour: content rendering, mobile navigation, footer year.
 *
 * The imported page repeated the same card markup three times for courses and
 * the same row markup three times for services. Both are now single templates
 * driven by the arrays below, so adding a fourth course is a data edit.
 *
 * Copy is taken verbatim from tahiracademytrust.org.
 */
(function () {
  'use strict';

  /* ==========================================================================
     CONTENT
     ======================================================================== */

  var COURSES = [
    {
      id: 'sanatayn',
      title: 'Sanatayn Course',
      duration: '2 year course',
      schedule: 'Saturday & Sunday · 9:30am – 12:30pm',
      body: 'A two year course for both girls and boys from the age of 11, covering the essential foundations of the Islamic sciences.',
      image: 'course-sanatayn',
      alt: 'Open Islamic texts and calligraphy used in the Sanatayn course',
      width: 560,
      height: 315,
    },
    {
      id: 'aalimiyyah',
      title: 'Aalimiyyah Course',
      duration: '6 year course',
      schedule: 'Saturday & Sunday · 9:30am – 12:30pm',
      body: 'Our six year scholarly programme for both boys and girls, running at Waverley Primary School, designed to produce knowledgeable community leaders.',
      image: 'course-aalimiyyah',
      alt: 'Students working through advanced texts in the Aalimiyyah course',
      width: 560,
      height: 792,
    },
    {
      id: 'hifz',
      title: "Hifz ul Qur'an",
      duration: 'Flexible',
      schedule: 'Saturday & Sunday · 9:30am – 12:30pm',
      body: "A dedicated programme to memorise the Holy Qur'an with tajweed, focusing on accuracy and long-term retention.",
      image: 'course-hifz',
      alt: "Students in a Qur'an recitation circle",
      width: 560,
      height: 373,
    },
  ];

  var SERVICES = [
    {
      title: 'Eid Salaah',
      when: 'Jamaat starts 9:00am sharp',
      body: 'Our Eid ul Fitr Salaah, held at the Huntingdon Suite, Broxbourne Council, Cheshunt, Herts EN8 9XQ. Donations are collected for our fundraiser.',
    },
    {
      title: 'Jumuah prayers at Cheshunt',
      when: 'Every Friday',
      body: 'We have been providing Jumuah Salaah to the people of Cheshunt, with special guests leading the prayers. Huntingdon Suite, Broxbourne Council, Cheshunt EN8 9XQ. Parking is available.',
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

  /** Escapes text before it reaches innerHTML. */
  function esc(value) {
    return String(value).replace(/[&<>"']/g, function (ch) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
    });
  }

  function courseCard(course) {
    var base = '/assets/img/' + course.image;
    return (
      '<a class="card" href="#location" data-motion="fade" ' +
      'aria-label="' + esc(course.title) + ' — enquire about this course">' +
        '<picture>' +
          '<source type="image/webp" srcset="' + base + '-560.webp 560w, ' + base + '-1120.webp 1120w" ' +
                  'sizes="(min-width: 768px) 30vw, 100vw">' +
          '<img src="' + base + '-560.jpg" width="' + course.width + '" height="' + course.height + '" ' +
               'loading="lazy" decoding="async" alt="' + esc(course.alt) + '" class="card-media">' +
        '</picture>' +
        '<div class="card-body">' +
          '<p class="text-label-caps text-primary">' + esc(course.duration) + '</p>' +
          '<h3 class="text-headline-md text-on-surface">' + esc(course.title) + '</h3>' +
          '<p class="text-label-caps text-on-surface-variant">' + esc(course.schedule) + '</p>' +
          '<p class="text-body-md text-on-surface-variant">' + esc(course.body) + '</p>' +
          '<span class="card-cta">Enquire <span aria-hidden="true">→</span></span>' +
        '</div>' +
      '</a>'
    );
  }

  function serviceRow(service) {
    return (
      '<li class="service-row" data-motion="fade">' +
        '<h3 class="text-headline-sm text-primary">' + esc(service.title) + '</h3>' +
        '<p class="text-label-caps text-on-surface-variant">' + esc(service.when) + '</p>' +
        '<p class="text-body-md text-on-surface-variant">' + esc(service.body) + '</p>' +
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
     MOBILE NAVIGATION
     Focus is trapped while the drawer is open and returned to the trigger on
     close. The import had no mobile navigation at all.
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

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    function openDrawer() {
      if (isOpen) return;
      isOpen = true;
      drawer.hidden = false;
      scrim.hidden = false;
      // Next frame, so the transition has a start value to animate from.
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

      var ms = matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 300;
      window.setTimeout(function () {
        if (isOpen) return; // reopened during the exit
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

    // Leaving the mobile breakpoint with the drawer open would strand it.
    matchMedia('(min-width: 1024px)').addEventListener('change', function (e) {
      if (e.matches) closeDrawer();
    });
  }

  function init() {
    render();
    initNav();
    // Entrance animations attach after the cards and rows exist in the DOM.
    if (window.Motion && typeof window.Motion.refresh === 'function') window.Motion.refresh();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
