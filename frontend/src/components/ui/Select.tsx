import React from 'react';
import './Select.css';

export type SelectVariant = 'outlined' | 'filled' | 'standard';
export type SelectSize = 'small' | 'medium' | 'large';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  variant?: SelectVariant;
  selectSize?: SelectSize;
  fullWidth?: boolean;
  label?: string;
  helperText?: string;
  error?: boolean;
  options: SelectOption[];
}

export const Select: React.FC<SelectProps> = ({
  variant = 'outlined',
  selectSize = 'medium',
  fullWidth = false,
  label,
  helperText,
  error = false,
  options = [],
  className,
  ...props
}) => {
  const getClassName = () => {
    let baseClass = 'trustbridge-select';
    if (variant) baseClass += ` trustbridge-select-${variant}`;
    if (selectSize) baseClass += ` trustbridge-select-${selectSize}`;
    if (fullWidth) baseClass += ' trustbridge-select-fullwidth';
    if (error) baseClass += ' trustbridge-select-error';
    if (className) baseClass += ` ${className}`;
    return baseClass;
  };

  const selectId = props.id || `select-${Math.random().toString(36).substring(2, 9)}`;

  return (
    <div className={`trustbridge-select-container ${fullWidth ? 'trustbridge-select-container-fullwidth' : ''}`}>
      {label && (
        <label 
          htmlFor={selectId} 
          className={`trustbridge-select-label ${error ? 'trustbridge-select-label-error' : ''}`}
        >
          {label}
        </label>
      )}
      
      <div className="trustbridge-select-wrapper">
        <select
          id={selectId}
          className={getClassName()}
          {...props}
        >
          <option value="" disabled>Seleccione una opción</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="trustbridge-select-arrow">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
            <path d="M7 10l5 5 5-5z"></path>
          </svg>
        </div>
      </div>
      
      {helperText && (
        <p className={`trustbridge-select-helper-text ${error ? 'trustbridge-select-helper-text-error' : ''}`}>
          {helperText}
        </p>
      )}
    </div>
  );
};

export default Select; 