import React, { useState } from 'react';
import type { Project } from '../../types';
import { RiskGauge } from '../common/RiskGauge';
import { ShieldAlert, Compass } from 'lucide-react';

interface RiskScoringFrameworkProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
}

export const RiskScoringFramework: React.FC<RiskScoringFrameworkProps> = ({
  projects,
  onSelectProject
}) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects[0]?.id || '');
  const activeProject = projects.find(p => p.id === selectedProjectId) || projects[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Framework Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldAlert size={22} color="var(--accent-rose)" />
            PAIMANA Composite Risk Index (PCRI) Framework
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Multi-dimensional weighted risk scoring engine synthesizing timeline, financial velocity, statutory friction, and contractor health
          </p>
        </div>

        {/* Project Picker */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>Evaluate Project:</label>
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            style={{
              background: 'var(--bg-tertiary)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-sm)',
              padding: '6px 12px',
              fontSize: '0.78rem',
              fontWeight: 600,
              maxWidth: '340px',
              outline: 'none'
            }}
          >
            {projects.map(p => (
              <option key={p.id} value={p.id}>
                {p.name.slice(0, 42)}... (PCRI: {p.riskBreakdown.compositeScore})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Selected Project PCRI Deep-Dive Card */}
      {activeProject && (
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="badge badge-cyan">{activeProject.sector}</span>
                <span className={`badge badge-${activeProject.riskLevel.toLowerCase()}`}>
                  {activeProject.riskLevel} PRIORITY
                </span>
                <span className="num-mono" style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                  ID: {activeProject.paimanaId}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {activeProject.name}
                </h3>
                <button
                  onClick={() => onSelectProject(activeProject)}
                  style={{
                    padding: '3px 10px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--accent-cyan)',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  View Dossier
                </button>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                {activeProject.locationDetails} • Agency: <strong>{activeProject.implementingAgency}</strong>
              </p>
            </div>

            {/* Composite PCRI Master Gauge */}
            <div style={{
              background: 'var(--bg-tertiary)',
              padding: '16px 24px',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <RiskGauge
                score={activeProject.riskBreakdown.compositeScore}
                size={200}
                label="Composite Score (PCRI)"
                sublabel="0 (Secure) to 100 (Severe Escalation)"
              />
            </div>
          </div>

          {/* Sub-Dimension Weightage Breakdown Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px',
            marginBottom: '24px'
          }}>
            {/* Dimension 1: Schedule Risk */}
            <div style={{
              background: 'var(--bg-secondary)',
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              borderTop: '3px solid var(--accent-amber)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Schedule Risk</span>
                <span className="badge badge-cyan" style={{ fontSize: '0.62rem' }}>Weight 35%</span>
              </div>
              <div className="num-mono" style={{ fontSize: '1.5rem', fontWeight: 800, color: activeProject.riskBreakdown.scheduleRiskScore > 75 ? 'var(--accent-rose)' : 'var(--accent-amber)' }}>
                {activeProject.riskBreakdown.scheduleRiskScore}<span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>/100</span>
              </div>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', marginTop: '4px' }}>
                Reflects {activeProject.timeOverrunMonths} months cumulative slippage across critical milestones.
              </p>
            </div>

            {/* Dimension 2: Cost Escalation Risk */}
            <div style={{
              background: 'var(--bg-secondary)',
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              borderTop: '3px solid var(--accent-rose)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Cost Escalation</span>
                <span className="badge badge-cyan" style={{ fontSize: '0.62rem' }}>Weight 30%</span>
              </div>
              <div className="num-mono" style={{ fontSize: '1.5rem', fontWeight: 800, color: activeProject.riskBreakdown.costEscalationRiskScore > 75 ? 'var(--accent-rose)' : 'var(--accent-cyan)' }}>
                {activeProject.riskBreakdown.costEscalationRiskScore}<span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>/100</span>
              </div>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', marginTop: '4px' }}>
                Anticipates +{activeProject.costOverrunPercent.toFixed(1)}% (+₹{activeProject.costOverrunCr} Cr) final cost escalation.
              </p>
            </div>

            {/* Dimension 3: Regulatory & Bottleneck Complexity */}
            <div style={{
              background: 'var(--bg-secondary)',
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              borderTop: '3px solid var(--accent-blue)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Regulatory Friction</span>
                <span className="badge badge-cyan" style={{ fontSize: '0.62rem' }}>Weight 20%</span>
              </div>
              <div className="num-mono" style={{ fontSize: '1.5rem', fontWeight: 800, color: activeProject.riskBreakdown.regulatoryBottleneckScore > 75 ? 'var(--accent-rose)' : 'var(--accent-blue)' }}>
                {activeProject.riskBreakdown.regulatoryBottleneckScore}<span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>/100</span>
              </div>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', marginTop: '4px' }}>
                Evaluates RoW land possession ({activeProject.cufData.landAcquisitionStatusPercent}%) & statutory clearances.
              </p>
            </div>

            {/* Dimension 4: Agency & Contractor Capability */}
            <div style={{
              background: 'var(--bg-secondary)',
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              borderTop: '3px solid var(--accent-indigo)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Contractor Capability</span>
                <span className="badge badge-cyan" style={{ fontSize: '0.62rem' }}>Weight 15%</span>
              </div>
              <div className="num-mono" style={{ fontSize: '1.5rem', fontWeight: 800, color: activeProject.riskBreakdown.agencyContractorRiskScore > 75 ? 'var(--accent-rose)' : 'var(--accent-indigo)' }}>
                {activeProject.riskBreakdown.agencyContractorRiskScore}<span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>/100</span>
              </div>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', marginTop: '4px' }}>
                Analyzes historical turnaround and package liquidity performance of {activeProject.implementingAgency}.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 2D Quadrant Matrix View: Cost Overrun % vs Schedule Delay (Months) */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Compass size={18} color="var(--accent-cyan)" />
            2D Risk Quadrant: Cost Escalation (%) vs. Schedule Delay (Months)
          </h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Click on any project node to examine root causes and initiate prescriptive intervention
          </p>
        </div>

        {/* Quadrant Visualizer */}
        <div style={{
          position: 'relative',
          width: '100%',
          height: '320px',
          background: 'var(--bg-secondary)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-medium)',
          overflow: 'hidden'
        }}>
          {/* Quadrant Label Watermarks */}
          <div style={{ position: 'absolute', top: '12px', right: '16px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-rose)', opacity: 0.6 }}>
            QUADRANT I: CRITICAL COST & SCHEDULE ESCALATION
          </div>
          <div style={{ position: 'absolute', top: '12px', left: '16px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-amber)', opacity: 0.6 }}>
            QUADRANT II: BUDGET INFLATION (CONTROLLED TIME)
          </div>
          <div style={{ position: 'absolute', bottom: '12px', left: '16px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-emerald)', opacity: 0.6 }}>
            QUADRANT III: ON TRACK / BENCHMARK EFFICIENCY
          </div>
          <div style={{ position: 'absolute', bottom: '12px', right: '16px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-cyan)', opacity: 0.6 }}>
            QUADRANT IV: PROLONGED DELAY (CONTAINED COST)
          </div>

          {/* Center Dividing Lines */}
          <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', background: 'var(--border-subtle)', borderTop: '1px dashed var(--border-medium)' }} />
          <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '1px', background: 'var(--border-subtle)', borderLeft: '1px dashed var(--border-medium)' }} />

          {/* Project Scatter Nodes */}
          {projects.map(p => {
            // Map cost overrun % (0 to 120%) to Y (bottom: 0%, top: 100%)
            const rawY = Math.min(90, Math.max(10, (p.costOverrunPercent / 120) * 80 + 10));
            // Map time overrun (0 to 120 months) to X (left: 0%, right: 100%)
            const rawX = Math.min(90, Math.max(10, (p.timeOverrunMonths / 120) * 80 + 10));

            const isSelected = p.id === activeProject?.id;

            return (
              <div
                key={p.id}
                onClick={() => setSelectedProjectId(p.id)}
                style={{
                  position: 'absolute',
                  left: `${rawX}%`,
                  bottom: `${rawY}%`,
                  transform: 'translate(-50%, 50%)',
                  cursor: 'pointer',
                  zIndex: isSelected ? 10 : 2
                }}
                title={`${p.name}: +${p.costOverrunPercent.toFixed(1)}% cost, ${p.timeOverrunMonths} mo delay`}
              >
                <div style={{
                  width: isSelected ? '22px' : '14px',
                  height: isSelected ? '22px' : '14px',
                  borderRadius: '50%',
                  background: p.riskLevel === 'CRITICAL' ? 'var(--accent-rose)' :
                              p.riskLevel === 'HIGH' ? 'var(--accent-amber)' : 'var(--accent-emerald)',
                  boxShadow: isSelected 
                    ? '0 0 16px var(--accent-cyan), 0 0 0 4px rgba(6, 182, 212, 0.4)' 
                    : '0 2px 6px rgba(0,0,0,0.4)',
                  transition: 'transform 0.2s ease, width 0.2s ease, height 0.2s ease'
                }} />
                <span style={{
                  position: 'absolute',
                  top: '100%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                  color: isSelected ? 'var(--accent-cyan)' : 'var(--text-tertiary)',
                  background: 'rgba(5, 10, 20, 0.8)',
                  padding: '1px 5px',
                  borderRadius: '3px',
                  pointerEvents: 'none',
                  marginTop: '2px'
                }}>
                  {p.name.split(' ')[0]}...
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
