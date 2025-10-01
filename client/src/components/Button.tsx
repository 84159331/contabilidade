import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  ...props 
}) => {
  const baseClasses = 'flex items-center justify-center gap-2 font-bold rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variantClasses = {
    primary: 'text-white bg-primary-600 hover:bg-primary-700 focus:ring-primary-500',
    secondary: 'text-gray-900 bg-gray-200 hover:bg-gray-300 focus:ring-gray-400',
    danger: 'text-white bg-danger-600 hover:bg-danger-700 focus:ring-danger-500',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const disabledClasses = 'disabled:bg-gray-300 disabled:cursor-not-allowed';

  const className = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    disabledClasses,
    props.className
  ].join(' ');

  return (
    <button {...props} className={className}>
      {children}
    </button>
  );
};

export default Button;
