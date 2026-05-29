# Morfriend Website

Static website for Morfriend, a golf cart windshield manufacturer.

## Files

- `index.html`, `products.html`, `about.html`, `certifications.html`, `contact.html`
- `assets/css/styles.css` is the compiled production Tailwind CSS file.
- `src/input.css` contains the Tailwind v4 theme tokens and custom utilities.
- `scripts/optimize-images.mjs` automatically compresses PNG/JPG assets and creates WebP versions.
- `assets/js/lazy-loading.js` delays offscreen image/background loading.

## Build

```bash
npm install
npm run build
```

The generated HTML and assets can be uploaded directly to GitHub Pages or any static hosting service.
