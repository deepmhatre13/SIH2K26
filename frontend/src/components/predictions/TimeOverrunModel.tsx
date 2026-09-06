import React, { useState } from 'react';
import type { Project } from '../../types';
import { Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface TimeOverrunModelProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
}

export const TimeOverrunModel: React.FC<TimeOverrunModelProps> = ({
  projects,
  onSelectProject
}) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects[0]?.id || '');
  const activeProject = projects.find(p => p.id === selectedProjectId) || projects[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={22} color="var(--accent-amber)" />
            Time Overrun & Critical Path Milestone Forecaster
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Early detection of milestone slippage along the project critical path prior to schedule realization
          </p>
        </div>

        {/* Project Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>Inspect Project:</label>
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
                {p.name.slice(0, 45)}... ({p.timeOverrunMonths} mo delay)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Selected Project Milestone Timeline Card */}
      {activeProject && (
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '14px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="badge badge-cyan">{activeProject.sector}</span>
                <span className={`badge badge-${activeProject.riskLevel.toLowerCase()}`}>
                  {activeProject.riskLevel} RISK
                </span>
                <span className="badge badge-high">
                  Delay: +{activeProject.timeOverrunMonths} Months
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {activeProject.name}
                </h3>
                <button
                  onClick={() => onSelectProject(activeProject)}
                  style={{
                    padding: '3px 9px',
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
              <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '2px' }}>
                Agency: <strong>{activeProject.implementingAgency}</strong> • Ministry: <strong>{activeProject.ministry}</strong>
              </p>
            </div>

            {/* Date Comparative Pills */}
            <div style={{
              display: 'flex',
              gap: '12px',
              background: 'var(--bg-tertiary)',
              padding: '10px 16px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)'
            }}>
              <div>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)' }}>Original Target:</span>
                <div className="num-mono" style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                  {activeProject.originalCompletionDate}
                </div>
              </div>
              <div style={{ width: '1px', height: '24px', background: 'var(--border-medium)' }} />
              <div>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)' }}>Revised Target:</span>
                <div className="num-mono" style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--accent-amber)' }}>
                  {activeProject.revisedCompletionDate}
                </div>
              </div>
              <div style={{ width: '1px', height: '24px', background: 'var(--border-medium)' }} />
              <div>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)' }}>AI Predicted Outturn:</span>
                <div className="num-mono" style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--accent-rose)' }}>
                  {activeProject.predictedCompletionDate}
                </div>
              </div>
            </div>
          </div>

          {/* Milestone Trajectory Progression */}
          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Critical-Path Milestone Slippage Progression
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {activeProject.milestones.map((m) => {
                const isCompleted = m.status === 'COMPLETED';
                const isAtRisk = m.status === 'AT_RISK';
                const isDelayed = m.status === 'DELAYED';

                return (
                  <div
                    key={m.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      padding: '12px 16px',
                      borderRadius: 'var(--radius-md)',
                      background: isAtRisk 
                        ? 'rgba(245, 158, 11, 0.08)' 
                        : isDelayed 
                          ? 'rgba(239, 68, 68, 0.08)' 
                          : 'var(--bg-tertiary)',
                      border: `1px solid ${
                        isAtRisk ? 'rgba(245, 158, 11, 0.3)' :
                        isDelayed ? 'rgba(239, 68, 68, 0.3)' : 'var(--border-subtle)'
                      }`
                    }}
                  >
                    {/* Status Icon */}
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: isCompleted ? 'rgba(16, 185, 129, 0.2)' : isAtRisk ? 'rgba(245, 158, 11, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                      color: isCompleted ? 'var(--accent-emerald)' : isAtRisk ? 'var(--accent-amber)' : 'var(--accent-rose)',
                      flexShrink: 0
                    }}>
                      {isCompleted ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
                    </div>

                    {/* Milestone Details */}
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.84rem', color: 'var(--text-primary)' }}>
                          {m.name}
                        </span>
                        {m.criticalPath && (
                          <span className="badge badge-critical" style={{ fontSize: '0.62rem', padding: '1px 5px' }}>
                            Critical Path
                          </span>
                        )}
                      </div>
                      <div style={{ display: 'flex', gap: '14px', fontSize: '0.72rem', color: 'var(--text-tertiary)', marginTop: '2px' }}>
                        <span>Target: <strong className="num-mono" style={{ color: 'var(--text-secondary)' }}>{m.revisedDate}</strong></span>
                        {m.actualDate && <span>Achieved: <strong className="num-mono" style={{ color: 'var(--accent-emerald)' }}>{m.actualDate}</strong></span>}
                        <span>Weight: {m.weightagePercent}%</span>
                      </div>
                    </div>

                    {/* Slippage Tag */}
                    <div style={{ textAlign: 'right' }}>
                      <span className="num-mono" style={{
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        color: m.slippageMonths > 24 ? 'var(--accent-rose)' : m.slippageMonths > 0 ? 'var(--accent-amber)' : 'var(--accent-emerald)'
                      }}>
                        {m.slippageMonths > 0 ? `+${m.slippageMonths} mo slippage` : 'On Time'}
                      </span>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)' }}>
                        Status: {m.status}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Bottlenecks Affecting Schedule */}
          <div>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Statutory & Field Bottlenecks Impacting Critical Path
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '12px' }}>
              {activeProject.bottlenecks.map((b) => (
                <div
                  key={b.id}
                  style={{
                    padding: '14px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-medium)',
                    borderLeft: `3px solid ${b.severity === 'CRITICAL' ? 'var(--accent-rose)' : 'var(--accent-amber)'}`
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span className="badge badge-high" style={{ fontSize: '0.65rem' }}>
                      {b.category}
                    </span>
                    <span className="num-mono" style={{ fontSize: '0.72rem', color: 'var(--accent-rose)', fontWeight: 700 }}>
                      +{b.delayImpactMonths} Mo Delay Impact
                    </span>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: '8px' }}>
                    {b.description}
                  </p>
                  <div style={{ fontSize: '0.72rem', color: 'var(--accent-cyan)', background: 'rgba(6, 182, 212, 0.08)', padding: '6px 10px', borderRadius: 'var(--radius-sm)' }}>
                    <strong>Intervention Required:</strong> {b.agencyActionRequired}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
