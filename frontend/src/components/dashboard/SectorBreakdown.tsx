import React, { useState } from 'react';
import { SECTOR_BENCHMARKS } from '../../data/mockAnalytics';
import type { SectorBenchmark, SectorType } from '../../types';
import { ArrowUpDown, AlertTriangle, CheckCircle } from 'lucide-react';

interface SectorBreakdownProps {
  onSelectSector?: (sector: SectorType) => void;
}

export const SectorBreakdown: React.FC<SectorBreakdownProps> = ({ onSelectSector }) => {
  const [sortField, setSortField] = useState<keyof SectorBenchmark>('totalApprovedCostCr');
  const [sortAsc, setSortAsc] = useState<boolean>(false);

  const sortedSectors = [...SECTOR_BENCHMARKS].sort((a, b) => {
    const valA = a[sortField];
    const valB = b[sortField];
    if (typeof valA === 'number' && typeof valB === 'number') {
      return sortAsc ? valA - valB : valB - valA;
    }
    return 0;
  });

  const handleSort = (field: keyof SectorBenchmark) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <div>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Sectoral Portfolio & Risk Profile
          </h4>
          <p style={{ fontSize: '0.74rem', color: 'var(--text-tertiary)', marginTop: '2px' }}>
            Comparative expenditure, cost overrun variance, and top bottleneck drivers across 22 sectors
          </p>
        </div>
        <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
          Click row to filter
        </span>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-tertiary)' }}>
              <th style={{ padding: '8px 10px', fontWeight: 600 }}>Sector</th>
              <th 
                onClick={() => handleSort('activeProjectsCount')}
                style={{ padding: '8px 10px', fontWeight: 600, cursor: 'pointer' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Projects <ArrowUpDown size={12} />
                </div>
              </th>
              <th 
                onClick={() => handleSort('totalApprovedCostCr')}
                style={{ padding: '8px 10px', fontWeight: 600, cursor: 'pointer' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Approved Cost <ArrowUpDown size={12} />
                </div>
              </th>
              <th 
                onClick={() => handleSort('avgCostOverrunPercent')}
                style={{ padding: '8px 10px', fontWeight: 600, cursor: 'pointer' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Avg Cost Overrun <ArrowUpDown size={12} />
                </div>
              </th>
              <th 
                onClick={() => handleSort('avgScheduleDelayMonths')}
                style={{ padding: '8px 10px', fontWeight: 600, cursor: 'pointer' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Avg Delay <ArrowUpDown size={12} />
                </div>
              </th>
              <th 
                onClick={() => handleSort('highRiskProjectsCount')}
                style={{ padding: '8px 10px', fontWeight: 600, cursor: 'pointer' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Critical Flags <ArrowUpDown size={12} />
                </div>
              </th>
              <th style={{ padding: '8px 10px', fontWeight: 600 }}>Primary Bottleneck</th>
            </tr>
          </thead>
          <tbody>
            {sortedSectors.map((sector) => {
              const isOverrunSevere = sector.avgCostOverrunPercent > 25;
              const isDelaySevere = sector.avgScheduleDelayMonths > 30;

              return (
                <tr 
                  key={sector.sector}
                  onClick={() => onSelectSector && onSelectSector(sector.sector)}
                  style={{
                    borderBottom: '1px solid var(--border-subtle)',
                    cursor: onSelectSector ? 'pointer' : 'default',
                    transition: 'background var(--transition-fast)'
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.background = 'var(--bg-tertiary)')}
                  onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <td style={{ padding: '10px 10px', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {sector.sector}
                  </td>
                  <td className="num-mono" style={{ padding: '10px 10px', color: 'var(--text-secondary)' }}>
                    {sector.activeProjectsCount}
                  </td>
                  <td className="num-mono" style={{ padding: '10px 10px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    ₹{(sector.totalApprovedCostCr / 1000).toFixed(1)}k Cr
                  </td>
                  <td className="num-mono" style={{ padding: '10px 10px' }}>
                    <span style={{
                      color: isOverrunSevere ? 'var(--accent-rose)' : 'var(--accent-emerald)',
                      fontWeight: 700
                    }}>
                      +{sector.avgCostOverrunPercent}%
                    </span>
                  </td>
                  <td className="num-mono" style={{ padding: '10px 10px' }}>
                    <span style={{
                      color: isDelaySevere ? 'var(--accent-amber)' : 'var(--text-secondary)',
                      fontWeight: 600
                    }}>
                      {sector.avgScheduleDelayMonths} mo
                    </span>
                  </td>
                  <td style={{ padding: '10px 10px' }}>
                    {sector.highRiskProjectsCount > 0 ? (
                      <span className="badge badge-critical" style={{ fontSize: '0.7rem' }}>
                        <AlertTriangle size={11} /> {sector.highRiskProjectsCount}
                      </span>
                    ) : (
                      <span className="badge badge-low" style={{ fontSize: '0.7rem' }}>
                        <CheckCircle size={11} /> 0
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '10px 10px', color: 'var(--text-tertiary)', fontSize: '0.74rem' }}>
                    {sector.topBottleneck}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
