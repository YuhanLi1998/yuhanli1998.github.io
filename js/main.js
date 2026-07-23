/* ============================================
   Open outbound links in a new tab.
   Skips in-page anchors (#…), mailto:, tel:, and javascript:
   so on-page navigation still stays on the current tab.
   ============================================ */
(function () {
  var links = document.querySelectorAll('a[href]');
  Array.prototype.forEach.call(links, function (a) {
    var href = a.getAttribute('href') || '';
    if (
      href === '' ||
      href.charAt(0) === '#' ||
      href.indexOf('mailto:') === 0 ||
      href.indexOf('tel:') === 0 ||
      href.indexOf('javascript:') === 0
    ) {
      return;
    }
    a.setAttribute('target', '_blank');
    var rel = a.getAttribute('rel') || '';
    if (rel.indexOf('noopener') === -1) rel += ' noopener';
    if (rel.indexOf('noreferrer') === -1) rel += ' noreferrer';
    a.setAttribute('rel', rel.trim());
  });
})();

/* ============================================
   Inject a small SVG icon before each .pub-links link
   (pdf / doi / abs / bib / code / video / demo / etc.),
   matched by the link's visible text.
   Add new link types by extending the ICONS dictionary.
   ============================================ */
(function () {
  var ICONS = {
    abs:          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17 3H7a2 2 0 0 0-2 2v16l7-4 7 4V5a2 2 0 0 0-2-2z"/></svg>',
    bib:          '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6 17h3l2-4V7H5v6h3l-2 4zm8 0h3l2-4V7h-6v6h3l-2 4z"/></svg>',
    doi:          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>',
    pdf:          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="13" y2="17"/></svg>',
    code:         '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
    replication:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>',
    poster:       '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>',
    supplemental: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>',
    video:        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8" fill="currentColor"/></svg>',
    demo:         '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M3 3l4 17 3-7 7-3z"/></svg>',
    blog:         '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>',
    press:        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8M15 18h-5M18 6h-8v4h8z"/></svg>',
    slides:       '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="14" rx="1"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>',
    media:        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="8" y1="22" x2="16" y2="22"/></svg>'
  };

  var links = document.querySelectorAll('.pub-links a');
  Array.prototype.forEach.call(links, function (a) {
    // don't re-inject if an <svg> is already there
    if (a.querySelector('svg')) return;
    var key = (a.textContent || '').trim().toLowerCase();
    if (ICONS[key]) {
      a.insertAdjacentHTML('afterbegin', ICONS[key]);
    }
  });
})();

/* ============================================
   Copy BibTeX to clipboard when the "bib" link is clicked.
   Each pub's <a data-bib="key">bib</a> looks up its entry from BIBTEX
   below, copies to clipboard, and briefly flashes "copied!" as feedback.
   ============================================ */
