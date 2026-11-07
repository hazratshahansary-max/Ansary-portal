/**
 * Crisp Vector Visual Assets for Ansary Knowledge
 * Provides fallback illustrations and cover designs so cards never display broken image icons.
 */

// Elegant SVG data URI generator for book covers
export function createBookCoverSvg(title: string, author: string, category: string, bgGradient: string = 'from-blue-900 to-indigo-950') {
  return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 550" width="400" height="550">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="%230F172A" />
        <stop offset="40%" stop-color="%231E3A8A" />
        <stop offset="100%" stop-color="%23172554" />
      </linearGradient>
      <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="%23FFF3C4" />
        <stop offset="50%" stop-color="%23E5B94E" />
        <stop offset="100%" stop-color="%23C59325" />
      </linearGradient>
    </defs>
    <rect width="400" height="550" rx="16" fill="url(%23bg)" />
    <rect x="20" y="20" width="360" height="510" rx="10" fill="none" stroke="url(%23gold)" stroke-width="2" opacity="0.6" stroke-dasharray="8 6" />
    <circle cx="200" cy="140" r="48" fill="none" stroke="url(%23gold)" stroke-width="2" opacity="0.8" />
    <path d="M 180 145 C 190 135 200 135 210 145 C 220 135 230 135 240 145" fill="none" stroke="url(%23gold)" stroke-width="2.5" />
    <text x="200" y="240" font-family="Cinzel, Georgia, serif" font-size="20" font-weight="bold" fill="url(%23gold)" text-anchor="middle" width="320">
      ${encodeURIComponent(title.slice(0, 32))}
    </text>
    <text x="200" y="320" font-family="sans-serif" font-size="14" fill="%2393C5FD" text-anchor="middle">
      ${encodeURIComponent(category)}
    </text>
    <line x1="80" y1="360" x2="320" y2="360" stroke="url(%23gold)" stroke-width="1.5" opacity="0.4" />
    <text x="200" y="420" font-family="sans-serif" font-size="14" font-weight="600" fill="%23FFFFFF" text-anchor="middle">
      ${encodeURIComponent(author)}
    </text>
    <text x="200" y="480" font-family="Cinzel, serif" font-size="12" letter-spacing="4" fill="url(%23gold)" text-anchor="middle">
      ANSARY KNOWLEDGE
    </text>
  </svg>`;
}

// Banner fallback
export const DEFAULT_HERO_BANNER = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <defs>
    <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="%23070D1E" />
      <stop offset="45%" stop-color="%230F2347" />
      <stop offset="100%" stop-color="%231E3A8A" />
    </linearGradient>
    <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="%23FFF3C4" />
      <stop offset="50%" stop-color="%23E5B94E" />
      <stop offset="100%" stop-color="%23C59325" />
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(%23g1)" />
  <circle cx="950" cy="300" r="280" fill="none" stroke="%233B82F6" stroke-width="1.5" opacity="0.2" />
  <circle cx="950" cy="300" r="220" fill="none" stroke="url(%23gold)" stroke-width="2" opacity="0.3" stroke-dasharray="10 8" />
  <circle cx="950" cy="300" r="160" fill="none" stroke="%2360A5FA" stroke-width="1.5" opacity="0.3" />
  <path d="M 600 450 L 950 150 L 1150 500" stroke="%233B82F6" stroke-width="1" opacity="0.15" fill="none" />
  <text x="120" y="270" font-family="Cinzel, Georgia, serif" font-size="54" font-weight="bold" fill="url(%23gold)" letter-spacing="4">
    ANSARY KNOWLEDGE
  </text>
  <text x="120" y="340" font-family="sans-serif" font-size="24" font-weight="300" fill="%23E2E8F0">
    Digital Library · Research · Cloud Databases · Poetry &amp; Afghan Heritage
  </text>
  <text x="120" y="420" font-family="sans-serif" font-size="18" fill="%2393C5FD">
    Founded by Hazrat Shah Ansary
  </text>
</svg>`;

export const DEFAULT_DATABASE_IMG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="%230F172A" />
      <stop offset="100%" stop-color="%231E293B" />
    </linearGradient>
    <linearGradient id="blueG" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="%232563EB" />
      <stop offset="100%" stop-color="%2360A5FA" />
    </linearGradient>
  </defs>
  <rect width="800" height="500" fill="url(%23bg)" rx="12" />
  <!-- Database node cylinders -->
  <g fill="none" stroke="url(%23blueG)" stroke-width="3">
    <ellipse cx="220" cy="180" rx="90" ry="25" />
    <path d="M 130 180 v 50 c 0 15 40 25 90 25 s 90 -10 90 -25 v -50" />
    <path d="M 130 230 v 50 c 0 15 40 25 90 25 s 90 -10 90 -25 v -50" />
    
    <ellipse cx="580" cy="180" rx="90" ry="25" />
    <path d="M 490 180 v 50 c 0 15 40 25 90 25 s 90 -10 90 -25 v -50" />
    <path d="M 490 230 v 50 c 0 15 40 25 90 25 s 90 -10 90 -25 v -50" />
  </g>
  <!-- Data pipeline connection -->
  <path d="M 310 230 C 400 210 400 210 490 230" fill="none" stroke="%23F59E0B" stroke-width="3" stroke-dasharray="6 6" />
  <text x="400" y="380" font-family="sans-serif" font-size="20" font-weight="bold" fill="%23FFFFFF" text-anchor="middle">
    Enterprise PostgreSQL &amp; Supabase Multi-Cluster Architecture
  </text>
  <text x="400" y="420" font-family="sans-serif" font-size="14" fill="%2394A3B8" text-anchor="middle">
    Row Level Security (RLS) · Real-Time Replication · Automated Backups
  </text>
</svg>`;

export const DEFAULT_FOUNDER_PORTRAIT = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="%230F172A" />
      <stop offset="50%" stop-color="%231E3A8A" />
      <stop offset="100%" stop-color="%23172554" />
    </linearGradient>
    <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="%23FFF3C4" />
      <stop offset="50%" stop-color="%23E5B94E" />
      <stop offset="100%" stop-color="%23C59325" />
    </linearGradient>
  </defs>
  <rect width="500" height="500" rx="32" fill="url(%23bg)" />
  <circle cx="250" cy="200" r="85" fill="%231E293B" stroke="url(%23gold)" stroke-width="3" />
  <!-- Silhouette / Crest -->
  <path d="M 210 330 C 210 280 290 280 290 330 Z" fill="url(%23gold)" opacity="0.8" />
  <circle cx="250" cy="180" r="45" fill="url(%23gold)" />
  <text x="250" y="380" font-family="Cinzel, Georgia, serif" font-size="24" font-weight="bold" fill="%23FFFFFF" text-anchor="middle">
    HAZRAT SHAH ANSARY
  </text>
  <text x="250" y="415" font-family="sans-serif" font-size="14" fill="%2393C5FD" text-anchor="middle">
    Founder · Principal Database Architect &amp; Author
  </text>
</svg>`;
