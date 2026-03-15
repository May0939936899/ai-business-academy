// Certificate Themes for AI Business Academy
// SPU BUS - School of Business Administration, Sripatum University
// Production-grade Coursera/Harvard-style certificate system

export type BorderStyle = 'double' | 'solid' | 'ornate'

export interface CertificateTheme {
  id: string
  name: string
  nameEn: string
  primaryColor: string
  secondaryColor: string
  accentColor: string
  borderColor: string
  textColor: string
  headerColor: string
  bgGradient: string
  borderStyle: BorderStyle
  patternSvg: string // data URI for subtle background pattern
  isDark?: boolean   // true = dark neon theme
  neonGlow?: string  // neon glow hex color (e.g. '#38BDF8')
  mood?: string      // short mood/style label
}

// ─── SVG Pattern Generators ──────────────────────────────────────────────────
// Each returns an inline SVG data URI with ultra-low opacity for corner placement

function svgToDataUri(svg: string): string {
  return `data:image/svg+xml,${encodeURIComponent(svg.replace(/\n\s*/g, ''))}`
}

// ── CLASSIC LIGHT THEME PATTERNS ──────────────────────────────────────────────

// 1. Neural Network — interconnected circles with thin connecting lines
const neuralNetworkSvg = svgToDataUri(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
    <g stroke="#0F2440" stroke-width="0.5" fill="none" opacity="0.05">
      <circle cx="20" cy="20" r="3"/>
      <circle cx="50" cy="10" r="2.5"/>
      <circle cx="80" cy="25" r="3"/>
      <circle cx="10" cy="50" r="2.5"/>
      <circle cx="40" cy="45" r="3.5"/>
      <circle cx="70" cy="50" r="2.5"/>
      <circle cx="90" cy="55" r="2"/>
      <circle cx="25" cy="75" r="3"/>
      <circle cx="55" cy="80" r="2.5"/>
      <circle cx="80" cy="78" r="3"/>
      <line x1="20" y1="20" x2="50" y2="10"/>
      <line x1="50" y1="10" x2="80" y2="25"/>
      <line x1="20" y1="20" x2="40" y2="45"/>
      <line x1="50" y1="10" x2="40" y2="45"/>
      <line x1="80" y1="25" x2="70" y2="50"/>
      <line x1="10" y1="50" x2="40" y2="45"/>
      <line x1="40" y1="45" x2="70" y2="50"/>
      <line x1="70" y1="50" x2="90" y2="55"/>
      <line x1="10" y1="50" x2="25" y2="75"/>
      <line x1="40" y1="45" x2="55" y2="80"/>
      <line x1="70" y1="50" x2="80" y2="78"/>
      <line x1="25" y1="75" x2="55" y2="80"/>
      <line x1="55" y1="80" x2="80" y2="78"/>
    </g>
  </svg>
`)

// 2. Data Grid — small dots connected by horizontal/vertical lines
const dataGridSvg = svgToDataUri(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
    <g stroke="#1A3A6B" stroke-width="0.4" fill="#1A3A6B" opacity="0.04">
      <circle cx="10" cy="10" r="1.5"/>
      <circle cx="30" cy="10" r="1.5"/>
      <circle cx="50" cy="10" r="1.5"/>
      <circle cx="70" cy="10" r="1.5"/>
      <circle cx="90" cy="10" r="1.5"/>
      <circle cx="10" cy="30" r="1.5"/>
      <circle cx="30" cy="30" r="1.5"/>
      <circle cx="50" cy="30" r="1.5"/>
      <circle cx="70" cy="30" r="1.5"/>
      <circle cx="90" cy="30" r="1.5"/>
      <circle cx="10" cy="50" r="1.5"/>
      <circle cx="30" cy="50" r="1.5"/>
      <circle cx="50" cy="50" r="1.5"/>
      <circle cx="70" cy="50" r="1.5"/>
      <circle cx="90" cy="50" r="1.5"/>
      <circle cx="10" cy="70" r="1.5"/>
      <circle cx="30" cy="70" r="1.5"/>
      <circle cx="50" cy="70" r="1.5"/>
      <circle cx="70" cy="70" r="1.5"/>
      <circle cx="90" cy="70" r="1.5"/>
      <circle cx="10" cy="90" r="1.5"/>
      <circle cx="30" cy="90" r="1.5"/>
      <circle cx="50" cy="90" r="1.5"/>
      <circle cx="70" cy="90" r="1.5"/>
      <circle cx="90" cy="90" r="1.5"/>
      <line x1="10" y1="10" x2="90" y2="10" fill="none"/>
      <line x1="10" y1="30" x2="90" y2="30" fill="none"/>
      <line x1="10" y1="50" x2="90" y2="50" fill="none"/>
      <line x1="10" y1="70" x2="90" y2="70" fill="none"/>
      <line x1="10" y1="90" x2="90" y2="90" fill="none"/>
      <line x1="10" y1="10" x2="10" y2="90" fill="none"/>
      <line x1="30" y1="10" x2="30" y2="90" fill="none"/>
      <line x1="50" y1="10" x2="50" y2="90" fill="none"/>
      <line x1="70" y1="10" x2="70" y2="90" fill="none"/>
      <line x1="90" y1="10" x2="90" y2="90" fill="none"/>
    </g>
  </svg>
`)

