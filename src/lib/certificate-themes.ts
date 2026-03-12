// Certificate Themes for AI Business Academy
// SPU BUS - School of Business Administration, Sripatum University

export type BorderPattern =
  | "classic"
  | "modern"
  | "elegant"
  | "minimal"
  | "ornate"
  | "geometric"
  | "academic";

export type HeaderStyle = "centered" | "left-aligned";

export type SignatureStyle = "classic" | "modern" | "minimal";

export interface CertificateTheme {
  id: string;
  name: string;
  nameEn: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  borderColor: string;
  textColor: string;
  headerColor: string;
  bgGradient: string;
  borderPattern: BorderPattern;
  headerStyle: HeaderStyle;
  signatureStyle: SignatureStyle;
}

export const CERTIFICATE_THEMES: CertificateTheme[] = [
  // 1. Royal Blue - สีน้ำเงินหลวง ดูเป็นทางการ
  {
    id: "royal-blue",
    name: "สีน้ำเงินหลวง",
    nameEn: "Royal Blue",
    primaryColor: "#1B3A6B",
    secondaryColor: "#2A5298",
    accentColor: "#C9A84C",
    borderColor: "#1B3A6B",
    textColor: "#1E293B",
    headerColor: "#1B3A6B",
    bgGradient:
      "linear-gradient(135deg, #FFFFFF 0%, #EEF2F7 40%, #DCEAFE 100%)",
    borderPattern: "classic",
    headerStyle: "centered",
    signatureStyle: "classic",
  },

  // 2. Executive Navy - สีกรมท่าผู้บริหาร
  {
    id: "executive-navy",
    name: "สีกรมท่าผู้บริหาร",
    nameEn: "Executive Navy",
    primaryColor: "#0F2440",
    secondaryColor: "#1A3A5C",
    accentColor: "#B8860B",
    borderColor: "#0F2440",
    textColor: "#1A2332",
    headerColor: "#0F2440",
    bgGradient:
      "linear-gradient(180deg, #FFFFFF 0%, #F0F3F8 50%, #E2E8F0 100%)",
    borderPattern: "elegant",
    headerStyle: "centered",
    signatureStyle: "classic",
  },

  // 3. Elegant Gold - สีทองหรูหรา
  {
    id: "elegant-gold",
    name: "สีทองหรูหรา",
    nameEn: "Elegant Gold",
    primaryColor: "#8B6914",
    secondaryColor: "#A67C00",
    accentColor: "#2C1810",
    borderColor: "#C9A84C",
    textColor: "#2C1810",
    headerColor: "#6B4F1D",
    bgGradient:
      "linear-gradient(135deg, #FFFDF5 0%, #FFF8E7 40%, #FDF0D5 100%)",
    borderPattern: "ornate",
    headerStyle: "centered",
    signatureStyle: "classic",
  },

  // 4. Modern Cyan - สีฟ้าทันสมัย
  {
    id: "modern-cyan",
    name: "สีฟ้าทันสมัย",
    nameEn: "Modern Cyan",
    primaryColor: "#0891B2",
    secondaryColor: "#06B6D4",
    accentColor: "#1E40AF",
    borderColor: "#0891B2",
    textColor: "#1E293B",
    headerColor: "#0E7490",
    bgGradient:
      "linear-gradient(160deg, #FFFFFF 0%, #ECFEFF 35%, #E0F7FA 100%)",
    borderPattern: "modern",
    headerStyle: "left-aligned",
    signatureStyle: "modern",
  },

  // 5. Academic Crimson - สีแดงอิฐวิชาการ
  {
    id: "academic-crimson",
    name: "สีแดงอิฐวิชาการ",
    nameEn: "Academic Crimson",
    primaryColor: "#7C1D1D",
    secondaryColor: "#991B1B",
    accentColor: "#92400E",
    borderColor: "#7C1D1D",
    textColor: "#1C1917",
    headerColor: "#7C1D1D",
    bgGradient:
      "linear-gradient(135deg, #FFFFFF 0%, #FEF2F2 40%, #FCEAEA 100%)",
    borderPattern: "academic",
    headerStyle: "centered",
    signatureStyle: "classic",
  },

  // 6. Premium Purple - สีม่วงพรีเมียม
  {
    id: "premium-purple",
    name: "สีม่วงพรีเมียม",
    nameEn: "Premium Purple",
    primaryColor: "#581C87",
    secondaryColor: "#6D28D9",
    accentColor: "#C084FC",
    borderColor: "#581C87",
    textColor: "#1E1B2E",
    headerColor: "#4C1D95",
    bgGradient:
      "linear-gradient(145deg, #FFFFFF 0%, #F5F0FF 35%, #EDE9FE 100%)",
    borderPattern: "geometric",
    headerStyle: "centered",
    signatureStyle: "modern",
  },

  // 7. Minimal Black & White - ขาวดำมินิมอล
  {
    id: "minimal-bw",
    name: "ขาวดำมินิมอล",
    nameEn: "Minimal Black & White",
    primaryColor: "#171717",
    secondaryColor: "#404040",
    accentColor: "#737373",
    borderColor: "#262626",
    textColor: "#171717",
    headerColor: "#0A0A0A",
    bgGradient:
      "linear-gradient(180deg, #FFFFFF 0%, #FAFAFA 50%, #F5F5F5 100%)",
    borderPattern: "minimal",
    headerStyle: "left-aligned",
    signatureStyle: "minimal",
  },
];

export const DEFAULT_THEME_ID = "royal-blue";

export function getCertificateTheme(
  themeId: string
): CertificateTheme {
  const theme = CERTIFICATE_THEMES.find((t) => t.id === themeId);
  if (theme) return theme;

  const defaultTheme = CERTIFICATE_THEMES.find(
    (t) => t.id === DEFAULT_THEME_ID
  );
  return defaultTheme!;
}
