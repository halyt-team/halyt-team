/*
   ==================================================================
   ==   @ Halyt                                                    ==
   ==   @ author: Mai Quoc Viet                                    ==
   ==   @ project: halyt-team                                      ==
   ==   @ copyright: (c) 2026 Halyt. All rights reserved.          ==
   ==================================================================
*/
/**
 * Generates the light/dark banner and process SVGs of the profile into
 * assets/. Usage: node scripts/build-assets.mjs
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const out = join(dirname(fileURLToPath(import.meta.url)), '..', 'assets');
mkdirSync(out, { recursive: true });

const SANS = "'Inter','Segoe UI','Helvetica Neue',Helvetica,Arial,sans-serif";
const SERIF = "'Fraunces',Georgia,'Times New Roman',serif";
const MONO = "'JetBrains Mono','SFMono-Regular',Consolas,Menlo,monospace";

const mark = (x, y, s, fill) => `
  <g transform="translate(${x} ${y}) scale(${s})" fill="${fill}">
    <path d="M0 6A62 62 0 0 1 62 68V214A62 62 0 0 1 0 276Z"/>
    <circle cx="118" cy="39" r="39"/>
    <path d="M63 116A103.3 103.3 0 0 1 219 206V276H157V240A129.6 129.6 0 0 0 63 116Z"/>
  </g>`;

function banner(theme) {
  const dark = theme === 'dark';
  const panel = dark ? '#121816' : '#090d0c';
  const border = dark ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0)';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 440" width="1200" height="440" role="img" aria-label="Halyt - Websites for small businesses, designed, built and run for you.">
  <defs>
    <radialGradient id="haze" cx="0.82" cy="0.18" r="0.65">
      <stop offset="0" stop-color="#d6ad62" stop-opacity="0.30"/>
      <stop offset="0.55" stop-color="#d6ad62" stop-opacity="0.06"/>
      <stop offset="1" stop-color="#d6ad62" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="mint" cx="0.08" cy="1" r="0.6">
      <stop offset="0" stop-color="#8fd6bf" stop-opacity="0.16"/>
      <stop offset="1" stop-color="#8fd6bf" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="hero" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0e5a4e"/>
      <stop offset="1" stop-color="#17302a"/>
    </linearGradient>
    <linearGradient id="goldline" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#ecd197"/>
      <stop offset="1" stop-color="#c99a45"/>
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="150%">
      <feDropShadow dx="0" dy="18" stdDeviation="20" flood-color="#000" flood-opacity="0.45"/>
    </filter>
    <clipPath id="panel"><rect width="1200" height="440" rx="28"/></clipPath>
  </defs>

  <g clip-path="url(#panel)">
    <rect width="1200" height="440" fill="${panel}"/>
    <rect width="1200" height="440" fill="url(#haze)"/>
    <rect width="1200" height="440" fill="url(#mint)"/>
    <ellipse cx="930" cy="235" rx="360" ry="150" transform="rotate(-12 930 235)" fill="none" stroke="#e2bd78" stroke-opacity="0.32" stroke-width="1.2" stroke-dasharray="2 7"/>
    <circle cx="590" cy="268" r="4" fill="#e2bd78"/>
  </g>
  <rect x="0.5" y="0.5" width="1199" height="439" rx="27.5" fill="none" stroke="${border}"/>
  ${mark(72, 60, 0.155, '#efede7')}
  <text x="116" y="96" font-family="${SANS}" font-size="30" font-weight="600" letter-spacing="-0.5" fill="#efede7">Halyt</text>

  <text x="72" y="168" font-family="${SANS}" font-size="15" font-weight="600" letter-spacing="3.4" fill="#e2bd78">DESIGN  ·  BUILD  ·  HOSTING  ·  CARE</text>

  <g font-family="${SANS}" font-size="50" font-weight="500" letter-spacing="-1.2" fill="#efede7">
    <text x="70" y="232">Websites for small</text>
    <text x="70" y="290">businesses, designed,</text>
  </g>
  <text x="70" y="348" font-family="${SERIF}" font-style="italic" font-size="52" font-weight="400" letter-spacing="-0.6" fill="url(#goldline)">built and run for you.</text>

  <text x="72" y="398" font-family="${SANS}" font-size="18" fill="#a2aba7">halyt.com<tspan fill="#5a625e">   /   </tspan>hello@halyt.com</text>

  <g filter="url(#shadow)">
    <rect x="690" y="74" width="440" height="300" rx="16" fill="#151a18" stroke="rgba(255,255,255,0.14)"/>
  </g>
  <circle cx="714" cy="96" r="5" fill="#3a403d"/>
  <circle cx="732" cy="96" r="5" fill="#3a403d"/>
  <circle cx="750" cy="96" r="5" fill="#3a403d"/>
  <rect x="780" y="84" width="270" height="24" rx="12" fill="#0b0e0d" stroke="rgba(255,255,255,0.08)"/>
  <circle cx="798" cy="96" r="3.5" fill="#e2bd78"/>
  <text x="810" y="100.5" font-family="${MONO}" font-size="12" fill="#a2aba7">yourname<tspan fill="#efede7">.halyt.com</tspan></text>
  <line x1="690" y1="118" x2="1130" y2="118" stroke="rgba(255,255,255,0.08)"/>

  <rect x="712" y="134" width="396" height="128" rx="12" fill="url(#hero)"/>
  <rect x="734" y="160" width="190" height="14" rx="7" fill="#efede7" fill-opacity="0.92"/>
  <rect x="734" y="184" width="140" height="14" rx="7" fill="#e2bd78"/>
  <rect x="734" y="212" width="220" height="7" rx="3.5" fill="#efede7" fill-opacity="0.35"/>
  <rect x="734" y="226" width="170" height="7" rx="3.5" fill="#efede7" fill-opacity="0.35"/>
  <rect x="944" y="220" width="78" height="26" rx="13" fill="#e2bd78"/>
  <rect x="960" y="230" width="46" height="6" rx="3" fill="#241906"/>

  <g fill="#1d2421" stroke="rgba(255,255,255,0.06)">
    <rect x="712" y="276" width="124" height="80" rx="10"/>
    <rect x="848" y="276" width="124" height="80" rx="10"/>
    <rect x="984" y="276" width="124" height="80" rx="10"/>
  </g>
  <g fill="#efede7" fill-opacity="0.22">
    <rect x="726" y="292" width="60" height="8" rx="4"/>
    <rect x="862" y="292" width="72" height="8" rx="4"/>
    <rect x="998" y="292" width="54" height="8" rx="4"/>
    <rect x="726" y="310" width="94" height="6" rx="3"/>
    <rect x="862" y="310" width="90" height="6" rx="3"/>
    <rect x="998" y="310" width="96" height="6" rx="3"/>
    <rect x="726" y="322" width="70" height="6" rx="3"/>
    <rect x="862" y="322" width="64" height="6" rx="3"/>
    <rect x="998" y="322" width="76" height="6" rx="3"/>
  </g>

  <g filter="url(#shadow)">
    <rect x="1052" y="196" width="112" height="212" rx="20" fill="#0b0e0d" stroke="rgba(255,255,255,0.18)"/>
  </g>
  <rect x="1060" y="206" width="96" height="192" rx="14" fill="#151a18"/>
  <rect x="1092" y="212" width="32" height="6" rx="3" fill="#0b0e0d"/>
  <rect x="1068" y="228" width="80" height="62" rx="9" fill="url(#hero)"/>
  <rect x="1076" y="246" width="50" height="7" rx="3.5" fill="#efede7" fill-opacity="0.9"/>
  <rect x="1076" y="260" width="36" height="7" rx="3.5" fill="#e2bd78"/>
  <g fill="#1d2421">
    <rect x="1068" y="300" width="80" height="34" rx="8"/>
    <rect x="1068" y="342" width="80" height="34" rx="8"/>
  </g>
  <rect x="1076" y="312" width="44" height="6" rx="3" fill="#efede7" fill-opacity="0.22"/>
  <rect x="1076" y="354" width="52" height="6" rx="3" fill="#efede7" fill-opacity="0.22"/>
  <rect x="1088" y="384" width="40" height="8" rx="4" fill="#e2bd78"/>
</svg>
`;
}

const steps = [
  ['Tell us', ['A short form about your', 'business. Two minutes.']],
  ['See a demo', ['A first version of your', 'site, built to be seen.']],
  ['Go live', ['Polished with you, then', 'published on your domain.']],
  ['We keep it running', ['Hosting, updates and', 'small changes, for you.']],
];

function processSvg(theme) {
  const dark = theme === 'dark';
  const text = dark ? '#efede7' : '#0d1110';
  const muted = dark ? '#a2aba7' : '#5a625e';
  const line = dark ? 'rgba(255,255,255,0.16)' : 'rgba(13,17,16,0.16)';
  const gold = dark ? '#e2bd78' : '#c99a45';
  const disc = dark ? '#151a18' : '#ffffff';
  const col = 300;
  const items = steps
    .map(([title, lines], i) => {
      const cx = 40 + i * col;
      return `
  <circle cx="${cx}" cy="40" r="22" fill="${disc}" stroke="${gold}" stroke-width="1.5"/>
  <text x="${cx}" y="46.5" text-anchor="middle" font-family="${SERIF}" font-style="italic" font-size="20" fill="${gold}">${i + 1}</text>
  <text x="${cx - 22}" y="104" font-family="${SANS}" font-size="25" font-weight="600" letter-spacing="-0.3" fill="${text}">${title}</text>
  <text font-family="${SANS}" font-size="18" fill="${muted}">
    <tspan x="${cx - 22}" y="138">${lines[0]}</tspan>
    <tspan x="${cx - 22}" y="164">${lines[1]}</tspan>
  </text>`;
    })
    .join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 184" width="1200" height="184" role="img" aria-label="How we work: 1 Tell us, 2 See a demo, 3 Go live, 4 We keep it running.">
  <line x1="62" y1="40" x2="${40 + 3 * col - 22}" y2="40" stroke="${line}" stroke-width="1.5" stroke-dasharray="3 6"/>${items}
</svg>
`;
}

for (const theme of ['light', 'dark']) {
  writeFileSync(join(out, `banner-${theme}.svg`), banner(theme));
  writeFileSync(join(out, `process-${theme}.svg`), processSvg(theme));
}
console.log('written to', out);