// 3. Geometric Business — diagonal lines forming diamond shapes
const geometricDiamondSvg = svgToDataUri(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
    <g stroke="#8B6914" stroke-width="0.5" fill="none" opacity="0.04">
      <path d="M50 5 L95 50 L50 95 L5 50 Z"/>
      <path d="M50 20 L80 50 L50 80 L20 50 Z"/>
      <path d="M50 35 L65 50 L50 65 L35 50 Z"/>
      <line x1="5" y1="50" x2="95" y2="50"/>
      <line x1="50" y1="5" x2="50" y2="95"/>
      <line x1="5" y1="5" x2="95" y2="95"/>
      <line x1="95" y1="5" x2="5" y2="95"/>
    </g>
  </svg>
`)

// 4. Soft Abstract Lines — very faint curved flowing lines
const softLinesSvg = svgToDataUri(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
    <g stroke="#999999" stroke-width="0.6" fill="none" opacity="0.035">
      <path d="M0 30 Q25 10 50 30 Q75 50 100 30"/>
      <path d="M0 50 Q25 30 50 50 Q75 70 100 50"/>
      <path d="M0 70 Q25 50 50 70 Q75 90 100 70"/>
      <path d="M0 20 Q30 40 60 20 Q90 0 100 20"/>
      <path d="M0 80 Q30 60 60 80 Q90 100 100 80"/>
    </g>
  </svg>
`)

// 5. Laurel Wreath — university seal style circular pattern
const laurelWreathSvg = svgToDataUri(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
    <g stroke="#7C1D1D" stroke-width="0.5" fill="none" opacity="0.04">
      <circle cx="50" cy="50" r="40"/>
      <circle cx="50" cy="50" r="35"/>
      <circle cx="50" cy="50" r="10"/>
      <path d="M15 50 Q20 35 30 30"/>
      <path d="M15 50 Q20 65 30 70"/>
      <path d="M85 50 Q80 35 70 30"/>
      <path d="M85 50 Q80 65 70 70"/>
      <path d="M30 30 Q40 20 50 15"/>
      <path d="M70 30 Q60 20 50 15"/>
      <path d="M30 70 Q40 80 50 85"/>
      <path d="M70 70 Q60 80 50 85"/>
      <path d="M25 40 Q30 30 40 25"/>
      <path d="M75 40 Q70 30 60 25"/>
      <path d="M25 60 Q30 70 40 75"/>
      <path d="M75 60 Q70 70 60 75"/>
    </g>
  </svg>
`)

// 6. Circuit Board — straight lines at right angles with small circles
const circuitBoardSvg = svgToDataUri(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
    <g stroke="#0E7490" stroke-width="0.5" fill="none" opacity="0.045">
      <circle cx="15" cy="15" r="2" fill="#0E7490"/>
      <circle cx="50" cy="15" r="2" fill="#0E7490"/>
      <circle cx="85" cy="15" r="2" fill="#0E7490"/>
      <circle cx="15" cy="50" r="2" fill="#0E7490"/>
      <circle cx="50" cy="50" r="2.5" fill="#0E7490"/>
      <circle cx="85" cy="50" r="2" fill="#0E7490"/>
      <circle cx="15" cy="85" r="2" fill="#0E7490"/>
      <circle cx="50" cy="85" r="2" fill="#0E7490"/>
      <circle cx="85" cy="85" r="2" fill="#0E7490"/>
      <line x1="15" y1="15" x2="50" y2="15"/>
      <line x1="50" y1="15" x2="50" y2="50"/>
      <line x1="50" y1="50" x2="85" y2="50"/>
      <line x1="85" y1="15" x2="85" y2="50"/>
      <line x1="15" y1="15" x2="15" y2="50"/>
      <line x1="15" y1="50" x2="50" y2="50"/>
      <line x1="50" y1="50" x2="50" y2="85"/>
      <line x1="15" y1="85" x2="50" y2="85"/>
      <line x1="50" y1="85" x2="85" y2="85"/>
      <line x1="85" y1="50" x2="85" y2="85"/>
      <line x1="15" y1="50" x2="15" y2="85"/>
      <path d="M30 15 L30 30 L50 30"/>
      <path d="M70 50 L70 70 L85 70"/>
      <circle cx="30" cy="30" r="1.5" fill="#0E7490"/>
      <circle cx="70" cy="70" r="1.5" fill="#0E7490"/>
    </g>
  </svg>
`)

