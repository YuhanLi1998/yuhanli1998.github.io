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
