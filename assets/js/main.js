/**
 * JMK Furniture Modular Solutions - Master JavaScript (App-First Mobile & Desktop)
 * Fully robust event delegation for mobile drawer, bottom app bar, cost calculator, FAQs & WhatsApp Lead Engine
 */

(function() {
  'use strict';

  // Helper functions for mobile drawer
  function openMobileDrawer() {
    const drawer = document.querySelector('.mobile-menu-drawer');
    const overlay = document.querySelector('.mobile-menu-overlay');
    if (drawer) drawer.classList.add('open');
    if (overlay) overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileDrawer() {
    const drawer = document.querySelector('.mobile-menu-drawer');
    const overlay = document.querySelector('.mobile-menu-overlay');
    if (drawer) drawer.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  // Global click & touch delegation for rock-solid responsiveness
  document.addEventListener('click', function(e) {
    // 1. Open mobile drawer
    const toggleBtn = e.target.closest('.mobile-nav-toggle');
    if (toggleBtn) {
      e.preventDefault();
      e.stopPropagation();
      openMobileDrawer();
      return;
    }

    // 2. Close mobile drawer
    const closeBtn = e.target.closest('.mobile-close-btn');
    if (closeBtn) {
      e.preventDefault();
      e.stopPropagation();
      closeMobileDrawer();
      return;
    }

    // 3. Click outside on overlay
    if (e.target.classList.contains('mobile-menu-overlay')) {
      e.preventDefault();
      closeMobileDrawer();
      return;
    }

    // 4. Close drawer on link navigation
    const drawerLink = e.target.closest('.mobile-menu-drawer a');
    if (drawerLink) {
      closeMobileDrawer();
    }
  }, { passive: false });

  document.addEventListener('DOMContentLoaded', function() {
    // Sticky Header Scroll
    const header = document.querySelector('.site-header');
    if (header) {
      window.addEventListener('scroll', function() {
        if (window.scrollY > 20) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      }, { passive: true });
    }

    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(function(item) {
      const header = item.querySelector('.faq-header');
      if (header) {
        header.addEventListener('click', function() {
          const isActive = item.classList.contains('active');
          faqItems.forEach(function(other) { other.classList.remove('active'); });
          if (!isActive) {
            item.classList.add('active');
          }
        });
      }
    });

    // Portfolio Filter
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterBtns.forEach(function(btn) {
      btn.addEventListener('click', function() {
        filterBtns.forEach(function(b) { b.classList.remove('active'); });
        btn.classList.add('active');
        const filterValue = btn.getAttribute('data-filter');

        portfolioItems.forEach(function(item) {
          const category = item.getAttribute('data-category');
          if (filterValue === 'all' || category === filterValue || (category && category.indexOf(filterValue) !== -1)) {
            item.style.display = 'block';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });

    // Interactive Cost Estimator
    const bhkOptions = document.querySelectorAll('input[name="bhk_type"]');
    const scopeCheckboxes = document.querySelectorAll('input[name="scope"]');
    const finishOptions = document.querySelectorAll('input[name="finish_type"]');
    const priceDisplay = document.getElementById('estimatedPrice');
    const breakdownDisplay = document.getElementById('estimateBreakdown');
    const whatsappQuoteBtn = document.getElementById('calcWhatsappBtn');

    function calculateEstimate() {
      if (!priceDisplay) return;

      let baseMultiplier = 1;
      let selectedBhk = '2 BHK';
      bhkOptions.forEach(function(opt) {
        if (opt.checked) {
          baseMultiplier = parseFloat(opt.value);
          selectedBhk = opt.getAttribute('data-name') || '2 BHK';
          opt.closest('.calc-option')?.classList.add('selected');
        } else {
          opt.closest('.calc-option')?.classList.remove('selected');
        }
      });

      let scopeTotal = 0;
      let selectedScopes = [];
      scopeCheckboxes.forEach(function(cb) {
        if (cb.checked) {
          scopeTotal += parseFloat(cb.value);
          selectedScopes.push(cb.getAttribute('data-name'));
          cb.closest('.calc-option')?.classList.add('selected');
        } else {
          cb.closest('.calc-option')?.classList.remove('selected');
        }
      });

      let finishMultiplier = 1.0;
      let selectedFinish = 'Premium Laminate';
      finishOptions.forEach(function(fin) {
        if (fin.checked) {
          finishMultiplier = parseFloat(fin.value);
          selectedFinish = fin.getAttribute('data-name') || 'Laminate';
          fin.closest('.calc-option')?.classList.add('selected');
        } else {
          fin.closest('.calc-option')?.classList.remove('selected');
        }
      });

      if (scopeTotal === 0) scopeTotal = 180000;

      const totalEstimate = Math.round(scopeTotal * baseMultiplier * finishMultiplier);
      const minEstimate = Math.round(totalEstimate * 0.9);
      const maxEstimate = Math.round(totalEstimate * 1.15);

      priceDisplay.textContent = '₹ ' + minEstimate.toLocaleString('en-IN') + ' - ₹ ' + maxEstimate.toLocaleString('en-IN');

      if (breakdownDisplay) {
        breakdownDisplay.textContent = 'Based on ' + selectedBhk + ', with ' + (selectedScopes.join(', ') || 'Standard Modular Setups') + ' in ' + selectedFinish + ' finish in Ahmedabad.';
      }

      if (whatsappQuoteBtn) {
        const msg = encodeURIComponent('Hi JMK Furniture Modular Solutions, I calculated an estimate on your mobile app/website for my ' + selectedBhk + ' in Ahmedabad (' + selectedScopes.join(', ') + ' with ' + selectedFinish + ' finish). Estimated budget range is ₹' + minEstimate.toLocaleString('en-IN') + ' - ₹' + maxEstimate.toLocaleString('en-IN') + '. Please share a detailed quote & free 3D design consultation.');
        whatsappQuoteBtn.href = 'https://wa.me/919978040040?text=' + msg;
      }
    }

    if (bhkOptions.length > 0) {
      bhkOptions.forEach(function(el) { el.addEventListener('change', calculateEstimate); });
      scopeCheckboxes.forEach(function(el) { el.addEventListener('change', calculateEstimate); });
      finishOptions.forEach(function(el) { el.addEventListener('change', calculateEstimate); });
      calculateEstimate();
    }

    // Lead Form Handler
    const leadForms = document.querySelectorAll('.js-lead-form');
    leadForms.forEach(function(form) {
      form.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = form.querySelector('[name="name"]')?.value || 'Customer';
        const phone = form.querySelector('[name="phone"]')?.value || '';
        const service = form.querySelector('[name="service"]')?.value || 'Interior Design';
        const area = form.querySelector('[name="area"]')?.value || 'Ahmedabad';
        const message = form.querySelector('[name="message"]')?.value || 'Looking for modular furniture and interior solutions.';

        const waText = encodeURIComponent(
          '*New Enquiry - JMK Furniture Modular Solutions*\n\n' +
          '👤 *Name:* ' + name + '\n' +
          '📞 *Phone:* ' + phone + '\n' +
          '📍 *Location:* ' + area + '\n' +
          '🛋️ *Service:* ' + service + '\n' +
          '💬 *Message:* ' + message + '\n\n' +
          'Please contact me with design catalogue & estimate.'
        );

        window.open('https://wa.me/919978040040?text=' + waText, '_blank');
      });
    });

    // Modal Sheet Handler
    const modalOverlay = document.getElementById('quoteModal');
    const modalOpenBtns = document.querySelectorAll('.js-open-modal');
    const modalCloseBtn = document.querySelector('.modal-close');

    modalOpenBtns.forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        if (modalOverlay) modalOverlay.classList.add('open');
      });
    });

    if (modalCloseBtn && modalOverlay) {
      modalCloseBtn.addEventListener('click', function() { modalOverlay.classList.remove('open'); });
      modalOverlay.addEventListener('click', function(e) {
        if (e.target === modalOverlay) modalOverlay.classList.remove('open');
      });
    }
  });
})();
