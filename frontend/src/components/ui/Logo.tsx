import React from 'react';
import theme from '../../styles/theme';

export interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  variant?: 'full' | 'icon';
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'medium',
  variant = 'full',
  className,
}) => {
  // Define size dimensions
  const dimensions = {
    small: { width: variant === 'full' ? 120 : 32, height: 32 },
    medium: { width: variant === 'full' ? 180 : 48, height: 48 },
    large: { width: variant === 'full' ? 240 : 64, height: 64 },
  };

  const { width, height } = dimensions[size];

  // Define colors
  const primaryColor = theme.colors.primary.main;
  const secondaryColor = theme.colors.secondary.main;

  return (
    <div 
      className={`trustbridge-logo ${className || ''}`}
      style={{ 
        display: 'inline-flex',
        alignItems: 'center',
      }}
    >
      {/* Icon part */}
      <svg
        width={variant === 'full' ? height : width}
        height={height}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Bridge icon */}
        <path
          d="M32 8C18.745 8 8 18.745 8 32C8 45.255 18.745 56 32 56C45.255 56 56 45.255 56 32C56 18.745 45.255 8 32 8Z"
          fill="white"
          stroke={primaryColor}
          strokeWidth="4"
        />
        <path
          d="M16 32H48"
          stroke={primaryColor}
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path
          d="M20 24V40"
          stroke={primaryColor}
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path
          d="M44 24V40"
          stroke={primaryColor}
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path
          d="M32 20V44"
          stroke={secondaryColor}
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>

      {/* Text part (only for full variant) */}
      {variant === 'full' && (
        <div
          style={{
            marginLeft: '8px',
            fontFamily: theme.typography.fontFamily.primary,
            fontWeight: theme.typography.fontWeight.bold,
            fontSize: size === 'small' ? '18px' : size === 'medium' ? '24px' : '32px',
            color: theme.colors.primary.main,
            letterSpacing: '-0.02em',
          }}
        >
          Trust<span style={{ color: theme.colors.secondary.main }}>Bridge</span>
        </div>
      )}
    </div>
  );
};

export default Logo; 