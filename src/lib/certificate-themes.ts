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
}

// ─── SVG Pattern Generators ──────────────────────────────────────────────────
// Each returns an inline SVG data URI with ultra-low opacity for corner placement

function svgToDataUri(svg: string): string {
  return `data:image/svg+xml,${encodeURIComponent(svg.replace(/\n\s*/g, ''))}`
}

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

// ─── Theme Definitions ───────────────────────────────────────────────────────

export const CERTIFICATE_THEMES: CertificateTheme[] = [
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
  },
]

export const DEFAULT_THEME_ID = 'executive-navy'

export function getCertificateTheme(themeId: string): CertificateTheme {
  const theme = CERTIFICATE_THEMES.find((t) => t.id === themeId)
  if (theme) return theme

  const defaultTheme = CERTIFICATE_THEMES.find((t) => t.id === DEFAULT_THEME_ID)
  return defaultTheme!
}
