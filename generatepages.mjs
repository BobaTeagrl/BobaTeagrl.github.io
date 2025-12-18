import fs from 'fs';
import path from 'path';

const photos = JSON.parse(fs.readFileSync('photos.json'));
const outDir = './photo';

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

function abs(path) {
    return path.startsWith('/') ? path : '/' + path.replace(/^\.?\//, '');
}

for (const p of photos) {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${p.title} – Light Capture Terminal</title>
<meta name="description" content="${p.description}">

<meta property="og:type" content="website">
<meta property="og:title" content="${p.title}">
<meta property="og:description" content="${p.description}">
<meta property="og:image" content="${abs(p.image)}">
<meta property="og:url" content="https://bobateagrl.github.io/photo/${p.id}.html">

<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${p.title}">
<meta name="twitter:description" content="${p.description}">
<meta name="twitter:image" content="${abs(p.image)}">

<style>
body {
    background: #0a0a0a;
    color: #f700ff;
    font-family: 'JetBrains Mono', monospace;
    text-align: center;
    padding: 2rem;
    margin: 0;
}

.image-container {
    position: relative;
    max-width: 100%;
    margin: 2rem auto;
    overflow: hidden;
    border: 2px solid #f700ff;
    box-shadow: 0 0 20px rgba(247, 0, 255, 0.3);
}

.thumbnail {
    width: 100%;
    height: auto;
    filter: blur(20px);
    transform: scale(1.1);
    transition: opacity 0.3s ease;
}

.full-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: contain;
    opacity: 0;
    transition: opacity 0.5s ease;
}

.full-image.loaded {
    opacity: 1;
}

.thumbnail.hidden {
    opacity: 0;
}

h1 {
    color: #f700ff;
    text-shadow: 0 0 10px rgba(247, 0, 255, 0.5);
    font-size: 1.5rem;
    margin: 1rem 0;
}

.info {
    color: #888;
    font-size: 0.9rem;
    margin: 1rem 0;
}

a {
    color: #00ff41;
    text-decoration: none;
    padding: 0.5rem 1rem;
    border: 1px solid #00ff41;
    border-radius: 4px;
    display: inline-block;
    transition: all 0.3s ease;
}

a:hover {
    background: #00ff41;
    color: #0a0a0a;
    box-shadow: 0 0 15px rgba(0, 255, 65, 0.5);
}

.loading {
    color: #00ff41;
    font-size: 0.8rem;
    margin-top: 1rem;
}
</style>
</head>
<body>
<h1>${p.title}</h1>

<div class="image-container">
    <img src="${abs(p.thumb)}" class="thumbnail" alt="${p.title}">
    <img data-src="${abs(p.image)}" class="full-image" alt="${p.title}">
</div>

<p class="info">"${p.description}"</p>
<p class="loading" id="loading">Loading full resolution...</p>

<h2><a href="https://bobateagrl.github.io/LightCaptureTerminal.html?photo=${p.id}">← View in Gallery</a></h2>

<script>
// Progressive image loading
const fullImg = document.querySelector('.full-image');
const thumb = document.querySelector('.thumbnail');
const loading = document.getElementById('loading');

const img = new Image();
img.onload = () => {
    fullImg.src = img.src;
    fullImg.classList.add('loaded');
    setTimeout(() => {
        thumb.classList.add('hidden');
        loading.style.display = 'none';
    }, 500);
};
img.onerror = () => {
    loading.textContent = 'Failed to load full image';
    loading.style.color = '#ff4444';
};
img.src = fullImg.dataset.src;
</script>

</body>
</html>`;

    fs.writeFileSync(path.join(outDir, `${p.id}.html`), html);
}

console.log('✓ Photo pages generated.');