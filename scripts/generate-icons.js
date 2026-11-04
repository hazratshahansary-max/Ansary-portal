import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

const publicDir = path.resolve('/app/applet/public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// 1. Create the master SVG icon
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#070D1E" />
      <stop offset="50%" stop-color="#0B1A30" />
      <stop offset="100%" stop-color="#102A4C" />
    </linearGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFF3C4" />
      <stop offset="35%" stop-color="#E5B94E" />
      <stop offset="70%" stop-color="#C59325" />
      <stop offset="100%" stop-color="#8C6207" />
    </linearGradient>
    <linearGradient id="blueGlow" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#2563EB" />
      <stop offset="100%" stop-color="#60A5FA" />
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="6" stdDeviation="10" flood-color="#000" flood-opacity="0.6"/>
    </filter>
  </defs>

  <!-- Background Base -->
  <rect width="512" height="512" rx="108" fill="url(#bgGrad)" />
  
  <!-- Outer Decorative Ring -->
  <circle cx="256" cy="256" r="226" fill="none" stroke="url(#goldGrad)" stroke-width="2" stroke-dasharray="8 6" opacity="0.4" />
  <circle cx="256" cy="256" r="216" fill="none" stroke="url(#blueGlow)" stroke-width="3" opacity="0.6" />

  <!-- Central Crest: Book Wings + Stylized ANSARY 'A' + Quill Apex -->
  <g filter="url(#shadow)">
    <!-- Open Book Base Curve Left -->
    <path d="M 256 370 C 220 385 160 380 120 360 C 135 320 165 300 205 320 C 225 330 245 350 256 370 Z" fill="url(#blueGlow)" opacity="0.85" />
    <!-- Open Book Base Curve Right -->
    <path d="M 256 370 C 292 385 352 380 392 360 C 377 320 347 300 307 320 C 287 330 267 350 256 370 Z" fill="url(#blueGlow)" opacity="0.85" />

    <!-- Stylized Monogram 'A' with Golden Calligraphic Ribbons -->
    <!-- Left Leg -->
    <path d="M 256 100 L 160 380 L 195 380 L 228 280 L 256 280 L 256 240 L 242 240 L 256 195 Z" fill="url(#goldGrad)" />
    <!-- Right Leg -->
    <path d="M 256 100 L 352 380 L 317 380 L 284 280 L 256 280 L 256 240 L 270 240 L 256 195 Z" fill="url(#goldGrad)" />
    
    <!-- Central Tech Node & Quill Nib -->
    <polygon points="256,76 270,120 256,155 242,120" fill="url(#goldGrad)" />
    <circle cx="256" cy="120" r="5" fill="#070D1E" />
    <line x1="256" y1="125" x2="256" y2="155" stroke="#070D1E" stroke-width="2.5" />

    <!-- Horizontal Crossbar Tech Circuit -->
    <rect x="210" y="272" width="92" height="8" rx="4" fill="url(#goldGrad)" />
    <circle cx="210" cy="276" r="6" fill="#FDE68A" />
    <circle cx="302" cy="276" r="6" fill="#FDE68A" />
    <circle cx="256" cy="276" r="4" fill="#0B1A30" />

    <!-- Golden Star / Beacon at Top -->
    <path d="M 256 46 L 261 62 L 277 67 L 261 72 L 256 88 L 251 72 L 235 67 L 251 62 Z" fill="url(#goldGrad)" />
  </g>

  <!-- Wordmark at Bottom inside Icon -->
  <text x="256" y="445" font-family="'Cinzel', 'Playfair Display', Georgia, serif" font-size="34" font-weight="700" letter-spacing="10" fill="url(#goldGrad)" text-anchor="middle">ANSARY</text>
  <text x="256" y="475" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="600" letter-spacing="4" fill="#93C5FD" text-anchor="middle">KNOWLEDGE &amp; TECH</text>
</svg>`;

fs.writeFileSync(path.join(publicDir, 'icon.svg'), svgContent);
console.log('Created public/icon.svg');

// Simple pure Node PNG generator function (creates RGBA raw bitmap -> PNG)
function createRawPNG(width, height, getPixel) {
  // A minimal valid PNG encoder
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  function makeChunk(type, data) {
    const len = data.length;
    const buf = Buffer.alloc(12 + len);
    buf.writeUInt32BE(len, 0);
    buf.write(type, 4, 4, 'ascii');
    data.copy(buf, 8);
    // CRC
    let crc = 0xffffffff;
    for (let i = 4; i < 8 + len; i++) {
      let byte = buf[i];
      for (let j = 0; j < 8; j++) {
        if ((crc ^ byte) & 1) {
          crc = (crc >>> 1) ^ 0xedb88320;
        } else {
          crc = crc >>> 1;
        }
        byte = byte >>> 1;
      }
    }
    buf.writeInt32BE((crc ^ 0xffffffff) | 0, 8 + len);
    return buf;
  }

  const ihdrChunk = makeChunk('IHDR', ihdr);

  // Scanlines with filter byte 0
  const scanlineLength = width * 4 + 1;
  const rawData = Buffer.alloc(scanlineLength * height);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * scanlineLength;
    rawData[rowOffset] = 0; // filter None
    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;
      const [r, g, b, a] = getPixel(x, y, width, height);
      rawData[pxOffset] = r;
      rawData[pxOffset + 1] = g;
      rawData[pxOffset + 2] = b;
      rawData[pxOffset + 3] = a;
    }
  }

  const compressed = zlib.deflateSync(rawData);
  const idatChunk = makeChunk('IDAT', compressed);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

// Generate branded navy-and-gold icons
function ansaryPixelShader(x, y, w, h, isMaskable = false) {
  const cx = w / 2;
  const cy = h / 2;
  const dx = (x - cx) / (w / 2);
  const dy = (y - cy) / (h / 2);
  const dist = Math.sqrt(dx * dx + dy * dy);

  // Deep Navy background with radial gradient
  let bgR = 11 + Math.floor(10 * (1 - dist));
  let bgG = 25 + Math.floor(18 * (1 - dist));
  let bgB = 48 + Math.floor(35 * (1 - dist));

  // Gold ring at dist ~ 0.8
  const ringDist = Math.abs(dist - 0.78);
  if (ringDist < 0.03) {
    return [212, 175, 55, 255]; // Gold
  }
  if (Math.abs(dist - 0.72) < 0.015) {
    return [37, 99, 235, 255]; // Royal Blue
  }

  // Centered 'A' monogram geometry
  // Normalized x, y in [-1, 1]
  const ny = (y - cy) / (h * 0.35); // [-1 to 1]
  const nx = (x - cx) / (w * 0.35);

  // Check if inside triangular 'A' shape
  if (ny > -0.85 && ny < 0.85) {
    const slope = 0.55;
    const legWidth = 0.22;
    const targetX = Math.abs(ny + 0.85) * slope;
    const distToLeg = Math.abs(Math.abs(nx) - targetX);

    // Crossbar
    const isCrossbar = Math.abs(ny - 0.15) < 0.1 && Math.abs(nx) < targetX;

    if (distToLeg < legWidth || isCrossbar) {
      // Golden gradient
      const goldY = (ny + 1) / 2;
      return [
        Math.min(255, 245 - Math.floor(goldY * 30)),
        Math.min(255, 210 - Math.floor(goldY * 50)),
        Math.min(255, 80 + Math.floor(goldY * 30)),
        255
      ];
    }
  }

  // Top star
  if (Math.abs(nx) < 0.08 && ny < -0.85 && ny > -1.05) {
    return [245, 218, 120, 255];
  }
  if (Math.abs(ny + 0.95) < 0.04 && Math.abs(nx) < 0.14) {
    return [245, 218, 120, 255];
  }

  return [bgR, bgG, bgB, 255];
}

const pwa192 = createRawPNG(192, 192, (x, y, w, h) => ansaryPixelShader(x, y, w, h, false));
fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), pwa192);

const pwa512 = createRawPNG(512, 512, (x, y, w, h) => ansaryPixelShader(x, y, w, h, false));
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), pwa512);

const pwaMaskable = createRawPNG(512, 512, (x, y, w, h) => ansaryPixelShader(x, y, w, h, true));
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), pwaMaskable);

const appleTouchIcon = createRawPNG(180, 180, (x, y, w, h) => ansaryPixelShader(x, y, w, h, false));
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), appleTouchIcon);

console.log('All PNG icons generated successfully in /app/applet/public!');
