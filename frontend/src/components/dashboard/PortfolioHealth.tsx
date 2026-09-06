import React from 'react';
import { MACRO_PORTFOLIO_STATS } from '../../data/mockAnalytics';

export const PortfolioHealth: React.FC = () => {
  const stats = MACRO_PORTFOLIO_STATS;

  const greenPct = ((stats.projectsInGreenNormal / stats.totalMonitoredProjects) * 100).toFixed(1);
  const amberPct = ((stats.projectsInAmberAlert / stats.totalMonitoredProjects) * 100).toFixed(1);
  const redPct = ((stats.projectsInRedAlert / stats.totalMonitoredProjects) * 100).toFixed(1);

  const delayBins = [
    { range: 'On Schedule (0 mo)', count: stats.projectsWithoutDelay, color: 'var(--accent-emerald)', pct: ((stats.projectsWithoutDelay / stats.totalMonitoredProjects) * 100).toFixed(0) },
    { range: '1 - 12 Months', count: 312, color: 'var(--accent-blue)', pct: '15' },
    { range: '13 - 24 Months', count: 246, color: 'var(--accent-cyan)', pct: '12' },
    { range: '25 - 48 Months', count: 184, color: 'var(--accent-amber)', pct: '9' },
    { range: '> 48 Months (Chronic)', count: 100, color: 'var(--accent-rose)', pct: '5' }
  ];

  return (
    <div className="glass-panel" style={{ padding: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Portfolio Health & Risk Distribution
          </h4>
          <p style={{ fontSize: '0.74rem', color: 'var(--text-tertiary)', marginTop: '2px' }}>
            Risk classification generated across 1,981 projects by PAIMANA early warning algorithms
          </p>
        </div>
        <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>
          Real-Time Assessment
        </span>
      </div>

      {/* Multi-segment Progress Bar */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{
          display: 'flex',
          height: '10px',
          borderRadius: 'var(--radius-full)',
          overflow: 'hidden',
          background: 'var(--bg-tertiary)',
          gap: '2px',
          marginBottom: '8px'
        }}>
          <div style={{ width: `${greenPct}%`, background: 'var(--accent-emerald)', transition: 'width 0.6s ease' }} title={`Normal: ${greenPct}%`} />
          <div style={{ width: `${amberPct}%`, background: 'var(--accent-amber)', transition: 'width 0.6s ease' }} title={`At Risk: ${amberPct}%`} />
          <div style={{ width: `${redPct}%`, background: 'var(--accent-rose)', transition: 'width 0.6s ease' }} title={`Critical: ${redPct}%`} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-emerald)' }} />
            <span style={{ color: 'var(--text-secondary)' }}>On Track (Normal): </span>
            <strong className="num-mono" style={{ color: 'var(--text-primary)' }}>{stats.projectsInGreenNormal} ({greenPct}%)</strong>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-amber)' }} />
            <span style={{ color: 'var(--text-secondary)' }}>At Risk (Amber): </span>
            <strong className="num-mono" style={{ color: 'var(--text-primary)' }}>{stats.projectsInAmberAlert} ({amberPct}%)</strong>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-rose)' }} />
            <span style={{ color: 'var(--text-secondary)' }}>Critical (Red): </span>
            <strong className="num-mono" style={{ color: 'var(--accent-rose)' }}>{stats.projectsInRedAlert} ({redPct}%)</strong>
          </div>
        </div>
      </div>

      {/* Schedule Delay Buckets */}
      <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            Schedule Delay Distribution (Months)
          </span>
          <span style={{ fontSize: '0.72rem', color: 'var(--accent-amber)', fontWeight: 600 }}>
            Avg Delay: {stats.avgTimeOverrunMonths} Mo
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {delayBins.map((bin, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.75rem' }}>
              <span style={{ width: '130px', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{bin.range}</span>
              <div style={{ flex: 1, height: '6px', background: 'var(--bg-tertiary)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${bin.pct}%`, height: '100%', background: bin.color, borderRadius: '3px' }} />
              </div>
              <span className="num-mono" style={{ width: '60px', textAlign: 'right', fontWeight: 700, color: 'var(--text-primary)' }}>
                {bin.count}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
