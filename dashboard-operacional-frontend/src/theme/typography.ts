export const typography = {
  fontFamily: "'Inter', sans-serif",
  h1: {
    fontFamily: "'Inter', sans-serif",
    fontWeight: 700,
    fontSize: "2rem",
    lineHeight: 1.2,
  },
  h2: {
    fontFamily: "'Inter', sans-serif",
    fontWeight: 600,
    fontSize: "1.5rem",
    lineHeight: 1.3,
  },
  h3: {
    fontFamily: "'Inter', sans-serif",
    fontWeight: 600,
    fontSize: "1.25rem",
    lineHeight: 1.4,
  },
  navigationBarTitle: {
    fontFamily: "'Inter', sans-serif",
    fontWeight: 600,
    fontSize: "1.125rem",
    lineHeight: 1.4,
  },
  body1: {
    fontFamily: "'Inter', sans-serif",
    fontWeight: 400,
    fontSize: "1rem",
    lineHeight: 1.5,
  },
  body2: {
    fontFamily: "'Inter', sans-serif",
    fontWeight: 400,
    fontSize: "0.875rem",
    lineHeight: 1.57,
  },
  subtitle1: {
    fontFamily: "'Inter', sans-serif",
    fontWeight: 500,
    fontSize: "1rem",
    lineHeight: 1.5,
  },
  subtitle2: {
    fontFamily: "'Inter', sans-serif",
    fontWeight: 500,
    fontSize: "0.875rem",
    lineHeight: 1.57,
  },
  button: {
    fontFamily: "'Inter', sans-serif",
    fontWeight: 600,
    fontSize: "0.875rem",
    lineHeight: 1.57,
    textTransform: "none",
  },
  caption: {
    fontFamily: "'Inter', sans-serif",
    fontWeight: 400,
    fontSize: "0.75rem",
    lineHeight: 1.5,
  },
  overline: {
    fontFamily: "'Inter', sans-serif",
    fontWeight: 600,
    fontSize: "0.75rem",
    lineHeight: 1.5,
    textTransform: "uppercase",
  },
} as const;

// Variações de peso personalizadas
export const fontWeights = {
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const;

// Estilos de texto personalizados
export const textStyles = {
  navigationBarTitle: {
    fontFamily: "'Inter', sans-serif",
    fontSize: "1rem",
    fontWeight: fontWeights.semibold,
    lineHeight: 1.4,
  },
  titleLarge: {
    fontFamily: "'Inter', sans-serif",
    fontSize: "1.25rem",
    fontWeight: fontWeights.semibold,
    lineHeight: 1.4,
  },
  titleMedium: {
    fontFamily: "'Inter', sans-serif",
    fontSize: "1rem",
    fontWeight: fontWeights.medium,
    lineHeight: 1.5,
  },
  titleSmall: {
    fontFamily: "'Inter', sans-serif",
    fontSize: "0.875rem",
    fontWeight: fontWeights.medium,
    lineHeight: 1.57,
  },
  bodyLarge: {
    fontFamily: "'Inter', sans-serif",
    fontSize: "1rem",
    fontWeight: fontWeights.normal,
    lineHeight: 1.5,
  },
  bodyMedium: {
    fontFamily: "'Inter', sans-serif",
    fontSize: "0.875rem",
    fontWeight: fontWeights.normal,
    lineHeight: 1.57,
  },
  bodySmall: {
    fontFamily: "'Inter', sans-serif",
    fontSize: "0.75rem",
    fontWeight: fontWeights.normal,
    lineHeight: 1.5,
  },
} as const;
