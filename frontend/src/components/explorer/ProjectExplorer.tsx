import React, { useState } from 'react';
import type { Project, SectorType, RiskLevel } from '../../types';
import { Search, Layers, LayoutGrid, List, ChevronRight } from 'lucide-react';

interface ProjectExplorerProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
  initialSectorFilter?: SectorType | 'ALL';
}

export const ProjectExplorer: React.FC<ProjectExplorerProps> = ({
  projects,
  onSelectProject,
  initialSectorFilter = 'ALL'
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState<SectorType | 'ALL'>(initialSectorFilter);
  const [selectedRisk, setSelectedRisk] = useState<RiskLevel | 'ALL'>('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
  const [sortBy, setSortBy] = useState<'cost' | 'delay' | 'risk' | 'name'>('risk');

  const sectors: (SectorType | 'ALL')[] = [
    'ALL',
    'Railways',
    'Roads & Highways',
    'Petroleum & Natural Gas',
    'Power',
    'Coal',
    'Civil Aviation',
    'Urban Development & Metro',
    'Ports & Shipping'
  ];

  const filteredProjects = projects.filter(p => {
    const matchesSearch = 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.implementingAgency.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.paimanaId.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSector = selectedSector === 'ALL' || p.sector === selectedSector;
    const matchesRisk = selectedRisk === 'ALL' || p.riskLevel === selectedRisk;

    return matchesSearch && matchesSector && matchesRisk;
  }).sort((a, b) => {
    if (sortBy === 'cost') return b.predictedFinalCostCr - a.predictedFinalCostCr;
    if (sortBy === 'delay') return b.timeOverrunMonths - a.timeOverrunMonths;
    if (sortBy === 'risk') return b.riskBreakdown.compositeScore - a.riskBreakdown.compositeScore;
    return a.name.localeCompare(b.name);
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers size={22} color="var(--accent-cyan)" />
            National Infrastructure Project Repository (₹150 Cr & Above)
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Surveillance across 1,981 projects with CUF parameter inspection and multi-decade OCMS trajectory
          </p>
        </div>

        {/* View Toggle */}
        <div style={{
          display: 'flex',
          background: 'var(--bg-tertiary)',
          padding: '4px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)'
        }}>
          <button
            onClick={() => setViewMode('table')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background: viewMode === 'table' ? 'var(--accent-cyan)' : 'transparent',
              color: viewMode === 'table' ? '#070c18' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.76rem',
              cursor: 'pointer'
            }}
          >
            <List size={14} />
            <span>Table</span>
          </button>
          <button
            onClick={() => setViewMode('grid')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background: viewMode === 'grid' ? 'var(--accent-cyan)' : 'transparent',
              color: viewMode === 'grid' ? '#070c18' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.76rem',
              cursor: 'pointer'
            }}
          >
            <LayoutGrid size={14} />
            <span>Cards</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="glass-panel" style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Search Box */}
          <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
            <Search size={16} color="var(--text-tertiary)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search projects by title, agency, state, or PAIMANA ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px 8px 36px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                fontSize: '0.8rem',
                outline: 'none'
              }}
            />
          </div>

          {/* Risk Level Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>Risk:</span>
            <select
              value={selectedRisk}
              onChange={(e) => setSelectedRisk(e.target.value as RiskLevel | 'ALL')}
              style={{
                background: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '6px 10px',
                fontSize: '0.78rem',
                outline: 'none'
              }}
            >
              <option value="ALL">All Risk Tiers</option>
              <option value="CRITICAL">Critical (PCRI &gt; 80)</option>
              <option value="HIGH">High (PCRI 65-80)</option>
              <option value="MODERATE">Moderate (PCRI 35-65)</option>
              <option value="LOW">Low (PCRI &lt; 35)</option>
            </select>
          </div>

          {/* Sort By */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'cost' | 'delay' | 'risk' | 'name')}
              style={{
                background: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '6px 10px',
                fontSize: '0.78rem',
                outline: 'none'
              }}
            >
              <option value="risk">Composite Risk Score</option>
              <option value="cost">Anticipated Cost (₹ Cr)</option>
              <option value="delay">Time Delay (Months)</option>
              <option value="name">Project Name (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Sector Filter Chips */}
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '2px' }}>
          {sectors.map(sec => {
            const isSelected = selectedSector === sec;
            return (
              <button
                key={sec}
                onClick={() => setSelectedSector(sec)}
                style={{
                  padding: '4px 12px',
                  borderRadius: 'var(--radius-full)',
                  border: isSelected ? '1px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
                  background: isSelected ? 'rgba(6, 182, 212, 0.15)' : 'var(--bg-secondary)',
                  color: isSelected ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                  fontWeight: isSelected ? 700 : 500,
                  fontSize: '0.74rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                {sec}
              </button>
            );
          })}
        </div>
      </div>

      {/* Mode 1: Table View */}
      {viewMode === 'table' && (
        <div className="glass-panel" style={{ padding: '16px' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-medium)', color: 'var(--text-tertiary)' }}>
                  <th style={{ padding: '10px 10px', fontWeight: 700 }}>Project Title</th>
                  <th style={{ padding: '10px 10px', fontWeight: 700 }}>Sector</th>
                  <th style={{ padding: '10px 10px', fontWeight: 700 }}>Agency</th>
                  <th style={{ padding: '10px 10px', fontWeight: 700 }}>Original Cost</th>
                  <th style={{ padding: '10px 10px', fontWeight: 700 }}>Revised Cost</th>
                  <th style={{ padding: '10px 10px', fontWeight: 700 }}>Cost Overrun %</th>
                  <th style={{ padding: '10px 10px', fontWeight: 700 }}>Schedule Delay</th>
                  <th style={{ padding: '10px 10px', fontWeight: 700 }}>Physical %</th>
                  <th style={{ padding: '10px 10px', fontWeight: 700 }}>PCRI Risk</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map(p => (
                  <tr
                    key={p.id}
                    onClick={() => onSelectProject(p)}
                    style={{
                      borderBottom: '1px solid var(--border-subtle)',
                      cursor: 'pointer',
                      transition: 'background var(--transition-fast)'
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.background = 'var(--bg-tertiary)')}
                    onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <td style={{ padding: '12px 10px', fontWeight: 700, color: 'var(--text-primary)', maxWidth: '280px' }}>
                      <div>{p.name}</div>
                      <div className="num-mono" style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)' }}>{p.paimanaId}</div>
                    </td>
                    <td style={{ padding: '12px 10px', color: 'var(--text-secondary)' }}>
                      {p.sector}
                    </td>
                    <td style={{ padding: '12px 10px', color: 'var(--text-secondary)' }}>
                      {p.implementingAgency.split(' ')[0]}
                    </td>
                    <td className="num-mono" style={{ padding: '12px 10px' }}>
                      ₹{p.originalCostCr.toLocaleString('en-IN')} Cr
                    </td>
                    <td className="num-mono" style={{ padding: '12px 10px', fontWeight: 600 }}>
                      ₹{p.revisedCostCr.toLocaleString('en-IN')} Cr
                    </td>
                    <td className="num-mono" style={{ padding: '12px 10px' }}>
                      <span style={{
                        color: p.costOverrunPercent > 30 ? 'var(--accent-rose)' : 'var(--accent-emerald)',
                        fontWeight: 700
                      }}>
                        +{p.costOverrunPercent.toFixed(1)}%
                      </span>
                    </td>
                    <td className="num-mono" style={{ padding: '12px 10px', color: p.timeOverrunMonths > 24 ? 'var(--accent-amber)' : 'var(--text-secondary)' }}>
                      {p.timeOverrunMonths} mo
                    </td>
                    <td className="num-mono" style={{ padding: '12px 10px', fontWeight: 600, color: 'var(--accent-emerald)' }}>
                      {p.physicalProgressPercent}%
                    </td>
                    <td style={{ padding: '12px 10px' }}>
                      <span className={`badge badge-${p.riskLevel.toLowerCase()}`} style={{ fontSize: '0.68rem' }}>
                        {p.riskLevel} ({p.riskBreakdown.compositeScore})
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Mode 2: Card Grid View */}
      {viewMode === 'grid' && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))',
          gap: '16px'
        }}>
          {filteredProjects.map(p => (
            <div
              key={p.id}
              onClick={() => onSelectProject(p)}
              className="glass-panel glass-panel-interactive"
              style={{
                padding: '18px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderLeft: `4px solid ${
                  p.riskLevel === 'CRITICAL' ? 'var(--accent-rose)' :
                  p.riskLevel === 'HIGH' ? 'var(--accent-amber)' : 'var(--accent-emerald)'
                }`
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>{p.sector}</span>
                  <span className={`badge badge-${p.riskLevel.toLowerCase()}`}>
                    {p.riskLevel} ({p.riskBreakdown.compositeScore})
                  </span>
                </div>

                <h4 style={{
                  fontSize: '0.92rem',
                  fontWeight: 800,
                  color: 'var(--text-primary)',
                  lineHeight: 1.3,
                  marginBottom: '8px',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {p.name}
                </h4>

                <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                  Agency: <strong>{p.implementingAgency}</strong> • State: {p.state}
                </div>
              </div>

              <div>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '8px',
                  padding: '10px',
                  background: 'var(--bg-tertiary)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.72rem',
                  marginBottom: '10px'
                }}>
                  <div>
                    <span style={{ color: 'var(--text-tertiary)' }}>Cost Overrun:</span>
                    <div className="num-mono" style={{ fontWeight: 800, color: p.costOverrunPercent > 30 ? 'var(--accent-rose)' : 'var(--accent-emerald)' }}>
                      +{p.costOverrunPercent.toFixed(1)}%
                    </div>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-tertiary)' }}>Time Delay:</span>
                    <div className="num-mono" style={{ fontWeight: 800, color: p.timeOverrunMonths > 24 ? 'var(--accent-amber)' : 'var(--text-secondary)' }}>
                      +{p.timeOverrunMonths} months
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.72rem', color: 'var(--accent-cyan)' }}>
                  <span>Inspect 360° Dossier</span>
                  <ChevronRight size={14} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
