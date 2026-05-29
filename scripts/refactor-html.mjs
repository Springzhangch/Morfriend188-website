import fs from 'node:fs/promises';

const files = ['index.html', 'products.html', 'about.html', 'certifications.html', 'contact.html'];

const headReplacement = `    <link rel="preconnect" href="https://cdnjs.cloudflare.com">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="stylesheet" href="assets/css/styles.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">`;

const logoPicture = `<picture>
                            <source srcset="assets/images/morfriend-logo.webp" type="image/webp">
                            <img src="assets/images/morfriend-logo.optimized.png" alt="Morfriend logo" class="brand-mark" width="40" height="40" loading="eager" decoding="async">
                        </picture>`;

for (const file of files) {
  let html = await fs.readFile(file, 'utf8');

  html = html.replace(/\s*<script src="https:\/\/cdn\.tailwindcss\.com"><\/script>\s*/g, '\n');
  html = html.replace(/\s*<link rel="stylesheet" href="https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/font-awesome\/6\.4\.0\/css\/all\.min\.css">\s*/g, '\n');
  html = html.replace(/\s*<link href="https:\/\/fonts\.googleapis\.com\/css2\?family=Inter[^"]+" rel="stylesheet">\s*/g, '\n');
  html = html.replace(/\s*<script>\s*tailwind\.config[\s\S]*?<\/script>\s*/m, '\n');
  html = html.replace(/\s*<style type="text\/tailwindcss">[\s\S]*?<\/style>\s*/m, '\n');
  html = html.replace(/(<meta name="viewport" content="width=device-width, initial-scale=1\.0">\s*)/m, `$1\n${headReplacement}\n`);

  html = html.replace(/<div class="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">\s*<i class="fas fa-shield-alt text-white text-xl"><\/i>\s*<\/div>/g, logoPicture);
  html = html.replace(/<i class="fas fa-shield-alt text-gold text-2xl"><\/i>/g, logoPicture);

  html = html.replace(/class="([^"]*)" style="background-image: url\('([^']+)'\); background-size: cover; background-position: center;"/g, 'class="$1 lazy-bg" data-bg="$2"');
  html = html.replace(/<section(?![^>]*id="home")([^>]*)class="([^"]*)"/g, '<section$1class="$2 content-auto"');
  html = html.replace(/<img(?![^>]*loading=)/g, '<img loading="lazy" decoding="async"');
  html = html.replace(/<body([^>]*)>/, '<body$1>\n    <noscript><style>.lazy-bg[data-bg]{background-image:var(--fallback-bg)}</style></noscript>');
  html = html.replace(/<\/body>/, '    <script src="assets/js/lazy-loading.js" defer></script>\n</body>');

  await fs.writeFile(file, html);
}
