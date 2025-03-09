import React from 'react';
import theme from '../../styles/theme';
import './Button.css';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'text';
export type ButtonSize = 'small' | 'medium' | 'large';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  children: React.ReactNode;
}

const getVariantStyles = (variant: ButtonVariant): React.CSSProperties => {
  switch (variant) {
    case 'primary':
      return {
        backgroundColor: theme.colors.primary.main,
        color: theme.colors.primary.contrastText,
        border: 'none',
      };
    case 'secondary':
      return {
        backgroundColor: theme.colors.secondary.main,
        color: theme.colors.secondary.contrastText,
        border: 'none',
      };
    case 'outline':
      return {
        backgroundColor: 'transparent',
        color: theme.colors.primary.main,
        border: `1px solid ${theme.colors.primary.main}`,
      };
    case 'text':
      return {
        backgroundColor: 'transparent',
        color: theme.colors.primary.main,
        border: 'none',
      };
    default:
      return {};
  }
};

const getSizeStyles = (size: ButtonSize): React.CSSProperties => {
  switch (size) {
    case 'small':
      return {
        padding: `${theme.spacing.values[1]} ${theme.spacing.values[3]}`,
        fontSize: theme.typography.fontSize.sm,
      };
    case 'medium':
      return {
        padding: `${theme.spacing.values[2]} ${theme.spacing.values[4]}`,
        fontSize: theme.typography.fontSize.md,
      };
    case 'large':
      return {
        padding: `${theme.spacing.values[3]} ${theme.spacing.values[6]}`,
        fontSize: theme.typography.fontSize.lg,
      };
    default:
      return {};
  }
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  startIcon,
  endIcon,
  children,
  ...props
}) => {
  const baseStyles: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.values[2],
    borderRadius: theme.borderRadius.md,
    fontFamily: theme.typography.fontFamily.primary,
    fontWeight: theme.typography.fontWeight.semiBold,
    cursor: 'pointer',
    transition: `all ${theme.transitions.duration.shorter}ms ${theme.transitions.easing.easeInOut}`,
    textTransform: 'uppercase',
    letterSpacing: theme.typography.letterSpacing.wide,
    width: fullWidth ? '100%' : 'auto',
  };

  const variantStyles = getVariantStyles(variant);
  const sizeStyles = getSizeStyles(size);

  const combinedStyles = {
    ...baseStyles,
    ...variantStyles,
    ...sizeStyles,
  };

  // Add hover styles via CSS class instead of inline styles
  const getClassName = () => {
    let className = 'trustbridge-button';
    if (variant) className += ` trustbridge-button-${variant}`;
    if (size) className += ` trustbridge-button-${size}`;
    if (fullWidth) className += ' trustbridge-button-fullwidth';
    if (props.className) className += ` ${props.className}`;
    return className;
  };

  return (
    <button style={combinedStyles} className={getClassName()} {...props}>
      {startIcon && <span className="button-start-icon">{startIcon}</span>}
      {children}
      {endIcon && <span className="button-end-icon">{endIcon}</span>}
    </button>
  );
};

export default Button; 