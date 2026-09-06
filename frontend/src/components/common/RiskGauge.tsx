import React from 'react';

interface RiskGaugeProps {
  score: number; // 0 - 100
  size?: number;
  label?: string;
  sublabel?: string;
}

export const RiskGauge: React.FC<RiskGaugeProps> = ({
  score,
  size = 180,
  label = 'Composite Risk (PCRI)',
  sublabel
}) => {
  const normalizedScore = Math.max(0, Math.min(100, score));

  // Determine risk zone color
  let color = 'var(--accent-emerald)';
  let zoneText = 'LOW RISK';
  let zoneClass = 'badge-low';

  if (normalizedScore > 80) {
    color = 'var(--accent-rose)';
    zoneText = 'CRITICAL';
    zoneClass = 'badge-critical';
  } else if (normalizedScore > 65) {
    color = 'var(--accent-amber)';
    zoneText = 'HIGH RISK';
    zoneClass = 'badge-high';
  } else if (normalizedScore > 35) {
    color = 'var(--accent-blue)';
    zoneText = 'MODERATE';
    zoneClass = 'badge-moderate';
  }

  // Semicircle gauge calculation
  const radius = 70;
  const strokeWidth = 14;
  // Circumference of full circle
  const circumference = Math.PI * radius; // for semicircle (180 deg)
  const strokeDashoffset = circumference - (normalizedScore / 100) * circumference;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ position: 'relative', width: size, height: size * 0.65 }}>
        <svg 
          viewBox="0 0 180 115" 
          width={size} 
          height={size * 0.65}
          style={{ overflow: 'visible' }}
        >
          {/* Background track (zones) */}
          <path
            d="M 20 90 A 70 70 0 0 1 160 90"
            fill="none"
            stroke="var(--bg-tertiary)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Color active arc */}
          <path
            d="M 20 90 A 70 70 0 0 1 160 90"
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{
              transition: 'stroke-dashoffset 0.8s cubic-bezier(0.16, 1, 0.3, 1), stroke 0.4s ease',
              filter: `drop-shadow(0 0 8px ${color})`
            }}
          />

          {/* Center score readout */}
          <text
            x="90"
            y="82"
            textAnchor="middle"
            fill="var(--text-primary)"
            fontSize="28"
            fontWeight="800"
            fontFamily="var(--font-mono)"
          >
            {normalizedScore}
          </text>
          <text
            x="90"
            y="98"
            textAnchor="middle"
            fill="var(--text-tertiary)"
            fontSize="10"
            fontWeight="600"
            letterSpacing="0.05em"
          >
            / 100
          </text>
        </svg>
      </div>

      <div style={{ textAlign: 'center', marginTop: '6px' }}>
        <span className={`badge ${zoneClass}`} style={{ marginBottom: '4px' }}>
          {zoneText}
        </span>
        <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
          {label}
        </div>
        {sublabel && (
          <div style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', marginTop: '2px' }}>
            {sublabel}
          </div>
        )}
      </div>
    </div>
  );
};
