// Certificate Themes for AI SPUBUS Academy
// SPU BUS - School of Business Administration, Sripatum University
// 6 Professional Blue-Toned Themes

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
  patternSvg: string
  isDark?: boolean
  neonGlow?: string
  mood?: string
}

// ─── SVG Pattern Generators ──────────────────────────────────────────────────

function svgToDataUri(svg: string): string {
  return `data:image/svg+xml,${encodeURIComponent(svg.replace(/\n\s*/g, ''))}`
}

// P1. Neural Network — AI nodes with connections
const neuralNetworkSvg = svgToDataUri(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
    <g stroke="#1565C0" stroke-width="0.5" fill="none" opacity="0.05">
      <circle cx="20" cy="20" r="3"/><circle cx="50" cy="10" r="2.5"/><circle cx="80" cy="25" r="3"/>
      <circle cx="10" cy="50" r="2.5"/><circle cx="40" cy="45" r="3.5"/><circle cx="70" cy="50" r="2.5"/>
      <circle cx="25" cy="75" r="3"/><circle cx="55" cy="80" r="2.5"/><circle cx="80" cy="78" r="3"/>
      <line x1="20" y1="20" x2="50" y2="10"/><line x1="50" y1="10" x2="80" y2="25"/>
      <line x1="20" y1="20" x2="40" y2="45"/><line x1="80" y1="25" x2="70" y2="50"/>
      <line x1="10" y1="50" x2="40" y2="45"/><line x1="40" y1="45" x2="70" y2="50"/>
      <line x1="25" y1="75" x2="55" y2="80"/><line x1="55" y1="80" x2="80" y2="78"/>
    </g>
  </svg>
`)

// P2. Data Grid — structured grid pattern
const dataGridSvg = svgToDataUri(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
    <g stroke="#1976D2" stroke-width="0.4" fill="#1976D2" opacity="0.04">
      <circle cx="10" cy="10" r="1.5"/><circle cx="30" cy="10" r="1.5"/><circle cx="50" cy="10" r="1.5"/>
      <circle cx="70" cy="10" r="1.5"/><circle cx="90" cy="10" r="1.5"/>
      <circle cx="10" cy="30" r="1.5"/><circle cx="30" cy="30" r="1.5"/><circle cx="50" cy="30" r="1.5"/>
      <circle cx="70" cy="30" r="1.5"/><circle cx="90" cy="30" r="1.5"/>
      <circle cx="10" cy="50" r="1.5"/><circle cx="50" cy="50" r="1.5"/><circle cx="90" cy="50" r="1.5"/>
      <line x1="10" y1="10" x2="90" y2="10" fill="none"/><line x1="10" y1="30" x2="90" y2="30" fill="none"/>
      <line x1="10" y1="50" x2="90" y2="50" fill="none"/>
      <line x1="10" y1="10" x2="10" y2="50" fill="none"/><line x1="50" y1="10" x2="50" y2="50" fill="none"/>
      <line x1="90" y1="10" x2="90" y2="50" fill="none"/>
    </g>
  </svg>
`)

// P3. Circuit Board — tech lines
const circuitSvg = svgToDataUri(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
    <g stroke="#0277BD" stroke-width="0.5" fill="none" opacity="0.045">
      <circle cx="15" cy="15" r="2" fill="#0277BD"/><circle cx="50" cy="15" r="2" fill="#0277BD"/>
      <circle cx="85" cy="15" r="2" fill="#0277BD"/><circle cx="50" cy="50" r="2.5" fill="#0277BD"/>
      <circle cx="15" cy="85" r="2" fill="#0277BD"/><circle cx="85" cy="85" r="2" fill="#0277BD"/>
      <line x1="15" y1="15" x2="50" y2="15"/><line x1="50" y1="15" x2="50" y2="50"/>
      <line x1="50" y1="50" x2="85" y2="50"/><line x1="85" y1="15" x2="85" y2="50"/>
      <line x1="15" y1="15" x2="15" y2="50"/><line x1="15" y1="50" x2="50" y2="50"/>
      <line x1="50" y1="50" x2="50" y2="85"/><line x1="15" y1="85" x2="50" y2="85"/>
      <line x1="50" y1="85" x2="85" y2="85"/><line x1="85" y1="50" x2="85" y2="85"/>
      <path d="M30 15 L30 30 L50 30"/><circle cx="30" cy="30" r="1.5" fill="#0277BD"/>
    </g>
  </svg>
`)

// P4. Geometric Diamond — professional diamond shapes
const geometricSvg = svgToDataUri(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
    <g stroke="#0D47A1" stroke-width="0.5" fill="none" opacity="0.04">
      <path d="M50 5 L95 50 L50 95 L5 50 Z"/>
      <path d="M50 20 L80 50 L50 80 L20 50 Z"/>
      <path d="M50 35 L65 50 L50 65 L35 50 Z"/>
      <line x1="5" y1="50" x2="95" y2="50"/><line x1="50" y1="5" x2="50" y2="95"/>
    </g>
  </svg>
`)

