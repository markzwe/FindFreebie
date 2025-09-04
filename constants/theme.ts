// theme.ts

export const COLORS = {
  /* ---------- Core ---------- */
  accent: "#2E7D32", // Primary accent (Material green 800)
  accentLight: "#4CAF50",
  accentDark: "#1B5E20",
  accentMuted: "#A5D6A7",

  background: "#FFFFFF", // App background
  surface: "#F9F9F9", // Cards, sections
  overlay: "rgba(0,0,0,0.4)", // modal / overlay

  text: "#1A1A1A", // Primary text
  textMuted: "#6E6E6E", // Secondary text
  textInverse: "#FFFFFF", // Text on dark bg

  border: "#E5E5E5",
  divider: "#F0F0F0",

  /* ---------- Semantic ---------- */
  success: "#2E7D32",
  successLight: "#81C784",
  successDark: "#1B5E20",
  error: "#D32F2F",

  danger: "#D32F2F",
  dangerLight: "#E57373",
  dangerDark: "#B71C1C",

  warning: "#ED6C02",
  warningLight: "#FFB74D",
  warningDark: "#E65100",

  info: "#0288D1",
  infoLight: "#4FC3F7",
  infoDark: "#01579B",

  /* ---------- Neutral Scale ---------- */
  white: "#FFFFFF",
  black: "#000000",
  lightGray: '#ADADAD',
  gray: "#808080",
  darkGray: '#3B3B3B'
};

export const FONT = {
  family: {
    regular: "System",
    medium: "System",
    bold: "System",
  },
  size: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
  },
};

export const RADIUS = {
  xs: 4,
  sm: 6,
  md: 10,
  lg: 16,
  xl: 24,
  full: 999,
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 20,
  xl: 28,
  xxl: 40,
};

export const SHADOW = {
  card: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  medium: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  large: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 12,
    elevation: 8,
  },
};
