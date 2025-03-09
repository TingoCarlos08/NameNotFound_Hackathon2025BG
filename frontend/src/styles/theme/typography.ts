/**
 * TrustBridge Typography
 * Defines font families, sizes, weights, and styles
 */

export const typography = {
  // Font families
  fontFamily: {
    primary: '"Montserrat", "Helvetica Neue", Arial, sans-serif',
    secondary: '"Open Sans", "Helvetica Neue", Arial, sans-serif',
    mono: '"Roboto Mono", monospace',
  },
  
  // Font weights
  fontWeight: {
    light: 300,
    regular: 400,
    medium: 500,
    semiBold: 600,
    bold: 700,
  },
  
  // Font sizes (in pixels)
  fontSize: {
    xs: '12px',
    sm: '14px',
    md: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '30px',
    '4xl': '36px',
    '5xl': '48px',
    '6xl': '60px',
  },
  
  // Line heights
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
    loose: 2,
  },
  
  // Letter spacing
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
  
  // Text variants
  variant: {
    h1: {
      fontFamily: '"Montserrat", "Helvetica Neue", Arial, sans-serif',
      fontWeight: 700,
      fontSize: '48px',
      lineHeight: 1.2,
      letterSpacing: '-0.025em',
    },
    h2: {
      fontFamily: '"Montserrat", "Helvetica Neue", Arial, sans-serif',
      fontWeight: 700,
      fontSize: '36px',
      lineHeight: 1.2,
      letterSpacing: '-0.025em',
    },
    h3: {
      fontFamily: '"Montserrat", "Helvetica Neue", Arial, sans-serif',
      fontWeight: 600,
      fontSize: '30px',
      lineHeight: 1.3,
      letterSpacing: '-0.025em',
    },
    h4: {
      fontFamily: '"Montserrat", "Helvetica Neue", Arial, sans-serif',
      fontWeight: 600,
      fontSize: '24px',
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
    },
    h5: {
      fontFamily: '"Montserrat", "Helvetica Neue", Arial, sans-serif',
      fontWeight: 600,
      fontSize: '20px',
      lineHeight: 1.4,
      letterSpacing: '-0.01em',
    },
    h6: {
      fontFamily: '"Montserrat", "Helvetica Neue", Arial, sans-serif',
      fontWeight: 600,
      fontSize: '18px',
      lineHeight: 1.4,
      letterSpacing: '-0.01em',
    },
    body1: {
      fontFamily: '"Open Sans", "Helvetica Neue", Arial, sans-serif',
      fontWeight: 400,
      fontSize: '16px',
      lineHeight: 1.5,
      letterSpacing: 'normal',
    },
    body2: {
      fontFamily: '"Open Sans", "Helvetica Neue", Arial, sans-serif',
      fontWeight: 400,
      fontSize: '14px',
      lineHeight: 1.5,
      letterSpacing: 'normal',
    },
    button: {
      fontFamily: '"Montserrat", "Helvetica Neue", Arial, sans-serif',
      fontWeight: 600,
      fontSize: '14px',
      lineHeight: 1.75,
      letterSpacing: '0.025em',
      textTransform: 'uppercase',
    },
    caption: {
      fontFamily: '"Open Sans", "Helvetica Neue", Arial, sans-serif',
      fontWeight: 400,
      fontSize: '12px',
      lineHeight: 1.5,
      letterSpacing: '0.025em',
    },
    overline: {
      fontFamily: '"Montserrat", "Helvetica Neue", Arial, sans-serif',
      fontWeight: 600,
      fontSize: '12px',
      lineHeight: 1.5,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
    },
  },
};

export default typography; 