(function () {
  var BIBTEX = {
    li2026perceived:
      '@article{li2026perceived,\n' +
      '  author  = {Li, Yuhan and Lu, Hang},\n' +
      '  title   = {Perceived legitimacy matters: Building public trust and acceptance of {AI}-generated news images through strategic {AI} disclosure},\n' +
      '  journal = {Journalism \\& Mass Communication Quarterly},\n' +
      '  year    = {2026},\n' +
      '  doi     = {10.1177/10776990261462536}\n' +
      '}',
    li2026stitching:
      '@article{li2026stitching,\n' +
      '  author  = {Li, Yuhan and Zhang, Annie Li and Lu, Hang},\n' +
      '  title   = {Stitching, dueting, and playing with science on {TikTok}: An {AI}-powered multimodal approach to understanding interactive science videos and audience engagement},\n' +
      '  journal = {Computational Communication Research},\n' +
      '  year    = {2026},\n' +
      '  doi     = {10.5117/CCR2026.4.2.LI}\n' +
      '}',
    li2026navigating:
      '@article{li2026navigating,\n' +
      '  author  = {Li, Yuhan and Lu, Hang and Yu, Chao},\n' +
      '  title   = {Navigating intersectional expectations: A computational multimodal analysis of the effects of identities and communication styles on public engagement with science on {TikTok}},\n' +
      '  journal = {Information, Communication \\& Society},\n' +
      '  year    = {2026},\n' +
      '  doi     = {10.1080/1369118X.2026.2659280}\n' +
      '}',
    guo2026cross:
      '@article{guo2026cross,\n' +
      '  author  = {Guo, Yufan and Lin, Cong and Li, Yuhan},\n' +
      '  title   = {Does trending across platforms popularize political topics? A cross-platform spillover framework of public attention},\n' +
      '  journal = {Information, Communication \\& Society},\n' +
      '  year    = {2026},\n' +
      '  doi     = {10.1080/1369118X.2026.2633216}\n' +
      '}',
    guo2025civilizing:
      '@article{guo2025civilizing,\n' +
      '  author  = {Guo, Yufan and Li, Yuhan and Yang, Tian},\n' +
      '  title   = {Civilizing social media: The effect of geolocation on the incivility of news comments},\n' +
      '  journal = {New Media \\& Society},\n' +
      '  year    = {2025},\n' +
      '  doi     = {10.1177/14614448231218989}\n' +
      '}',
    li2024climate:
      '@article{li2024climate,\n' +
      '  author  = {Li, Yuhan and Yu, Beichen and Dai, Jia},\n' +
      '  title   = {``Climate Change\'\' or ``Global Warming\'\'? The {(Un)}Politicization of climate in {Chinese} social media platform},\n' +
      '  journal = {Environmental Communication},\n' +
      '  year    = {2024},\n' +
      '  doi     = {10.1080/17524032.2024.2327069}\n' +
      '}'
  };

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    // Fallback for older browsers / non-HTTPS
    return new Promise(function (resolve, reject) {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand('copy') ? resolve() : reject();
      } catch (e) { reject(e); }
      document.body.removeChild(ta);
    });
  }

  document.querySelectorAll('a[data-bib]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      var key = a.getAttribute('data-bib');
      var entry = BIBTEX[key];
      if (!entry) { console.warn('No BibTeX entry for key:', key); return; }
      var originalHTML = a.innerHTML;
      copyText(entry).then(function () {
        a.innerHTML = 'copied!';
        a.classList.add('is-copied');
        setTimeout(function () {
          a.innerHTML = originalHTML;
          a.classList.remove('is-copied');
        }, 1400);
      }).catch(function () {
        a.innerHTML = 'copy failed';
        setTimeout(function () { a.innerHTML = originalHTML; }, 1400);
      });
    });
  });
})();

/* ============================================
   Back-to-top button — visible after scrolling past 400px.
   ============================================ */
(function () {
  var btn = document.getElementById('back-to-top');
  if (!btn) return;

  var visible = false;
  function update() {
    var shouldShow = window.scrollY > 400;
    if (shouldShow !== visible) {
      visible = shouldShow;
      btn.classList.toggle('is-visible', visible);
    }
  }
  window.addEventListener('scroll', update, { passive: true });
  update();

  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ============================================
   Publication thumbnails — click-to-enlarge lightbox.
   ============================================ */
(function () {
  var thumbs = document.querySelectorAll('.pub-thumb');
  if (!thumbs.length) return;

  // Build the lightbox once and append to <body>.
  var lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.setAttribute('role', 'dialog');
  lightbox.setAttribute('aria-modal', 'true');
  lightbox.setAttribute('aria-hidden', 'true');
  lightbox.innerHTML =
    '<button class="lightbox-close" type="button" aria-label="Close">×</button>' +
    '<img alt="" />';
  document.body.appendChild(lightbox);

  var lightboxImg = lightbox.querySelector('img');
  var closeBtn = lightbox.querySelector('.lightbox-close');
  var lastFocused = null;

  function open(src, alt) {
    lastFocused = document.activeElement;
    lightboxImg.src = src;
    lightboxImg.alt = alt || '';
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    // move focus into the dialog for keyboard users
    closeBtn.focus();
  }

  function close() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    // clear the src after the fade-out so we don't flash the previous image
    setTimeout(function () {
      if (!lightbox.classList.contains('open')) lightboxImg.src = '';
    }, 260);
    if (lastFocused && typeof lastFocused.focus === 'function') {
      lastFocused.focus();
    }
  }

  Array.prototype.forEach.call(thumbs, function (thumb) {
    var img = thumb.querySelector('img');
    if (!img) return;

    thumb.setAttribute('role', 'button');
    thumb.setAttribute('tabindex', '0');
    thumb.setAttribute('aria-label', 'Enlarge figure');

    thumb.addEventListener('click', function (e) {
      e.preventDefault();
      open(img.currentSrc || img.src, img.alt);
    });

    thumb.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        open(img.currentSrc || img.src, img.alt);
      }
    });
  });

  // Click on backdrop or close button closes; click on image does not.
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox || e.target === closeBtn ||
        (closeBtn.contains && closeBtn.contains(e.target))) {
      close();
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && lightbox.classList.contains('open')) {
      close();
    }
  });
})();
