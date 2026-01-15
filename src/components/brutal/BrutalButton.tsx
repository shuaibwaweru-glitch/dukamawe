// src/components/brutal/BrutalButton.tsx
import React from 'react';

interface BrutalButtonProps {
  /** Button text or content */
  children: React.ReactNode;
  /** Visual style variant */
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'success';
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Make button full width */
  fullWidth?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Button type */
  type?: 'button' | 'submit' | 'reset';
  /** Click handler */
  onClick?: () => void;
  /** Custom className */
  className?: string;
}

/**
 * Brutal Button Component
 * 
 * A bold, high-contrast button with thick borders and offset shadows.
 * 
 * @example
 * ```tsx
 * <BrutalButton variant="primary" onClick={handleClick}>
 *   CLICK ME
 * </BrutalButton>
 * ```
 */
export const BrutalButton: React.FC<BrutalButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  type = 'button',
  onClick,
  className = ''
}) => {
  const classes = [
    'btn-brutal',
    `btn-brutal-${variant}`,
    size !== 'md' && `btn-brutal-${size}`,
    fullWidth && 'btn-brutal-full',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default BrutalButton;