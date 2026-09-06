import React, { useState } from 'react';
import { MINISTRY_BENCHMARKS, AGENCY_BENCHMARKS } from '../../data/mockAnalytics';
import { Compass } from 'lucide-react';

export const BenchmarkAnalytics: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'ministries' | 'agencies'>('ministries');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Compass size={22} color="var(--accent-cyan)" />
            Benchmarking & Comparative Analytics Module
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Cross-ministerial, sectoral, and implementing agency peer comparison across 1,981 monitored infrastructure projects
          </p>
        </div>

        {/* Sub-tab selector */}
        <div style={{
          display: 'flex',
          background: 'var(--bg-tertiary)',
          padding: '4px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)'
        }}>
          <button
            onClick={() => setActiveSubTab('ministries')}
            style={{
              padding: '6px 16px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background: activeSubTab === 'ministries' ? 'var(--accent-cyan)' : 'transparent',
              color: activeSubTab === 'ministries' ? '#070c18' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.78rem',
              cursor: 'pointer'
            }}
          >
            Ministerial Performance (17 Central Ministries)
          </button>
          <button
            onClick={() => setActiveSubTab('agencies')}
            style={{
              padding: '6px 16px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background: activeSubTab === 'agencies' ? 'var(--accent-cyan)' : 'transparent',
              color: activeSubTab === 'agencies' ? '#070c18' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.78rem',
              cursor: 'pointer'
            }}
          >
            Implementing Agency Scorecard (PSUs / SPVs)
          </button>
        </div>
      </div>

      {/* Mode 1: Ministries Benchmark */}
      {activeSubTab === 'ministries' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Comparative Cards */}
          <div className="glass-panel" style={{ padding: '20px' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '14px' }}>
              Ministry-Wise Budget Outlay, Overruns & Efficiency Rating
            </h4>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-medium)', color: 'var(--text-tertiary)' }}>
                    <th style={{ padding: '10px 12px', fontWeight: 700 }}>Ministry Name</th>
                    <th style={{ padding: '10px 12px', fontWeight: 700 }}>Short Code</th>
                    <th style={{ padding: '10px 12px', fontWeight: 700 }}>Projects</th>
                    <th style={{ padding: '10px 12px', fontWeight: 700 }}>Budget Outlay</th>
                    <th style={{ padding: '10px 12px', fontWeight: 700 }}>Cumulative Spend</th>
                    <th style={{ padding: '10px 12px', fontWeight: 700 }}>Cost Overrun %</th>
                    <th style={{ padding: '10px 12px', fontWeight: 700 }}>Avg Delay</th>
                    <th style={{ padding: '10px 12px', fontWeight: 700 }}>Efficiency Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {MINISTRY_BENCHMARKS.map((m) => {
                    return (
                      <tr 
                        key={m.shortCode}
                        style={{ borderBottom: '1px solid var(--border-subtle)' }}
                      >
                        <td style={{ padding: '12px 12px', fontWeight: 700, color: 'var(--text-primary)' }}>
                          {m.ministry}
                        </td>
                        <td style={{ padding: '12px 12px', color: 'var(--accent-cyan)', fontWeight: 700 }}>
                          {m.shortCode}
                        </td>
                        <td className="num-mono" style={{ padding: '12px 12px' }}>
                          {m.projectCount}
                        </td>
                        <td className="num-mono" style={{ padding: '12px 12px', fontWeight: 600 }}>
                          ₹{(m.budgetOutlayCr / 1000).toFixed(1)}k Cr
                        </td>
                        <td className="num-mono" style={{ padding: '12px 12px' }}>
                          ₹{(m.expenditureCr / 1000).toFixed(1)}k Cr
                        </td>
                        <td className="num-mono" style={{ padding: '12px 12px' }}>
                          <span style={{
                            color: m.costOverrunPercent > 25 ? 'var(--accent-rose)' : 'var(--accent-emerald)',
                            fontWeight: 700
                          }}>
                            +{m.costOverrunPercent}%
                          </span>
                        </td>
                        <td className="num-mono" style={{ padding: '12px 12px', color: m.avgDelayMonths > 30 ? 'var(--accent-amber)' : 'var(--text-secondary)' }}>
                          {m.avgDelayMonths} months
                        </td>
                        <td style={{ padding: '12px 12px' }}>
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            fontWeight: 800,
                            fontSize: '0.8rem',
                            background: m.efficiencyRating === 'A+' || m.efficiencyRating === 'A' 
                              ? 'rgba(16, 185, 129, 0.2)' 
                              : m.efficiencyRating === 'B' 
                                ? 'rgba(59, 130, 246, 0.2)' 
                                : 'rgba(239, 68, 68, 0.2)',
                            color: m.efficiencyRating === 'A+' || m.efficiencyRating === 'A'
                              ? 'var(--accent-emerald)'
                              : m.efficiencyRating === 'B'
                                ? 'var(--accent-blue)'
                                : 'var(--accent-rose)',
                            border: `1px solid ${
                              m.efficiencyRating === 'A+' || m.efficiencyRating === 'A'
                                ? 'var(--accent-emerald)'
                                : m.efficiencyRating === 'B'
                                  ? 'var(--accent-blue)'
                                  : 'var(--accent-rose)'
                            }`
                          }}>
                            {m.efficiencyRating}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Mode 2: Agency Scorecard */}
      {activeSubTab === 'agencies' && (
        <div className="glass-panel" style={{ padding: '20px' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '14px' }}>
            Implementing Agency Delivery Scorecard (NHAI, RVNL, NTPC, ONGC, PGCIL, etc.)
          </h4>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-medium)', color: 'var(--text-tertiary)' }}>
                  <th style={{ padding: '10px 12px', fontWeight: 700 }}>Implementing Agency</th>
                  <th style={{ padding: '10px 12px', fontWeight: 700 }}>Primary Sector</th>
                  <th style={{ padding: '10px 12px', fontWeight: 700 }}>Projects Monitored</th>
                  <th style={{ padding: '10px 12px', fontWeight: 700 }}>Portfolio Value</th>
                  <th style={{ padding: '10px 12px', fontWeight: 700 }}>Average Delay</th>
                  <th style={{ padding: '10px 12px', fontWeight: 700 }}>Cost Variance %</th>
                  <th style={{ padding: '10px 12px', fontWeight: 700 }}>Delivery Performance Score</th>
                </tr>
              </thead>
              <tbody>
                {AGENCY_BENCHMARKS.map((agency) => (
                  <tr 
                    key={agency.agencyName}
                    style={{ borderBottom: '1px solid var(--border-subtle)' }}
                  >
                    <td style={{ padding: '12px 12px', fontWeight: 800, color: 'var(--text-primary)' }}>
                      {agency.agencyName}
                    </td>
                    <td style={{ padding: '12px 12px', color: 'var(--text-secondary)' }}>
                      {agency.sector}
                    </td>
                    <td className="num-mono" style={{ padding: '12px 12px' }}>
                      {agency.projectsMonitored}
                    </td>
                    <td className="num-mono" style={{ padding: '12px 12px', fontWeight: 600 }}>
                      ₹{(agency.portfolioValueCr / 1000).toFixed(1)}k Cr
                    </td>
                    <td className="num-mono" style={{ padding: '12px 12px', color: agency.avgDelayMonths > 30 ? 'var(--accent-amber)' : 'var(--text-secondary)' }}>
                      {agency.avgDelayMonths} months
                    </td>
                    <td className="num-mono" style={{ padding: '12px 12px' }}>
                      <span style={{
                        color: agency.costVariancePercent > 20 ? 'var(--accent-rose)' : 'var(--accent-emerald)',
                        fontWeight: 700
                      }}>
                        +{agency.costVariancePercent}%
                      </span>
                    </td>
                    <td style={{ padding: '12px 12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ flex: 1, height: '8px', background: 'var(--bg-tertiary)', borderRadius: '4px', overflow: 'hidden', minWidth: '80px' }}>
                          <div style={{
                            width: `${agency.performanceScore}%`,
                            height: '100%',
                            background: agency.performanceScore > 85 ? 'var(--accent-emerald)' : agency.performanceScore > 70 ? 'var(--accent-cyan)' : 'var(--accent-amber)',
                            borderRadius: '4px'
                          }} />
                        </div>
                        <span className="num-mono" style={{ fontWeight: 800, fontSize: '0.82rem', color: 'var(--text-primary)' }}>
                          {agency.performanceScore}/100
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
