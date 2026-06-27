import * as React from 'react';

interface NeonButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  isLoading?: boolean;
}

export const NeonButton: React.FC<NeonButtonProps> = ({
  variant = 'primary',
  isLoading = false,
  className = '',
  children,
  ...props
}) => {
  const baseClasses = 'relative inline-flex items-center justify-center px-6 py-3 font-bold rounded-lg transition-all duration-300 outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-sumi-ink';
  
  const variants = {
    primary: 'bg-spring-green text-sumi-ink hover:bg-spring-green/90 hover:shadow-[0_0_15px_var(--color-spring-green)] focus:ring-spring-green',
    secondary: 'bg-dragon-blue text-sumi-ink hover:bg-dragon-blue/90 hover:shadow-[0_0_15px_var(--color-dragon-blue)] focus:ring-dragon-blue'
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${isLoading ? 'opacity-75 cursor-not-allowed' : ''} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <span className="absolute inset-0 flex items-center justify-center">
          <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </span>
      ) : null}
      <span className={isLoading ? 'invisible' : ''}>{children}</span>
    </button>
  );
};
