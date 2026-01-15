// src/components/brutal/BrutalCard.tsx
import React from 'react';

interface BrutalCardProps {
  /** Card content */
  children: React.ReactNode;
  /** Card variant */
  variant?: 'default' | 'flat' | 'no-hover';
  /** Accent color on left border */
  accent?: 'orange' | 'yellow' | 'green' | 'blue' | null;
  /** Enable hover effect */
  hover?: boolean;
  /** Custom className */
  className?: string;
  /** Click handler */
  onClick?: () => void;
}

/**
 * Brutal Card Component
 * 
 * A bold card with thick borders and offset shadows.
 * 
 * @example
 * ```tsx
 * <BrutalCard accent="orange">
 *   <h3 className="h3-brutal">CARD TITLE</h3>
 *   <p>Card content goes here</p>
 * </BrutalCard>
 * ```
 */
export const BrutalCard: React.FC<BrutalCardProps> = ({
  children,
  variant = 'default',
  accent = null,
  hover = true,
  className = '',
  onClick
}) => {
  const classes = [
    variant === 'flat' ? 'card-brutal-flat' : 
    variant === 'no-hover' ? 'card-brutal-no-hover' : 
    'card-brutal',
    accent && `card-brutal-accent-${accent}`,
    className
  ].filter(Boolean).join(' ');

  const cardProps = {
    className: classes,
    ...(onClick && { 
      onClick, 
      style: { cursor: 'pointer' } 
    })
  };

  return (
    <div {...cardProps}>
      {children}
    </div>
  );
};

interface MetricCardProps {
  /** Metric value (number or string) */
  value: string | number;
  /** Metric label */
  label: string;
  /** Change indicator (e.g., "+3 THIS WEEK") */
  change?: string;
  /** Is change positive? */
  changePositive?: boolean;
  /** Icon emoji */
  icon?: string;
  /** Accent color */
  accent?: 'orange' | 'yellow' | 'green' | 'blue';
  /** Click handler */
  onClick?: () => void;
}

/**
 * Metric Card Component
 * 
 * A specialized card for displaying metrics/statistics.
 * 
 * @example
 * ```tsx
 * <MetricCard
 *   icon="📦"
 *   value={12}
 *   label="ACTIVE ORDERS"
 *   change="+3 THIS WEEK"
 *   changePositive={true}
 *   accent="orange"
 * />
 * ```
 */
export const MetricCard: React.FC<MetricCardProps> = ({
  value,
  label,
  change,
  changePositive,
  icon,
  accent = 'orange',
  onClick
}) => {
  return (
    <BrutalCard 
      accent={accent} 
      variant="no-hover" 
      onClick={onClick}
      className="metric-card-brutal"
    >
      <div style={{ position: 'relative' }}>
        {icon && (
          <div style={{
            position: 'absolute',
            right: '24px',
            top: '0',
            fontSize: '48px',
            filter: 'grayscale(100%)',
            opacity: 0.3
          }}>
            {icon}
          </div>
        )}
        
        <div style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'clamp(32px, 5vw, 48px)',
          fontWeight: 700,
          color: 'var(--brutal-black)',
          lineHeight: 1,
          marginBottom: '8px'
        }}>
          {value}
        </div>
        
        <div style={{
          fontFamily: 'var(--font-body)',
          fontSize: '12px',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '1px',
          color: '#666666',
          marginBottom: change ? '8px' : 0
        }}>
          {label}
        </div>
        
        {change && (
          <div style={{
            fontFamily: 'var(--font-body)',
            fontSize: '14px',
            fontWeight: 600,
            color: changePositive ? '#00AA00' : '#999999'
          }}>
            {change}
          </div>
        )}
      </div>
    </BrutalCard>
  );
};

export default BrutalCard;