(() => {
  const loadImage = (image) => {
    if (image.dataset.src) {
      image.src = image.dataset.src;
      image.removeAttribute('data-src');
    }

    if (image.dataset.srcset) {
      image.srcset = image.dataset.srcset;
      image.removeAttribute('data-srcset');
    }
  };

  const loadBackground = (element) => {
    if (!element.dataset.bg) return;
    element.style.backgroundImage = `url("${element.dataset.bg}")`;
    element.removeAttribute('data-bg');
  };

  const lazyItems = [
    ...document.querySelectorAll('img[data-src], source[data-srcset], .lazy-bg[data-bg]'),
  ];

  if (!('IntersectionObserver' in window)) {
    lazyItems.forEach((item) => {
      if (item.matches('source')) {
        item.srcset = item.dataset.srcset;
        item.removeAttribute('data-srcset');
      } else if (item.matches('img')) {
        loadImage(item);
      } else {
        loadBackground(item);
      }
    });
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const item = entry.target;

      if (item.matches('source')) {
        item.srcset = item.dataset.srcset;
        item.removeAttribute('data-srcset');
      } else if (item.matches('img')) {
        loadImage(item);
      } else {
        loadBackground(item);
      }

      observer.unobserve(item);
    });
  }, {
    rootMargin: '320px 0px',
    threshold: 0.01,
  });

  lazyItems.forEach((item) => observer.observe(item));
})();