// 7. Business Flow — rounded rectangles connected by arrows (flowchart)
const businessFlowSvg = svgToDataUri(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
    <g stroke="#2D3748" stroke-width="0.5" fill="none" opacity="0.04">
      <rect x="5" y="10" width="25" height="14" rx="4"/>
      <rect x="38" y="10" width="25" height="14" rx="4"/>
      <rect x="70" y="10" width="25" height="14" rx="4"/>
      <rect x="5" y="43" width="25" height="14" rx="4"/>
      <rect x="38" y="43" width="25" height="14" rx="4"/>
      <rect x="70" y="43" width="25" height="14" rx="4"/>
      <rect x="5" y="76" width="25" height="14" rx="4"/>
      <rect x="38" y="76" width="25" height="14" rx="4"/>
      <rect x="70" y="76" width="25" height="14" rx="4"/>
      <line x1="30" y1="17" x2="38" y2="17"/>
      <line x1="63" y1="17" x2="70" y2="17"/>
      <line x1="30" y1="50" x2="38" y2="50"/>
      <line x1="63" y1="50" x2="70" y2="50"/>
      <line x1="30" y1="83" x2="38" y2="83"/>
      <line x1="63" y1="83" x2="70" y2="83"/>
      <line x1="17" y1="24" x2="17" y2="43"/>
      <line x1="50" y1="24" x2="50" y2="43"/>
      <line x1="82" y1="24" x2="82" y2="43"/>
      <line x1="17" y1="57" x2="17" y2="76"/>
      <line x1="50" y1="57" x2="50" y2="76"/>
      <line x1="82" y1="57" x2="82" y2="76"/>
      <polygon points="35,15 38,17 35,19" fill="#2D3748"/>
      <polygon points="67,15 70,17 67,19" fill="#2D3748"/>
      <polygon points="35,48 38,50 35,52" fill="#2D3748"/>
      <polygon points="67,48 70,50 67,52" fill="#2D3748"/>
    </g>
  </svg>
`)

// ── NEON DARK THEME PATTERNS ──────────────────────────────────────────────────

// N1. Neon AI Circuit — horizontal/vertical circuit lines with glowing nodes
const neonCircuitSvg = (color: string) => svgToDataUri(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
    <g stroke="${color}" stroke-width="0.6" fill="none" opacity="0.08">
      <circle cx="10" cy="20" r="2" fill="${color}"/>
      <circle cx="40" cy="20" r="1.5" fill="${color}"/>
      <circle cx="70" cy="20" r="2" fill="${color}"/>
      <circle cx="90" cy="20" r="1.5" fill="${color}"/>
      <circle cx="25" cy="50" r="2.5" fill="${color}"/>
      <circle cx="60" cy="50" r="2" fill="${color}"/>
      <circle cx="85" cy="50" r="1.5" fill="${color}"/>
      <circle cx="15" cy="80" r="2" fill="${color}"/>
      <circle cx="50" cy="80" r="2" fill="${color}"/>
      <circle cx="80" cy="80" r="1.5" fill="${color}"/>
      <line x1="10" y1="20" x2="40" y2="20"/>
      <line x1="40" y1="20" x2="40" y2="50"/>
      <line x1="40" y1="50" x2="25" y2="50"/>
      <line x1="70" y1="20" x2="70" y2="50"/>
      <line x1="70" y1="50" x2="60" y2="50"/>
      <line x1="60" y1="50" x2="60" y2="80"/>
      <line x1="60" y1="80" x2="50" y2="80"/>
      <line x1="85" y1="50" x2="85" y2="80"/>
      <line x1="85" y1="80" x2="80" y2="80"/>
      <line x1="25" y1="50" x2="15" y2="50"/>
      <line x1="15" y1="50" x2="15" y2="80"/>
      <line x1="90" y1="20" x2="90" y2="50"/>
      <line x1="90" y1="50" x2="85" y2="50"/>
    </g>
  </svg>
`)

// N2. Cyber Neural — interconnected nodes layered network
const neonNeuralSvg = (color: string) => svgToDataUri(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
    <g stroke="${color}" stroke-width="0.5" fill="none" opacity="0.09">
      <circle cx="15" cy="25" r="2.5" fill="${color}"/>
      <circle cx="50" cy="15" r="2" fill="${color}"/>
      <circle cx="85" cy="25" r="2.5" fill="${color}"/>
      <circle cx="10" cy="55" r="2" fill="${color}"/>
      <circle cx="35" cy="50" r="3" fill="${color}"/>
      <circle cx="65" cy="50" r="2.5" fill="${color}"/>
      <circle cx="90" cy="55" r="2" fill="${color}"/>
      <circle cx="20" cy="80" r="2.5" fill="${color}"/>
      <circle cx="50" cy="85" r="2" fill="${color}"/>
      <circle cx="80" cy="80" r="2.5" fill="${color}"/>
      <line x1="15" y1="25" x2="50" y2="15"/>
      <line x1="50" y1="15" x2="85" y2="25"/>
      <line x1="15" y1="25" x2="35" y2="50"/>
      <line x1="50" y1="15" x2="35" y2="50"/>
      <line x1="85" y1="25" x2="65" y2="50"/>
      <line x1="10" y1="55" x2="35" y2="50"/>
      <line x1="35" y1="50" x2="65" y2="50"/>
      <line x1="65" y1="50" x2="90" y2="55"/>
      <line x1="10" y1="55" x2="20" y2="80"/>
      <line x1="35" y1="50" x2="50" y2="85"/>
      <line x1="65" y1="50" x2="80" y2="80"/>
      <line x1="20" y1="80" x2="50" y2="85"/>
      <line x1="50" y1="85" x2="80" y2="80"/>
    </g>
  </svg>
`)

// N3. Hex Mesh — hexagonal grid pattern
const neonHexSvg = (color: string) => svgToDataUri(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
    <g stroke="${color}" stroke-width="0.5" fill="none" opacity="0.08">
      <polygon points="25,5 35,5 40,14 35,23 25,23 20,14"/>
      <polygon points="50,5 60,5 65,14 60,23 50,23 45,14"/>
      <polygon points="75,5 85,5 90,14 85,23 75,23 70,14"/>
      <polygon points="12,24 22,24 27,33 22,42 12,42 7,33"/>
      <polygon points="37,24 47,24 52,33 47,42 37,42 32,33"/>
      <polygon points="62,24 72,24 77,33 72,42 62,42 57,33"/>
      <polygon points="87,24 97,24 102,33 97,42 87,42 82,33"/>
      <polygon points="25,43 35,43 40,52 35,61 25,61 20,52"/>
      <polygon points="50,43 60,43 65,52 60,61 50,61 45,52"/>
      <polygon points="75,43 85,43 90,52 85,61 75,61 70,52"/>
      <polygon points="12,62 22,62 27,71 22,80 12,80 7,71"/>
      <polygon points="37,62 47,62 52,71 47,80 37,80 32,71"/>
      <polygon points="62,62 72,62 77,71 72,80 62,80 57,71"/>
    </g>
  </svg>
`)

