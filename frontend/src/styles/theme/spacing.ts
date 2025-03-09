/**
 * TrustBridge Spacing System
 * Defines consistent spacing values throughout the application
 */

type SpacingValues = {
  0: string;
  1: string;
  2: string;
  3: string;
  4: string;
  5: string;
  6: string;
  8: string;
  10: string;
  12: string;
  16: string;
  20: string;
  24: string;
  32: string;
  40: string;
  48: string;
  56: string;
  64: string;
};

type SpacingType = {
  unit: number;
  values: SpacingValues;
  helpers: {
    toPixels: (units: number) => string;
    get: (key: keyof SpacingValues) => string;
  };
};

export const spacing: SpacingType = {
  // Base unit in pixels
  unit: 4,
  
  // Spacing values (in pixels)
  values: {
    0: '0',
    1: '4px',
    2: '8px',
    3: '12px',
    4: '16px',
    5: '20px',
    6: '24px',
    8: '32px',
    10: '40px',
    12: '48px',
    16: '64px',
    20: '80px',
    24: '96px',
    32: '128px',
    40: '160px',
    48: '192px',
    56: '224px',
    64: '256px',
  },
  
  // Helper functions
  helpers: {
    // Convert spacing units to pixels
    toPixels: (units: number) => `${units * 4}px`,
    
    // Get spacing by key
    get: (key: keyof SpacingValues) => spacing.values[key],
  },
};

export default spacing; 