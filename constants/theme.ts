/**
 * Provides consistent color palette and spacing throughout the app
 */

export const colors = {
  // Primary gradient colors from background.json
  primary: {
    dark: "#0E1630", // rgb(14, 22, 48) - Deep space blue
    medium: "#313D6E", // rgb(49, 61, 110) - Medium blue
    light: "#565EB0", // rgb(86, 94, 176) - Light purple-blue
  },

  // Accent colors
  accent: {
    purple: "#484E99", // rgb(72, 78, 153)
    lavender: "#9BA8E8", // rgb(155, 168, 232) - Lighter accent
  },

  // UI colors
  text: {
    primary: "#FFFFFF",
    secondary: "rgba(255, 255, 255, 0.7)",
    tertiary: "rgba(255, 255, 255, 0.5)",
  },

  background: {
    overlay: "rgba(14, 22, 48, 0.3)",
  },
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  full: 9999,
} as const;

export const typography = {
  title: {
    fontSize: 70,
    fontFamily: "Titles",
  },
  heading: {
    fontSize: 32,
    fontWeight: "600" as const,
  },
  body: {
    fontSize: 16,
    fontWeight: "400" as const,
  },
  button: {
    fontSize: 18,
    fontWeight: "600" as const,
  },
} as const;
