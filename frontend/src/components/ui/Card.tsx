import React from 'react';
import theme from '../../styles/theme';
import './Card.css';

export type CardVariant = 'elevated' | 'outlined' | 'filled';

export interface CardProps {
  variant?: CardVariant;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  variant = 'elevated',
  className,
  children,
  onClick,
}) => {
  const getClassName = () => {
    let baseClass = 'trustbridge-card';
    if (variant) baseClass += ` trustbridge-card-${variant}`;
    if (onClick) baseClass += ' trustbridge-card-clickable';
    if (className) baseClass += ` ${className}`;
    return baseClass;
  };

  return (
    <div className={getClassName()} onClick={onClick}>
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{
  title: React.ReactNode;
  subheader?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}> = ({ title, subheader, action, className }) => {
  const headerClass = `trustbridge-card-header ${className || ''}`;
  
  return (
    <div className={headerClass}>
      <div className="trustbridge-card-header-content">
        <div className="trustbridge-card-header-title">{title}</div>
        {subheader && <div className="trustbridge-card-header-subheader">{subheader}</div>}
      </div>
      {action && <div className="trustbridge-card-header-action">{action}</div>}
    </div>
  );
};

export const CardContent: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  const contentClass = `trustbridge-card-content ${className || ''}`;
  
  return <div className={contentClass}>{children}</div>;
};

export const CardFooter: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  const footerClass = `trustbridge-card-footer ${className || ''}`;
  
  return <div className={footerClass}>{children}</div>;
};

export default Card; 