// N4. Minimal AI Nodes — sparse dots with subtle connections
const neonSparseNodesSvg = (color: string) => svgToDataUri(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
    <g stroke="${color}" stroke-width="0.4" fill="${color}" opacity="0.07">
      <circle cx="20" cy="20" r="2"/>
      <circle cx="80" cy="15" r="1.5"/>
      <circle cx="50" cy="40" r="2.5"/>
      <circle cx="10" cy="65" r="2"/>
      <circle cx="90" cy="60" r="1.5"/>
      <circle cx="35" cy="80" r="2"/>
      <circle cx="70" cy="85" r="1.5"/>
      <circle cx="60" cy="25" r="1.5" fill="none"/>
      <circle cx="30" cy="55" r="1.5" fill="none"/>
      <line x1="20" y1="20" x2="50" y2="40" stroke="${color}" fill="none"/>
      <line x1="80" y1="15" x2="50" y2="40" stroke="${color}" fill="none"/>
      <line x1="50" y1="40" x2="30" y2="55" stroke="${color}" fill="none"/>
      <line x1="50" y1="40" x2="90" y2="60" stroke="${color}" fill="none"/>
      <line x1="30" y1="55" x2="10" y2="65" stroke="${color}" fill="none"/>
      <line x1="30" y1="55" x2="35" y2="80" stroke="${color}" fill="none"/>
      <line x1="90" y1="60" x2="70" y2="85" stroke="${color}" fill="none"/>
    </g>
  </svg>
`)

// N5. Data Flow Lines — diagonal streaming lines
const neonFlowLinesSvg = (color: string) => svgToDataUri(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
    <g stroke="${color}" stroke-width="0.5" fill="none" opacity="0.08">
      <line x1="0" y1="15" x2="100" y2="5"/>
      <line x1="0" y1="30" x2="100" y2="20"/>
      <line x1="0" y1="50" x2="100" y2="40"/>
      <line x1="0" y1="70" x2="100" y2="60"/>
      <line x1="0" y1="85" x2="100" y2="75"/>
      <line x1="0" y1="100" x2="100" y2="90"/>
      <circle cx="25" cy="27" r="1.5" fill="${color}"/>
      <circle cx="55" cy="44" r="1.5" fill="${color}"/>
      <circle cx="75" cy="22" r="1" fill="${color}"/>
      <circle cx="40" cy="65" r="1.5" fill="${color}"/>
      <circle cx="80" cy="62" r="1" fill="${color}"/>
      <circle cx="15" cy="83" r="1.5" fill="${color}"/>
    </g>
  </svg>
`)

// N6. Radial Network — spokes radiating from center
const neonRadialSvg = (color: string) => svgToDataUri(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
    <g stroke="${color}" stroke-width="0.5" fill="none" opacity="0.07">
      <circle cx="50" cy="50" r="40" stroke-dasharray="2 4"/>
      <circle cx="50" cy="50" r="28" stroke-dasharray="1.5 3"/>
      <circle cx="50" cy="50" r="15"/>
      <circle cx="50" cy="50" r="4" fill="${color}"/>
      <line x1="50" y1="10" x2="50" y2="50"/>
      <line x1="78" y1="22" x2="50" y2="50"/>
      <line x1="90" y1="50" x2="50" y2="50"/>
      <line x1="78" y1="78" x2="50" y2="50"/>
      <line x1="50" y1="90" x2="50" y2="50"/>
      <line x1="22" y1="78" x2="50" y2="50"/>
      <line x1="10" y1="50" x2="50" y2="50"/>
      <line x1="22" y1="22" x2="50" y2="50"/>
      <circle cx="50" cy="10" r="2" fill="${color}"/>
      <circle cx="78" cy="22" r="2" fill="${color}"/>
      <circle cx="90" cy="50" r="2" fill="${color}"/>
      <circle cx="78" cy="78" r="2" fill="${color}"/>
      <circle cx="50" cy="90" r="2" fill="${color}"/>
      <circle cx="22" cy="78" r="2" fill="${color}"/>
      <circle cx="10" cy="50" r="2" fill="${color}"/>
      <circle cx="22" cy="22" r="2" fill="${color}"/>
    </g>
  </svg>
`)

// N7. Layered Neural — deep learning layers visualization
const neonLayeredNeuralSvg = (color: string) => svgToDataUri(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
    <g stroke="${color}" stroke-width="0.4" fill="${color}" opacity="0.08">
      <circle cx="10" cy="20" r="2"/>
      <circle cx="10" cy="40" r="2"/>
      <circle cx="10" cy="60" r="2"/>
      <circle cx="10" cy="80" r="2"/>
      <circle cx="35" cy="15" r="2.5"/>
      <circle cx="35" cy="35" r="2.5"/>
      <circle cx="35" cy="55" r="2.5"/>
      <circle cx="35" cy="75" r="2.5"/>
      <circle cx="60" cy="25" r="2"/>
      <circle cx="60" cy="50" r="2.5"/>
      <circle cx="60" cy="75" r="2"/>
      <circle cx="85" cy="35" r="2"/>
      <circle cx="85" cy="65" r="2"/>
      <line x1="10" y1="20" x2="35" y2="15" stroke="${color}" fill="none"/>
      <line x1="10" y1="20" x2="35" y2="35" stroke="${color}" fill="none"/>
      <line x1="10" y1="40" x2="35" y2="35" stroke="${color}" fill="none"/>
      <line x1="10" y1="40" x2="35" y2="55" stroke="${color}" fill="none"/>
      <line x1="10" y1="60" x2="35" y2="55" stroke="${color}" fill="none"/>
      <line x1="10" y1="60" x2="35" y2="75" stroke="${color}" fill="none"/>
      <line x1="10" y1="80" x2="35" y2="75" stroke="${color}" fill="none"/>
      <line x1="35" y1="15" x2="60" y2="25" stroke="${color}" fill="none"/>
      <line x1="35" y1="35" x2="60" y2="25" stroke="${color}" fill="none"/>
      <line x1="35" y1="35" x2="60" y2="50" stroke="${color}" fill="none"/>
      <line x1="35" y1="55" x2="60" y2="50" stroke="${color}" fill="none"/>
      <line x1="35" y1="75" x2="60" y2="75" stroke="${color}" fill="none"/>
      <line x1="60" y1="25" x2="85" y2="35" stroke="${color}" fill="none"/>
      <line x1="60" y1="50" x2="85" y2="35" stroke="${color}" fill="none"/>
      <line x1="60" y1="50" x2="85" y2="65" stroke="${color}" fill="none"/>
      <line x1="60" y1="75" x2="85" y2="65" stroke="${color}" fill="none"/>
    </g>
  </svg>
`)