// P5. Wave Lines — elegant flowing curves
const waveSvg = svgToDataUri(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
    <g stroke="#1E88E5" stroke-width="0.6" fill="none" opacity="0.04">
      <path d="M0 25 Q25 10 50 25 Q75 40 100 25"/>
      <path d="M0 45 Q25 30 50 45 Q75 60 100 45"/>
      <path d="M0 65 Q25 50 50 65 Q75 80 100 65"/>
      <path d="M0 85 Q25 70 50 85 Q75 100 100 85"/>
    </g>
  </svg>
`)

// P6. Radial Network — spokes from center (neon)
const neonRadialSvg = (color: string) => svgToDataUri(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
    <g stroke="${color}" stroke-width="0.5" fill="none" opacity="0.07">
      <circle cx="50" cy="50" r="40" stroke-dasharray="2 4"/>
      <circle cx="50" cy="50" r="28" stroke-dasharray="1.5 3"/>
      <circle cx="50" cy="50" r="15"/><circle cx="50" cy="50" r="4" fill="${color}"/>
      <line x1="50" y1="10" x2="50" y2="50"/><line x1="78" y1="22" x2="50" y2="50"/>
      <line x1="90" y1="50" x2="50" y2="50"/><line x1="78" y1="78" x2="50" y2="50"/>
      <line x1="50" y1="90" x2="50" y2="50"/><line x1="22" y1="78" x2="50" y2="50"/>
      <line x1="10" y1="50" x2="50" y2="50"/><line x1="22" y1="22" x2="50" y2="50"/>
      <circle cx="50" cy="10" r="2" fill="${color}"/><circle cx="90" cy="50" r="2" fill="${color}"/>
      <circle cx="50" cy="90" r="2" fill="${color}"/><circle cx="10" cy="50" r="2" fill="${color}"/>
    </g>
  </svg>
`)

// P7. Neon Circuit — glowing circuit for dark themes
const neonCircuitSvg = (color: string) => svgToDataUri(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
    <g stroke="${color}" stroke-width="0.6" fill="none" opacity="0.08">
      <circle cx="10" cy="20" r="2" fill="${color}"/><circle cx="40" cy="20" r="1.5" fill="${color}"/>
      <circle cx="70" cy="20" r="2" fill="${color}"/><circle cx="25" cy="50" r="2.5" fill="${color}"/>
      <circle cx="60" cy="50" r="2" fill="${color}"/><circle cx="15" cy="80" r="2" fill="${color}"/>
      <circle cx="50" cy="80" r="2" fill="${color}"/><circle cx="80" cy="80" r="1.5" fill="${color}"/>
      <line x1="10" y1="20" x2="40" y2="20"/><line x1="40" y1="20" x2="40" y2="50"/>
      <line x1="40" y1="50" x2="25" y2="50"/><line x1="70" y1="20" x2="70" y2="50"/>
      <line x1="70" y1="50" x2="60" y2="50"/><line x1="60" y1="50" x2="60" y2="80"/>
      <line x1="60" y1="80" x2="50" y2="80"/><line x1="25" y1="50" x2="15" y2="80"/>
    </g>
  </svg>
`)

// P8. Neon Neural — deep learning layers
const neonNeuralSvg = (color: string) => svgToDataUri(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
    <g stroke="${color}" stroke-width="0.4" fill="${color}" opacity="0.08">
      <circle cx="10" cy="20" r="2"/><circle cx="10" cy="50" r="2"/><circle cx="10" cy="80" r="2"/>
      <circle cx="35" cy="15" r="2.5"/><circle cx="35" cy="45" r="2.5"/><circle cx="35" cy="75" r="2.5"/>
      <circle cx="60" cy="30" r="2"/><circle cx="60" cy="60" r="2"/>
      <circle cx="85" cy="45" r="2.5"/>
      <line x1="10" y1="20" x2="35" y2="15" fill="none"/><line x1="10" y1="20" x2="35" y2="45" fill="none"/>
      <line x1="10" y1="50" x2="35" y2="45" fill="none"/><line x1="10" y1="80" x2="35" y2="75" fill="none"/>
      <line x1="35" y1="15" x2="60" y2="30" fill="none"/><line x1="35" y1="45" x2="60" y2="30" fill="none"/>
      <line x1="35" y1="45" x2="60" y2="60" fill="none"/><line x1="35" y1="75" x2="60" y2="60" fill="none"/>
      <line x1="60" y1="30" x2="85" y2="45" fill="none"/><line x1="60" y1="60" x2="85" y2="45" fill="none"/>
    </g>
  </svg>
`)

