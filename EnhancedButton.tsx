import React from 'react';

interface EnhancedButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  icon?: string;
  fullWidth?: boolean;
  className?: string;
}

const EnhancedButton: React.FC<EnhancedButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  icon,
  fullWidth = false,
  className = ''
}) => {
  const variants = {
    primary: 'bg-gradient-to-r from-[#00c2a0] to-[#00d8b3] hover:from-[#00d8b3] hover:to-[#00e6c0] text-white',
    secondary: 'bg-gradient-to-r from-[#3b82f6] to-[#2563eb] hover:from-[#2563eb] hover:to-[#1d4ed8] text-white',
    success: 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white',
    danger: 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white',
    warning: 'bg-gradient-to-r from-[#f39c12] to-[#e67e22] hover:from-[#e67e22] hover:to-[#d35400] text-white'
  };

  const sizes = {
    small: 'px-4 py-2 text-sm min-h-[44px]',
    medium: 'px-6 py-3 text-base min-h-[56px]',
    large: 'px-8 py-4 text-lg min-h-[64px]'
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'btn-hover cursor-pointer'}
        font-bold rounded-2xl
        flex items-center justify-center gap-3
        shadow-lg
        transition-all duration-200
        active:scale-95
        focus:outline-none focus:ring-4 focus:ring-white/20
        ${className}
      `}
    >
      {icon && <span className="text-2xl">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};

export default EnhancedButton;
