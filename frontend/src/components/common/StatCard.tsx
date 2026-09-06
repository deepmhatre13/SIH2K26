import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color?: 'cyan' | 'emerald' | 'amber' | 'rose' | 'blue' | 'indigo';
  deltaText?: string;
  deltaType?: 'positive' | 'negative' | 'neutral';
  tooltip?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'cyan',
  deltaText,
  deltaType = 'neutral',
  tooltip
}) => {
  const colorMap = {
    cyan: { text: 'var(--accent-cyan)', bg: 'rgba(6, 182, 212, 0.12)', border: 'rgba(6, 182, 212, 0.25)' },
    emerald: { text: 'var(--accent-emerald)', bg: 'rgba(16, 185, 129, 0.12)', border: 'rgba(16, 185, 129, 0.25)' },
    amber: { text: 'var(--accent-amber)', bg: 'rgba(245, 158, 11, 0.12)', border: 'rgba(245, 158, 11, 0.25)' },
    rose: { text: 'var(--accent-rose)', bg: 'rgba(239, 68, 68, 0.12)', border: 'rgba(239, 68, 68, 0.25)' },
    blue: { text: 'var(--accent-blue)', bg: 'rgba(59, 130, 246, 0.12)', border: 'rgba(59, 130, 246, 0.25)' },
    indigo: { text: 'var(--accent-indigo)', bg: 'rgba(99, 102, 241, 0.12)', border: 'rgba(99, 102, 241, 0.25)' }
  };

  const themeColors = colorMap[color];

  return (
    <div 
      className="glass-panel glass-panel-interactive" 
      style={{
        padding: '18px 20px',
        position: 'relative',
        overflow: 'hidden'
      }}
      title={tooltip}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          {title}
        </span>
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '10px',
          background: themeColors.bg,
          border: `1px solid ${themeColors.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: themeColors.text
        }}>
          <Icon size={18} />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '4px' }}>
        <div className="num-mono" style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.1 }}>
          {value}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px' }}>
        {subtitle && (
          <span style={{ fontSize: '0.74rem', color: 'var(--text-tertiary)' }}>
            {subtitle}
          </span>
        )}

        {deltaText && (
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '3px',
            fontSize: '0.72rem',
            fontWeight: 700,
            padding: '2px 7px',
            borderRadius: 'var(--radius-full)',
            background: deltaType === 'positive' 
              ? 'rgba(16, 185, 129, 0.15)' 
              : deltaType === 'negative' 
                ? 'rgba(239, 68, 68, 0.15)' 
                : 'rgba(255, 255, 255, 0.08)',
            color: deltaType === 'positive' 
              ? 'var(--accent-emerald)' 
              : deltaType === 'negative' 
                ? 'var(--accent-rose)' 
                : 'var(--text-secondary)'
          }}>
            {deltaType === 'positive' && <TrendingUp size={12} />}
            {deltaType === 'negative' && <TrendingDown size={12} />}
            {deltaText}
          </span>
        )}
      </div>
    </div>
  );
};
