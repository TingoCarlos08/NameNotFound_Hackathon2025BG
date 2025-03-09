import React from 'react';
import theme from '../../styles/theme';
import './Input.css';

export type InputVariant = 'outlined' | 'filled' | 'standard';
export type InputSize = 'small' | 'medium' | 'large';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  variant?: InputVariant;
  inputSize?: InputSize;
  fullWidth?: boolean;
  label?: string;
  helperText?: string;
  error?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  variant = 'outlined',
  inputSize = 'medium',
  fullWidth = false,
  label,
  helperText,
  error = false,
  startIcon,
  endIcon,
  className,
  ...props
}) => {
  const getClassName = () => {
    let baseClass = 'trustbridge-input';
    if (variant) baseClass += ` trustbridge-input-${variant}`;
    if (inputSize) baseClass += ` trustbridge-input-${inputSize}`;
    if (fullWidth) baseClass += ' trustbridge-input-fullwidth';
    if (error) baseClass += ' trustbridge-input-error';
    if (className) baseClass += ` ${className}`;
    return baseClass;
  };

  const inputId = props.id || `input-${Math.random().toString(36).substring(2, 9)}`;

  return (
    <div className={`trustbridge-input-container ${fullWidth ? 'trustbridge-input-container-fullwidth' : ''}`}>
      {label && (
        <label 
          htmlFor={inputId} 
          className={`trustbridge-input-label ${error ? 'trustbridge-input-label-error' : ''}`}
        >
          {label}
        </label>
      )}
      
      <div className="trustbridge-input-wrapper">
        {startIcon && <span className="trustbridge-input-start-icon">{startIcon}</span>}
        
        <input
          id={inputId}
          className={getClassName()}
          {...props}
        />
        
        {endIcon && <span className="trustbridge-input-end-icon">{endIcon}</span>}
      </div>
      
      {helperText && (
        <p className={`trustbridge-input-helper-text ${error ? 'trustbridge-input-helper-text-error' : ''}`}>
          {helperText}
        </p>
      )}
    </div>
  );
};

export default Input; 