// P9. Hex Mesh
const neonHexSvg = (color: string) => svgToDataUri(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
    <g stroke="${color}" stroke-width="0.5" fill="none" opacity="0.08">
      <polygon points="25,5 35,5 40,14 35,23 25,23 20,14"/>
      <polygon points="50,5 60,5 65,14 60,23 50,23 45,14"/>
      <polygon points="75,5 85,5 90,14 85,23 75,23 70,14"/>
      <polygon points="12,24 22,24 27,33 22,42 12,42 7,33"/>
      <polygon points="37,24 47,24 52,33 47,42 37,42 32,33"/>
      <polygon points="62,24 72,24 77,33 72,42 62,42 57,33"/>
      <polygon points="25,43 35,43 40,52 35,61 25,61 20,52"/>
      <polygon points="50,43 60,43 65,52 60,61 50,61 45,52"/>
      <polygon points="75,43 85,43 90,52 85,61 75,61 70,52"/>
    </g>
  </svg>
`)

// ─── 6 PROFESSIONAL BLUE-TONED THEMES ───────────────────────────────────────

export const CERTIFICATE_THEMES: CertificateTheme[] = [

  // 1. ─── Royal Blue — Classic formal, white bg with deep blue ───
  {
    id: 'royal-blue',
    name: 'Royal Blue',
    nameEn: 'Royal Blue',
    primaryColor: '#1565C0',
    secondaryColor: '#1976D2',
    accentColor: '#B0BEC5',
    borderColor: '#0D47A1',
    textColor: '#1A2332',
    headerColor: '#0D47A1',
    bgGradient: 'linear-gradient(180deg, #FFFFFF 0%, #F5F8FC 40%, #EBF0F7 100%)',
    borderStyle: 'double',
    patternSvg: neuralNetworkSvg,
    isDark: false,
    mood: 'Formal Classic',
  },

  // 2. ─── Sky Gradient — Light airy blue gradient ───
  {
    id: 'sky-gradient',
    name: 'Sky Gradient',
    nameEn: 'Sky Gradient',
    primaryColor: '#0277BD',
    secondaryColor: '#039BE5',
    accentColor: '#90CAF9',
    borderColor: '#01579B',
    textColor: '#1B2838',
    headerColor: '#01579B',
    bgGradient: 'linear-gradient(135deg, #FFFFFF 0%, #E3F2FD 30%, #BBDEFB 70%, #E1F5FE 100%)',
    borderStyle: 'solid',
    patternSvg: waveSvg,
    isDark: false,
    mood: 'Fresh & Modern',
  },

  // 3. ─── Navy Executive — Deep navy, gold accent, corporate ───
  {
    id: 'navy-executive',
    name: 'Navy Executive',
    nameEn: 'Navy Executive',
    primaryColor: '#0D47A1',
    secondaryColor: '#1565C0',
    accentColor: '#C9A84C',
    borderColor: '#0D47A1',
    textColor: '#1A2332',
    headerColor: '#0D47A1',
    bgGradient: 'linear-gradient(180deg, #FFFFFF 0%, #F0F3F8 50%, #E3E8F0 100%)',
    borderStyle: 'ornate',
    patternSvg: geometricSvg,
    isDark: false,
    mood: 'Executive Premium',
  },

  // 4. ─── Ocean Tech — Teal-blue tech gradient ───
  {
    id: 'ocean-tech',
    name: 'Ocean Tech',
    nameEn: 'Ocean Tech',
    primaryColor: '#006064',
    secondaryColor: '#00838F',
    accentColor: '#4DD0E1',
    borderColor: '#004D40',
    textColor: '#1B2D36',
    headerColor: '#004D40',
    bgGradient: 'linear-gradient(135deg, #FFFFFF 0%, #E0F7FA 40%, #B2EBF2 70%, #E0F2F1 100%)',
    borderStyle: 'solid',
    patternSvg: circuitSvg,
    isDark: false,
    mood: 'Technology',
  },

  // 5. ─── Pure White — Clean elegant white ───
  {
    id: 'pure-white',
    name: 'ขาวสะอาด',
    nameEn: 'Pure White',
    primaryColor: '#374151',
    secondaryColor: '#6B7280',
    accentColor: '#D1D5DB',
    borderColor: '#9CA3AF',
    textColor: '#1F2937',
    headerColor: '#111827',
    bgGradient: 'linear-gradient(180deg, #FFFFFF 0%, #FAFAFA 50%, #F5F5F5 100%)',
    borderStyle: 'double',
    patternSvg: geometricSvg,
    isDark: false,
    mood: 'Elegant Minimal',
  },

  // 6. ─── Blue White — Fresh blue on white ───
  {
    id: 'blue-white',
    name: 'ฟ้าขาว',
    nameEn: 'Blue White',
    primaryColor: '#1E88E5',
    secondaryColor: '#42A5F5',
    accentColor: '#90CAF9',
    borderColor: '#1565C0',
    textColor: '#1A2332',
    headerColor: '#1565C0',
    bgGradient: 'linear-gradient(180deg, #FFFFFF 0%, #F8FBFF 40%, #EFF6FF 100%)',
    borderStyle: 'solid',
    patternSvg: waveSvg,
    isDark: false,
    mood: 'Clean & Bright',
  },

  // 7. ─── Blue Gold — Regal blue with golden accents ───
  {
    id: 'blue-gold',
    name: 'ฟ้าเหลือง',
    nameEn: 'Blue Gold',
    primaryColor: '#1565C0',
    secondaryColor: '#D4A847',
    accentColor: '#F2D06B',
    borderColor: '#C9A84C',
    textColor: '#1A2332',
    headerColor: '#0D47A1',
    bgGradient: 'linear-gradient(135deg, #FFFFFF 0%, #FFFDE8 30%, #FFF9C4 60%, #FFFDE7 100%)',
    borderStyle: 'ornate',
    patternSvg: neuralNetworkSvg,
    isDark: false,
    mood: 'Royal & Grand',
  },

  // 8. ─── Pink Blue Pastel — Soft pink & blue pastel ───
  {
    id: 'pink-blue-pastel',
    name: 'ชมพูฟ้าพาสเทล',
    nameEn: 'Pink Blue Pastel',
    primaryColor: '#E91E8C',
    secondaryColor: '#42A5F5',
    accentColor: '#F8BBD0',
    borderColor: '#CE93D8',
    textColor: '#37474F',
    headerColor: '#AD1457',
    bgGradient: 'linear-gradient(135deg, #FFF0F5 0%, #FCE4EC 25%, #F3E5F5 50%, #E8EAF6 75%, #E3F2FD 100%)',
    borderStyle: 'solid',
    patternSvg: waveSvg,
    isDark: false,
    mood: 'Sweet & Dreamy',
  },

  // 9. ─── Blue Purple Pastel — Soft blue & lavender pastel ───
  {
    id: 'blue-purple-pastel',
    name: 'ฟ้าม่วงพาสเทล',
    nameEn: 'Blue Purple Pastel',
    primaryColor: '#5C6BC0',
    secondaryColor: '#7E57C2',
    accentColor: '#B39DDB',
    borderColor: '#7E57C2',
    textColor: '#37474F',
    headerColor: '#311B92',
    bgGradient: 'linear-gradient(135deg, #EDE7F6 0%, #E8EAF6 30%, #E3F2FD 60%, #F3E5F5 100%)',
    borderStyle: 'double',
    patternSvg: dataGridSvg,
    isDark: false,
    mood: 'Calm & Creative',
  },

  // 10. ─── Neon Sapphire — Dark blue with sapphire neon glow ───
  {
    id: 'neon-sapphire',
    name: 'Neon Sapphire',
    nameEn: 'Neon Sapphire',
    primaryColor: '#90CAF9',
    secondaryColor: '#42A5F5',
    accentColor: '#42A5F5',
    borderColor: '#1565C0',
    textColor: '#DBEAFE',
    headerColor: '#F0F9FF',
    bgGradient: 'linear-gradient(135deg, #0B1628 0%, #0F2040 40%, #1A3A7A 100%)',
    borderStyle: 'solid',
    patternSvg: neonCircuitSvg('#42A5F5'),
    isDark: true,
    neonGlow: '#42A5F5',
    mood: 'AI Technology',
  },

  // 6. ─── Midnight Azure — Deep dark blue with cyan glow ───
  {
    id: 'midnight-azure',
    name: 'Midnight Azure',
    nameEn: 'Midnight Azure',
    primaryColor: '#80DEEA',
    secondaryColor: '#26C6DA',
    accentColor: '#26C6DA',
    borderColor: '#00838F',
    textColor: '#CFFAFE',
    headerColor: '#ECFEFF',
    bgGradient: 'linear-gradient(135deg, #020617 0%, #0A1628 40%, #0C3547 100%)',
    borderStyle: 'solid',
    patternSvg: neonRadialSvg('#26C6DA'),
    isDark: true,
    neonGlow: '#26C6DA',
    mood: 'Futuristic',
  },
]

export const DEFAULT_THEME_ID = 'royal-blue'

export function getCertificateTheme(themeId: string): CertificateTheme {
  const theme = CERTIFICATE_THEMES.find((t) => t.id === themeId)
  if (theme) return theme
  const defaultTheme = CERTIFICATE_THEMES.find((t) => t.id === DEFAULT_THEME_ID)
  return defaultTheme!
}
