import React, { useState } from 'react';
import { HISTORICAL_S_CURVE_DATA } from '../../data/mockAnalytics';

export const InteractiveSCurve: React.FC = () => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const data = HISTORICAL_S_CURVE_DATA;
  const width = 680;
  const height = 240;
  const padding = { top: 25, right: 30, bottom: 35, left: 45 };

  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const getX = (index: number) => padding.left + (index / (data.length - 1)) * chartWidth;
  const getY = (val: number) => padding.top + chartHeight - (val / 100) * chartHeight;

  // Generate SVG path strings
  const plannedPhysicalPath = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.plannedPhysical)}`).join(' ');
  const actualPhysicalPath = data.slice(0, 7).map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.actualPhysical)}`).join(' ');
  const aiPredictedPhysicalPath = data.slice(6).map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i + 6)} ${getY(d.actualPhysical)}`).join(' ');

  const plannedFinancialPath = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.plannedFinancial)}`).join(' ');
  const actualFinancialPath = data.slice(0, 7).map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.actualFinancial)}`).join(' ');

  return (
    <div className="glass-panel" style={{ padding: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <div>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            Portfolio Progress S-Curve & AI Trajectory
            <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>AI Forecast Enabled</span>
          </h4>
          <p style={{ fontSize: '0.74rem', color: 'var(--text-tertiary)', marginTop: '2px' }}>
            Tracking Physical vs. Financial burn rate against sanction milestones and ML predicted completion
          </p>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '0.72rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '12px', height: '2px', background: 'var(--text-muted)' }} />
            <span style={{ color: 'var(--text-secondary)' }}>Baseline Plan</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '12px', height: '3px', background: 'var(--accent-cyan)' }} />
            <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Actual Physical %</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '12px', height: '3px', background: 'var(--accent-amber)', borderStyle: 'dashed' }} />
            <span style={{ color: 'var(--text-secondary)' }}>Actual Financial %</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '12px', height: '2px', background: 'var(--accent-emerald)', borderTop: '2px dashed var(--accent-emerald)' }} />
            <span style={{ color: 'var(--accent-emerald)', fontWeight: 600 }}>AI Predicted Trajectory</span>
          </div>
        </div>
      </div>

      <div style={{ width: '100%', overflowX: 'auto' }}>
        <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 'auto', minWidth: '540px' }}>
          {/* Horizontal Grid lines */}
          {[0, 25, 50, 75, 100].map(val => (
            <g key={val}>
              <line
                x1={padding.left}
                y1={getY(val)}
                x2={width - padding.right}
                y2={getY(val)}
                stroke="var(--border-subtle)"
                strokeDasharray="3 3"
              />
              <text
                x={padding.left - 8}
                y={getY(val) + 4}
                textAnchor="end"
                fill="var(--text-tertiary)"
                fontSize="10"
                fontFamily="var(--font-mono)"
              >
                {val}%
              </text>
            </g>
          ))}

          {/* Vertical Time Month lines */}
          {data.map((d, i) => (
            <text
              key={d.month}
              x={getX(i)}
              y={height - 10}
              textAnchor="middle"
              fill={i === 6 ? 'var(--accent-cyan)' : 'var(--text-tertiary)'}
              fontWeight={i === 6 ? 700 : 400}
              fontSize="10"
              fontFamily="var(--font-mono)"
            >
              {d.month}
            </text>
          ))}

          {/* Current Month Vertical Marker */}
          <line
            x1={getX(6)}
            y1={padding.top}
            x2={getX(6)}
            y2={height - padding.bottom}
            stroke="var(--accent-cyan)"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            opacity="0.8"
          />

          {/* Planned Paths (Grey) */}
          <path d={plannedPhysicalPath} fill="none" stroke="var(--text-muted)" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6" />
          <path d={plannedFinancialPath} fill="none" stroke="var(--text-tertiary)" strokeWidth="1.2" opacity="0.4" />

          {/* Actual Financial Path (Amber) */}
          <path d={actualFinancialPath} fill="none" stroke="var(--accent-amber)" strokeWidth="2.5" />

          {/* Actual Physical Path (Cyan) */}
          <path d={actualPhysicalPath} fill="none" stroke="var(--accent-cyan)" strokeWidth="3" />

          {/* AI Predicted Physical Trajectory (Emerald dashed) */}
          <path d={aiPredictedPhysicalPath} fill="none" stroke="var(--accent-emerald)" strokeWidth="2.5" strokeDasharray="5 5" />

          {/* Interactive Data Points */}
          {data.map((d, i) => (
            <g key={i} onMouseEnter={() => setHoverIndex(i)} onMouseLeave={() => setHoverIndex(null)} style={{ cursor: 'pointer' }}>
              <circle
                cx={getX(i)}
                y={getY(d.actualPhysical)}
                r={hoverIndex === i ? 6 : (i === 6 ? 5 : 3.5)}
                fill={i > 6 ? 'var(--accent-emerald)' : 'var(--accent-cyan)'}
                stroke="var(--bg-secondary)"
                strokeWidth="2"
              />
              <circle
                cx={getX(i)}
                y={getY(d.actualFinancial)}
                r={hoverIndex === i ? 5 : 3}
                fill="var(--accent-amber)"
                stroke="var(--bg-secondary)"
                strokeWidth="1.5"
              />
            </g>
          ))}

          {/* Hover Tooltip Card in SVG */}
          {hoverIndex !== null && (
            <g transform={`translate(${Math.min(getX(hoverIndex), width - 180)}, ${getY(data[hoverIndex].actualPhysical) - 50})`}>
              <rect
                x="0"
                y="0"
                width="160"
                height="54"
                rx="6"
                fill="var(--bg-card)"
                stroke="var(--accent-cyan)"
                strokeWidth="1"
                filter="drop-shadow(0 4px 8px rgba(0,0,0,0.5))"
              />
              <text x="10" y="16" fill="var(--text-primary)" fontSize="11" fontWeight="700">
                {data[hoverIndex].month}
              </text>
              <text x="10" y="32" fill="var(--accent-cyan)" fontSize="10" fontWeight="600">
                Physical: {data[hoverIndex].actualPhysical}%
              </text>
              <text x="10" y="46" fill="var(--accent-amber)" fontSize="10" fontWeight="600">
                Financial: {data[hoverIndex].actualFinancial}%
              </text>
            </g>
          )}
        </svg>
      </div>
    </div>
  );
};