// N8. Tech Grid — fine uniform grid
const neonTechGridSvg = (color: string) => svgToDataUri(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
    <g stroke="${color}" stroke-width="0.4" fill="none" opacity="0.07">
      <line x1="0" y1="10" x2="100" y2="10"/>
      <line x1="0" y1="20" x2="100" y2="20"/>
      <line x1="0" y1="30" x2="100" y2="30"/>
      <line x1="0" y1="40" x2="100" y2="40"/>
      <line x1="0" y1="50" x2="100" y2="50"/>
      <line x1="0" y1="60" x2="100" y2="60"/>
      <line x1="0" y1="70" x2="100" y2="70"/>
      <line x1="0" y1="80" x2="100" y2="80"/>
      <line x1="0" y1="90" x2="100" y2="90"/>
      <line x1="10" y1="0" x2="10" y2="100"/>
      <line x1="20" y1="0" x2="20" y2="100"/>
      <line x1="30" y1="0" x2="30" y2="100"/>
      <line x1="40" y1="0" x2="40" y2="100"/>
      <line x1="50" y1="0" x2="50" y2="100"/>
      <line x1="60" y1="0" x2="60" y2="100"/>
      <line x1="70" y1="0" x2="70" y2="100"/>
      <line x1="80" y1="0" x2="80" y2="100"/>
      <line x1="90" y1="0" x2="90" y2="100"/>
      <circle cx="50" cy="50" r="3" fill="${color}"/>
      <circle cx="10" cy="10" r="1.5" fill="${color}"/>
      <circle cx="90" cy="10" r="1.5" fill="${color}"/>
      <circle cx="10" cy="90" r="1.5" fill="${color}"/>
      <circle cx="90" cy="90" r="1.5" fill="${color}"/>
    </g>
  </svg>
`)

// N9. Aurora Waves — undulating sine waves
const neonWavesSvg = (color: string) => svgToDataUri(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
    <g stroke="${color}" stroke-width="0.6" fill="none" opacity="0.08">
      <path d="M0 20 Q12 10 25 20 Q37 30 50 20 Q62 10 75 20 Q87 30 100 20"/>
      <path d="M0 35 Q12 25 25 35 Q37 45 50 35 Q62 25 75 35 Q87 45 100 35"/>
      <path d="M0 50 Q12 40 25 50 Q37 60 50 50 Q62 40 75 50 Q87 60 100 50"/>
      <path d="M0 65 Q12 55 25 65 Q37 75 50 65 Q62 55 75 65 Q87 75 100 65"/>
      <path d="M0 80 Q12 70 25 80 Q37 90 50 80 Q62 70 75 80 Q87 90 100 80"/>
      <circle cx="25" cy="20" r="1.5" fill="${color}"/>
      <circle cx="75" cy="20" r="1.5" fill="${color}"/>
      <circle cx="25" cy="50" r="1.5" fill="${color}"/>
      <circle cx="75" cy="50" r="1.5" fill="${color}"/>
      <circle cx="25" cy="80" r="1.5" fill="${color}"/>
      <circle cx="75" cy="80" r="1.5" fill="${color}"/>
    </g>
  </svg>
`)

// N10. Neon Geometry — angular executive geometric shapes
const neonGeometrySvg = (color: string) => svgToDataUri(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
    <g stroke="${color}" stroke-width="0.5" fill="none" opacity="0.08">
      <polygon points="50,5 95,30 95,70 50,95 5,70 5,30"/>
      <polygon points="50,18 82,35 82,65 50,82 18,65 18,35"/>
      <polygon points="50,32 68,42 68,58 50,68 32,58 32,42"/>
      <line x1="5" y1="30" x2="50" y2="5"/>
      <line x1="95" y1="30" x2="50" y2="5"/>
      <line x1="5" y1="70" x2="50" y2="95"/>
      <line x1="95" y1="70" x2="50" y2="95"/>
      <circle cx="50" cy="50" r="5" fill="${color}" opacity="0.3"/>
      <circle cx="50" cy="5" r="2" fill="${color}"/>
      <circle cx="95" cy="30" r="2" fill="${color}"/>
      <circle cx="95" cy="70" r="2" fill="${color}"/>
      <circle cx="50" cy="95" r="2" fill="${color}"/>
      <circle cx="5" cy="70" r="2" fill="${color}"/>
      <circle cx="5" cy="30" r="2" fill="${color}"/>
    </g>
  </svg>
`)

// N11. Matrix Dots — digital rain dot matrix
const neonMatrixSvg = (color: string) => svgToDataUri(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
    <g fill="${color}" opacity="0.09">
      <rect x="8" y="5" width="1.5" height="6" rx="1"/>
      <rect x="8" y="15" width="1.5" height="10" rx="1"/>
      <rect x="8" y="30" width="1.5" height="4" rx="1"/>
      <rect x="8" y="50" width="1.5" height="8" rx="1"/>
      <rect x="8" y="70" width="1.5" height="12" rx="1"/>
      <rect x="22" y="10" width="1.5" height="8" rx="1"/>
      <rect x="22" y="28" width="1.5" height="14" rx="1"/>
      <rect x="22" y="55" width="1.5" height="6" rx="1"/>
      <rect x="22" y="75" width="1.5" height="10" rx="1"/>
      <rect x="36" y="5" width="1.5" height="12" rx="1"/>
      <rect x="36" y="25" width="1.5" height="5" rx="1"/>
      <rect x="36" y="45" width="1.5" height="9" rx="1"/>
      <rect x="36" y="65" width="1.5" height="7" rx="1"/>
      <rect x="50" y="8" width="1.5" height="7" rx="1"/>
      <rect x="50" y="22" width="1.5" height="11" rx="1"/>
      <rect x="50" y="45" width="1.5" height="4" rx="1"/>
      <rect x="50" y="60" width="1.5" height="15" rx="1"/>
      <rect x="64" y="5" width="1.5" height="9" rx="1"/>
      <rect x="64" y="20" width="1.5" height="6" rx="1"/>
      <rect x="64" y="40" width="1.5" height="12" rx="1"/>
      <rect x="64" y="65" width="1.5" height="8" rx="1"/>
      <rect x="78" y="12" width="1.5" height="7" rx="1"/>
      <rect x="78" y="30" width="1.5" height="10" rx="1"/>
      <rect x="78" y="50" width="1.5" height="5" rx="1"/>
      <rect x="78" y="70" width="1.5" height="11" rx="1"/>
      <rect x="92" y="8" width="1.5" height="14" rx="1"/>
      <rect x="92" y="35" width="1.5" height="6" rx="1"/>
      <rect x="92" y="55" width="1.5" height="9" rx="1"/>
      <rect x="92" y="78" width="1.5" height="7" rx="1"/>
    </g>
  </svg>
`)

