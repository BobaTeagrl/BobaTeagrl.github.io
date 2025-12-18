import fs from 'fs';
import path from 'path';

const photos = JSON.parse(fs.readFileSync('photos.json'));
const outDir = './photo';

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

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
<meta property="og:image" content="${p.image}">
<meta property="og:url" content="https://bobateagrl.github.io/photo/${p.id}.html">

<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${p.title}">
<meta name="twitter:description" content="${p.description}">
<meta name="twitter:image" content="${p.image}">

<meta http-equiv="refresh" content="0; https://bobateagrl.github.io/LightCaptureTerminal.html">
</head>
<body>Redirecting…</body>
</html>`;

    fs.writeFileSync(path.join(outDir, `${p.id}.html`), html);
}

console.log('Photo pages generated.');
