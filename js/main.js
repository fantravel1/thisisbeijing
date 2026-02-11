/* ============================================================
   ThisIsBeijing.com — Main JavaScript
   Mobile menu, scroll animations, FAQ accordion, nav behavior
   ============================================================ */

(function () {
  'use strict';

  // --- DOM Elements ---
  const nav = document.getElementById('siteNav');
  const navToggle = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = mobileMenu
    ? mobileMenu.querySelectorAll('.mobile-link')
    : [];
  const faqItems = document.querySelectorAll('.faq-item');
  const fadeElements = document.querySelectorAll(
    '.fade-in, .fade-in-left, .fade-in-right'
  );

  // --- Mobile Menu ---
  function toggleMobileMenu() {
    if (!navToggle || !mobileMenu) return;

    const isOpen = mobileMenu.classList.contains('active');

    if (isOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  }

  function openMobileMenu() {
    if (!navToggle || !mobileMenu) return;
    mobileMenu.classList.add('active');
    navToggle.classList.add('active');
    navToggle.setAttribute('aria-expanded', 'true');
    navToggle.setAttribute('aria-label', 'Close menu');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    if (!navToggle || !mobileMenu) return;
    mobileMenu.classList.remove('active');
    navToggle.classList.remove('active');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open menu');
    document.body.style.overflow = '';
  }

  if (navToggle) {
    navToggle.addEventListener('click', toggleMobileMenu);
  }

  // Close mobile menu on link click
  mobileLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      closeMobileMenu();
    });
  });

  // Close mobile menu on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && mobileMenu && mobileMenu.classList.contains('active')) {
      closeMobileMenu();
    }
  });

  // --- Navbar Background on Scroll ---
  function updateNavbar() {
    if (!nav) return;

    var scrollY = window.scrollY || window.pageYOffset;

    if (scrollY > 80) {
      nav.classList.remove('site-nav--transparent');
      nav.classList.add('site-nav--solid');
    } else {
      // Only go transparent on the homepage (has hero)
      var hero = document.getElementById('hero');
      if (hero) {
        nav.classList.add('site-nav--transparent');
        nav.classList.remove('site-nav--solid');
      }
    }
  }

  // Throttle scroll events
  var scrollTicking = false;
  window.addEventListener('scroll', function () {
    if (!scrollTicking) {
      window.requestAnimationFrame(function () {
        updateNavbar();
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  });

  // Initial navbar state
  updateNavbar();

  // --- Smooth Scroll for Anchor Links ---
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;

      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        var navHeight = nav ? nav.offsetHeight : 0;
        var targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // --- Scroll Animations (Intersection Observer) ---
  if ('IntersectionObserver' in window) {
    var observerOptions = {
      root: null,
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.1
    };

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    fadeElements.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Fallback: show all elements immediately
    fadeElements.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  // --- FAQ Accordion ---
  faqItems.forEach(function (item) {
    var question = item.querySelector('.faq-question');
    var answer = item.querySelector('.faq-answer');

    if (!question || !answer) return;

    question.addEventListener('click', function () {
      var isOpen = item.classList.contains('active');

      // Close all other items
      faqItems.forEach(function (otherItem) {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          var otherAnswer = otherItem.querySelector('.faq-answer');
          var otherQuestion = otherItem.querySelector('.faq-question');
          if (otherAnswer) otherAnswer.style.maxHeight = null;
          if (otherQuestion) otherQuestion.setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle current item
      if (isOpen) {
        item.classList.remove('active');
        answer.style.maxHeight = null;
        question.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // --- Resize handler for FAQ (recalculate open answer heights) ---
  var resizeTicking = false;
  window.addEventListener('resize', function () {
    if (!resizeTicking) {
      window.requestAnimationFrame(function () {
        faqItems.forEach(function (item) {
          if (item.classList.contains('active')) {
            var answer = item.querySelector('.faq-answer');
            if (answer) {
              answer.style.maxHeight = answer.scrollHeight + 'px';
            }
          }
        });
        resizeTicking = false;
      });
      resizeTicking = true;
    }
  });

})();