// N12. Strategy Grid — flowchart strategy pattern
const neonStrategyGridSvg = (color: string) => svgToDataUri(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
    <g stroke="${color}" stroke-width="0.5" fill="none" opacity="0.08">
      <rect x="5" y="8" width="20" height="12" rx="3"/>
      <rect x="35" y="8" width="20" height="12" rx="3"/>
      <rect x="65" y="8" width="20" height="12" rx="3"/>
      <rect x="20" y="38" width="20" height="12" rx="3"/>
      <rect x="50" y="38" width="20" height="12" rx="3"/>
      <rect x="80" y="38" width="15" height="12" rx="3"/>
      <rect x="10" y="68" width="22" height="12" rx="3"/>
      <rect x="40" y="68" width="22" height="12" rx="3"/>
      <rect x="70" y="68" width="22" height="12" rx="3"/>
      <line x1="25" y1="14" x2="35" y2="14"/>
      <line x1="55" y1="14" x2="65" y2="14"/>
      <line x1="15" y1="20" x2="30" y2="38"/>
      <line x1="45" y1="20" x2="30" y2="38"/>
      <line x1="45" y1="20" x2="60" y2="38"/>
      <line x1="75" y1="20" x2="60" y2="38"/>
      <line x1="75" y1="20" x2="87" y2="38"/>
      <line x1="30" y1="50" x2="21" y2="68"/>
      <line x1="60" y1="50" x2="51" y2="68"/>
      <line x1="60" y1="50" x2="81" y2="68"/>
      <line x1="87" y1="50" x2="81" y2="68"/>
      <circle cx="15" cy="14" r="1.5" fill="${color}"/>
      <circle cx="45" cy="14" r="1.5" fill="${color}"/>
      <circle cx="75" cy="14" r="1.5" fill="${color}"/>
    </g>
  </svg>
`)

// ─── Theme Definitions ───────────────────────────────────────────────────────

export const CERTIFICATE_THEMES: CertificateTheme[] = [
  // ── CLASSIC LIGHT THEMES ──────────────────────────────────────────────────

  // 1. Executive Navy — AI Neural Network pattern
  {
    id: 'executive-navy',
    name: 'สีกรมท่าผู้บริหาร',
    nameEn: 'Executive Navy',
    primaryColor: '#0F2440',
    secondaryColor: '#1A3A5C',
    accentColor: '#C8A951',
    borderColor: '#0F2440',
    textColor: '#1A2332',
    headerColor: '#0F2440',
    bgGradient: 'linear-gradient(180deg, #FFFFFF 0%, #F0F3F8 50%, #E8ECF2 100%)',
    borderStyle: 'double',
    patternSvg: neuralNetworkSvg,
    isDark: false,
    mood: 'Executive',
  },

  // 2. Royal Blue Data — Data Grid pattern
  {
    id: 'royal-blue-data',
    name: 'สีน้ำเงินหลวงข้อมูล',
    nameEn: 'Royal Blue Data',
    primaryColor: '#1A3A6B',
    secondaryColor: '#2A5298',
    accentColor: '#C9A84C',
    borderColor: '#1A3A6B',
    textColor: '#1E293B',
    headerColor: '#1A3A6B',
    bgGradient: 'linear-gradient(180deg, #FFFFFF 0%, #EEF2F7 50%, #E4EAF4 100%)',
    borderStyle: 'double',
    patternSvg: dataGridSvg,
    isDark: false,
    mood: 'Academic',
  },

  // 3. Elegant Gold — Geometric Business Lines
  {
    id: 'elegant-gold',
    name: 'สีทองหรูหรา',
    nameEn: 'Elegant Gold',
    primaryColor: '#8B6914',
    secondaryColor: '#A67C00',
    accentColor: '#2C1810',
    borderColor: '#C9A84C',
    textColor: '#2C1810',
    headerColor: '#6B4F1D',
    bgGradient: 'linear-gradient(180deg, #FFFDF5 0%, #FFF8E7 50%, #FDF0D5 100%)',
    borderStyle: 'ornate',
    patternSvg: geometricDiamondSvg,
    isDark: false,
    mood: 'Premium',
  },

  // 4. Minimal White — Soft abstract lines
  {
    id: 'minimal-white',
    name: 'ขาวมินิมอล',
    nameEn: 'Minimal White',
    primaryColor: '#374151',
    secondaryColor: '#6B7280',
    accentColor: '#9CA3AF',
    borderColor: '#D1D5DB',
    textColor: '#1F2937',
    headerColor: '#111827',
    bgGradient: 'linear-gradient(180deg, #FFFFFF 0%, #FAFAFA 50%, #F5F5F5 100%)',
    borderStyle: 'solid',
    patternSvg: softLinesSvg,
    isDark: false,
    mood: 'Minimal',
  },

  // 5. Academic Crimson — University seal watermark
  {
    id: 'academic-crimson',
    name: 'สีแดงอิฐวิชาการ',
    nameEn: 'Academic Crimson',
    primaryColor: '#7C1D1D',
    secondaryColor: '#991B1B',
    accentColor: '#92400E',
    borderColor: '#7C1D1D',
    textColor: '#1C1917',
    headerColor: '#7C1D1D',
    bgGradient: 'linear-gradient(180deg, #FFFFFF 0%, #FEF2F2 50%, #FCEAEA 100%)',
    borderStyle: 'double',
    patternSvg: laurelWreathSvg,
    isDark: false,
    mood: 'Classic',
  },

  // 6. AI Circuit — Circuit board lines
  {
    id: 'ai-circuit',
    name: 'วงจร AI',
    nameEn: 'AI Circuit',
    primaryColor: '#0E7490',
    secondaryColor: '#0891B2',
    accentColor: '#164E63',
    borderColor: '#0E7490',
    textColor: '#1E293B',
    headerColor: '#0E7490',
    bgGradient: 'linear-gradient(180deg, #FFFFFF 0%, #ECFEFF 50%, #E0F7FA 100%)',
    borderStyle: 'solid',
    patternSvg: circuitBoardSvg,
    isDark: false,
    mood: 'Technology',
  },

  // 7. Business Flow — Flow diagram nodes
  {
    id: 'business-flow',
    name: 'สายธุรกิจ',
    nameEn: 'Business Flow',
    primaryColor: '#2D3748',
    secondaryColor: '#4A5568',
    accentColor: '#718096',
    borderColor: '#2D3748',
    textColor: '#1A202C',
    headerColor: '#1A202C',
    bgGradient: 'linear-gradient(180deg, #FFFFFF 0%, #F7FAFC 50%, #EDF2F7 100%)',
    borderStyle: 'double',
    patternSvg: businessFlowSvg,
    isDark: false,
    mood: 'Professional',
  },

  // ── NEON DARK THEMES ─────────────────────────────────────────────────────

  // 8. Neon AI Blue — AI circuit lines
  {
    id: 'neon-ai-blue',
    name: 'นีออน AI สีฟ้า',
    nameEn: 'Neon AI Blue',
    primaryColor: '#BAE6FD',
    secondaryColor: '#38BDF8',
    accentColor: '#38BDF8',
    borderColor: '#1D4ED8',
    textColor: '#CBD5E1',
    headerColor: '#F0F9FF',
    bgGradient: 'linear-gradient(135deg, #0F172A 0%, #0F2040 40%, #1E3A8A 100%)',
    borderStyle: 'solid',
    patternSvg: neonCircuitSvg('#38BDF8'),
    isDark: true,
    neonGlow: '#38BDF8',
    mood: 'AI Technology',
  },

  // 9. Cyber Purple — neural network lines
  {
    id: 'cyber-purple',
    name: 'ไซเบอร์สีม่วง',
    nameEn: 'Cyber Purple',
    primaryColor: '#DDD6FE',
    secondaryColor: '#A78BFA',
    accentColor: '#A78BFA',
    borderColor: '#6D28D9',
    textColor: '#C4B5FD',
    headerColor: '#F5F3FF',
    bgGradient: 'linear-gradient(135deg, #1E1B4B 0%, #2D1F5E 40%, #4C1D95 100%)',
    borderStyle: 'solid',
    patternSvg: neonNeuralSvg('#A78BFA'),
    isDark: true,
    neonGlow: '#A78BFA',
    mood: 'AI Innovation',
  },

  // 10. Digital Teal — hex mesh
  {
    id: 'digital-teal',
    name: 'ดิจิทัลสีเขียวอมน้ำเงิน',
    nameEn: 'Digital Teal',
    primaryColor: '#99F6E4',
    secondaryColor: '#2DD4BF',
    accentColor: '#2DD4BF',
    borderColor: '#0D9488',
    textColor: '#CCFBF1',
    headerColor: '#F0FDFA',
    bgGradient: 'linear-gradient(135deg, #042F2E 0%, #0A3B39 40%, #134E4A 100%)',
    borderStyle: 'solid',
    patternSvg: neonHexSvg('#2DD4BF'),
    isDark: true,
    neonGlow: '#2DD4BF',
    mood: 'Digital Transform',
  },

  // 11. Midnight Neon — minimal AI nodes
  {
    id: 'midnight-neon',
    name: 'มิดไนต์นีออน',
    nameEn: 'Midnight Neon',
    primaryColor: '#C7D2FE',
    secondaryColor: '#6366F1',
    accentColor: '#6366F1',
    borderColor: '#3730A3',
    textColor: '#C7D2FE',
    headerColor: '#EEF2FF',
    bgGradient: 'linear-gradient(135deg, #020617 0%, #0D0D2B 40%, #1E1B4B 100%)',
    borderStyle: 'solid',
    patternSvg: neonSparseNodesSvg('#6366F1'),
    isDark: true,
    neonGlow: '#6366F1',
    mood: 'Tech Executive',
  },

  // 12. Neon Emerald — data flow lines
  {
    id: 'neon-emerald',
    name: 'นีออนสีมรกต',
    nameEn: 'Neon Emerald',
    primaryColor: '#A7F3D0',
    secondaryColor: '#34D399',
    accentColor: '#34D399',
    borderColor: '#059669',
    textColor: '#D1FAE5',
    headerColor: '#ECFDF5',
    bgGradient: 'linear-gradient(135deg, #022C22 0%, #064E3B 40%, #065F46 100%)',
    borderStyle: 'solid',
    patternSvg: neonFlowLinesSvg('#34D399'),
    isDark: true,
    neonGlow: '#34D399',
    mood: 'Growth & Innovation',
  },

  // 13. Neon Sapphire — network connection
  {
    id: 'neon-sapphire',
    name: 'นีออนสีแซฟไฟร์',
    nameEn: 'Neon Sapphire',
    primaryColor: '#BAE6FD',
    secondaryColor: '#38BDF8',
    accentColor: '#0EA5E9',
    borderColor: '#0369A1',
    textColor: '#E0F2FE',
    headerColor: '#F0F9FF',
    bgGradient: 'linear-gradient(135deg, #0C4A6E 0%, #0C3B5E 40%, #1E40AF 100%)',
    borderStyle: 'solid',
    patternSvg: neonRadialSvg('#38BDF8'),
    isDark: true,
    neonGlow: '#38BDF8',
    mood: 'Business Tech',
  },

  // 14. Quantum Pink — AI neural pattern
  {
    id: 'quantum-pink',
    name: 'ควอนตัมสีชมพู',
    nameEn: 'Quantum Pink',
    primaryColor: '#FBCFE8',
    secondaryColor: '#F472B6',
    accentColor: '#F472B6',
    borderColor: '#BE185D',
    textColor: '#FCE7F3',
    headerColor: '#FDF2F8',
    bgGradient: 'linear-gradient(135deg, #4C0519 0%, #7F1D4D 40%, #9D174D 100%)',
    borderStyle: 'solid',
    patternSvg: neonLayeredNeuralSvg('#F472B6'),
    isDark: true,
    neonGlow: '#F472B6',
    mood: 'Future Innovation',
  },

  // 15. Neon Indigo — tech grid
  {
    id: 'neon-indigo',
    name: 'นีออนสีคราม',
    nameEn: 'Neon Indigo',
    primaryColor: '#C7D2FE',
    secondaryColor: '#818CF8',
    accentColor: '#818CF8',
    borderColor: '#4338CA',
    textColor: '#E0E7FF',
    headerColor: '#EEF2FF',
    bgGradient: 'linear-gradient(135deg, #1E1B4B 0%, #2D2B6E 40%, #3730A3 100%)',
    borderStyle: 'solid',
    patternSvg: neonTechGridSvg('#818CF8'),
    isDark: true,
    neonGlow: '#818CF8',
    mood: 'Modern Certificate',
  },

  // 16. Aurora AI — light data waves
  {
    id: 'aurora-ai',
    name: 'ออโรร่า AI',
    nameEn: 'Aurora AI',
    primaryColor: '#A5F3FC',
    secondaryColor: '#22D3EE',
    accentColor: '#22D3EE',
    borderColor: '#0E7490',
    textColor: '#CFFAFE',
    headerColor: '#ECFEFF',
    bgGradient: 'linear-gradient(135deg, #020617 0%, #0A1628 40%, #083344 100%)',
    borderStyle: 'solid',
    patternSvg: neonWavesSvg('#22D3EE'),
    isDark: true,
    neonGlow: '#22D3EE',
    mood: 'Futuristic Learning',
  },

  // 17. Neon Gold Tech — executive geometry
  {
    id: 'neon-gold-tech',
    name: 'นีออนทองเทคโนโลยี',
    nameEn: 'Neon Gold Tech',
    primaryColor: '#FDE68A',
    secondaryColor: '#FBBF24',
    accentColor: '#FBBF24',
    borderColor: '#B45309',
    textColor: '#FEF3C7',
    headerColor: '#FFFBEB',
    bgGradient: 'linear-gradient(135deg, #3F2A00 0%, #5C3D00 40%, #78350F 100%)',
    borderStyle: 'ornate',
    patternSvg: neonGeometrySvg('#FBBF24'),
    isDark: true,
    neonGlow: '#FBBF24',
    mood: 'Premium Certificate',
  },

  // 18. Matrix Green — digital matrix
  {
    id: 'matrix-green',
    name: 'เมทริกซ์สีเขียว',
    nameEn: 'Matrix Green',
    primaryColor: '#A7F3D0',
    secondaryColor: '#10B981',
    accentColor: '#10B981',
    borderColor: '#065F46',
    textColor: '#D1FAE5',
    headerColor: '#ECFDF5',
    bgGradient: 'linear-gradient(135deg, #021E0F 0%, #042B16 40%, #064E3B 100%)',
    borderStyle: 'solid',
    patternSvg: neonMatrixSvg('#10B981'),
    isDark: true,
    neonGlow: '#10B981',
    mood: 'AI System',
  },

  // 19. Neon Business Blue — strategy grid
  {
    id: 'neon-business-blue',
    name: 'นีออนสีฟ้าธุรกิจ',
    nameEn: 'Neon Business Blue',
    primaryColor: '#BFDBFE',
    secondaryColor: '#60A5FA',
    accentColor: '#60A5FA',
    borderColor: '#1D4ED8',
    textColor: '#DBEAFE',
    headerColor: '#EFF6FF',
    bgGradient: 'linear-gradient(135deg, #0B1120 0%, #101C3A 40%, #1E3A8A 100%)',
    borderStyle: 'solid',
    patternSvg: neonStrategyGridSvg('#60A5FA'),
    isDark: true,
    neonGlow: '#60A5FA',
    mood: 'Business Executive',
  },
]

export const DEFAULT_THEME_ID = 'neon-ai-blue'

export function getCertificateTheme(themeId: string): CertificateTheme {
  const theme = CERTIFICATE_THEMES.find((t) => t.id === themeId)
  if (theme) return theme

  const defaultTheme = CERTIFICATE_THEMES.find((t) => t.id === DEFAULT_THEME_ID)
  return defaultTheme!
}
