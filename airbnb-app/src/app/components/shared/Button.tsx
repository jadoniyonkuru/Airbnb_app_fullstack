interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}: ButtonProps) {
  const base = 'inline-flex items-center justify-center rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed';

  const variants: Record<string, string> = {
    primary:   'bg-[#FF5A5F] text-white hover:bg-[#e04e53]',
    secondary: 'bg-[#F7F7F7] text-[#1C1C1E] hover:bg-[#EBEBEB]',
    outline:   'border-2 border-[#1C1C1E] text-[#1C1C1E] hover:bg-[#1C1C1E] hover:text-white',
    ghost:     'text-[#1C1C1E] hover:bg-[#F7F7F7]',
  };

  const sizes: Record<string, string> = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
