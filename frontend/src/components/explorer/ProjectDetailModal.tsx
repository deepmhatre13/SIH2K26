import React, { useState } from 'react';
import type { Project } from '../../types';
import { Modal } from '../common/Modal';
import { 
  IndianRupee, 
  AlertTriangle, 
  FileSpreadsheet, 
  Calendar 
} from 'lucide-react';

interface ProjectDetailModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'financials' | 'milestones' | 'bottlenecks' | 'cuf'>('financials');

  if (!project) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={project.name}
      subtitle={`Agency: ${project.implementingAgency} • ${project.sector} • State: ${project.state}`}
      maxWidth="940px"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Top Summary Ribbon */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '12px',
          padding: '14px 18px',
          background: 'var(--bg-tertiary)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)'
        }}>
          <div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>Sanction ID:</span>
            <div className="num-mono" style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {project.paimanaId}
            </div>
          </div>
          <div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>Legacy OCMS Code:</span>
            <div className="num-mono" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent-cyan)' }}>
              {project.ocmsCode}
            </div>
          </div>
          <div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>Risk Classification:</span>
            <div>
              <span className={`badge badge-${project.riskLevel.toLowerCase()}`}>
                {project.riskLevel} (PCRI: {project.riskBreakdown.compositeScore})
              </span>
            </div>
          </div>
          <div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>Physical Progress:</span>
            <div className="num-mono" style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
              {project.physicalProgressPercent}%
            </div>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid var(--border-subtle)',
          gap: '12px'
        }}>
          {[
            { id: 'financials', label: 'Financial Telemetry', icon: IndianRupee },
            { id: 'milestones', label: 'Critical Path Milestones', icon: Calendar },
            { id: 'bottlenecks', label: `Bottlenecks (${project.bottlenecks.length})`, icon: AlertTriangle },
            { id: 'cuf', label: 'CUF Monthly Submission', icon: FileSpreadsheet }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'financials' | 'milestones' | 'bottlenecks' | 'cuf')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '10px 14px',
                  background: 'none',
                  border: 'none',
                  borderBottom: isActive ? '2px solid var(--accent-cyan)' : '2px solid transparent',
                  color: isActive ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.8rem',
                  cursor: 'pointer'
                }}
              >
                <Icon size={15} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Financial Telemetry */}
        {activeTab === 'financials' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '14px'
            }}>
              <div style={{ padding: '14px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>Approved Original Cost:</span>
                <div className="num-mono" style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  ₹{project.originalCostCr.toLocaleString('en-IN')} Cr
                </div>
              </div>

              <div style={{ padding: '14px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>Approved Revised Cost:</span>
                <div className="num-mono" style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  ₹{project.revisedCostCr.toLocaleString('en-IN')} Cr
                </div>
              </div>

              <div style={{ padding: '14px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>AI Predicted Final Cost:</span>
                <div className="num-mono" style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
                  ₹{project.predictedFinalCostCr.toLocaleString('en-IN')} Cr
                </div>
              </div>

              <div style={{ padding: '14px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>Total Cost Escalation:</span>
                <div className="num-mono" style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-rose)' }}>
                  +{project.costOverrunPercent.toFixed(1)}% (+₹{project.costOverrunCr.toLocaleString('en-IN')} Cr)
                </div>
              </div>
            </div>

            {/* Expenditure Progress Bar */}
            <div style={{ padding: '16px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '8px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Cumulative Expenditure to Date:</span>
                <strong className="num-mono" style={{ color: 'var(--accent-emerald)' }}>
                  ₹{project.cumulativeExpenditureCr.toLocaleString('en-IN')} Cr ({project.financialProgressPercent}% Disbursed)
                </strong>
              </div>
              <div style={{ width: '100%', height: '8px', background: 'var(--bg-secondary)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${project.financialProgressPercent}%`, height: '100%', background: 'var(--accent-emerald)', borderRadius: '4px' }} />
              </div>
            </div>

            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              {project.executiveSummary}
            </p>
          </div>
        )}

        {/* Tab 2: Critical Path Milestones */}
        {activeTab === 'milestones' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {project.milestones.map((m) => (
              <div
                key={m.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  background: 'var(--bg-tertiary)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                      {m.name}
                    </span>
                    {m.criticalPath && <span className="badge badge-critical" style={{ fontSize: '0.62rem' }}>Critical Path</span>}
                  </div>
                  <div style={{ display: 'flex', gap: '12px', fontSize: '0.72rem', color: 'var(--text-tertiary)', marginTop: '3px' }}>
                    <span>Target: {m.revisedDate}</span>
                    {m.actualDate && <span style={{ color: 'var(--accent-emerald)' }}>Achieved: {m.actualDate}</span>}
                    <span>Weight: {m.weightagePercent}%</span>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span className="num-mono" style={{
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    color: m.slippageMonths > 0 ? 'var(--accent-amber)' : 'var(--accent-emerald)'
                  }}>
                    {m.slippageMonths > 0 ? `+${m.slippageMonths} mo delay` : 'On Schedule'}
                  </span>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)' }}>
                    Status: {m.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Bottlenecks Log */}
        {activeTab === 'bottlenecks' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {project.bottlenecks.map(b => (
              <div
                key={b.id}
                style={{
                  padding: '14px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-tertiary)',
                  borderLeft: `4px solid ${b.severity === 'CRITICAL' ? 'var(--accent-rose)' : 'var(--accent-amber)'}`
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span className="badge badge-high">{b.category}</span>
                  <span className="num-mono" style={{ fontSize: '0.74rem', color: 'var(--accent-rose)', fontWeight: 700 }}>
                    +{b.delayImpactMonths} Mo Delay Impact • ₹{b.costImpactCr} Cr Cost Risk
                  </span>
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  {b.description}
                </p>
                <div style={{ fontSize: '0.72rem', color: 'var(--accent-cyan)', background: 'rgba(6, 182, 212, 0.08)', padding: '6px 10px', borderRadius: 'var(--radius-sm)' }}>
                  <strong>Intervention Required:</strong> {b.agencyActionRequired}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 4: Common Upload Form (CUF) Raw Data Inspector */}
        {activeTab === 'cuf' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '10px',
              fontSize: '0.78rem'
            }}>
              <div style={{ padding: '10px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ color: 'var(--text-tertiary)', display: 'block' }}>CUF Submission ID:</span>
                <strong className="num-mono" style={{ color: 'var(--text-primary)' }}>{project.cufData.cufFormId}</strong>
              </div>

              <div style={{ padding: '10px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ color: 'var(--text-tertiary)', display: 'block' }}>Reporting Cycle Month:</span>
                <strong className="num-mono" style={{ color: 'var(--accent-cyan)' }}>{project.cufData.reportingMonth}</strong>
              </div>

              <div style={{ padding: '10px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ color: 'var(--text-tertiary)', display: 'block' }}>Land Acquisition Possession:</span>
                <strong className="num-mono" style={{ color: 'var(--accent-emerald)' }}>{project.cufData.landAcquisitionStatusPercent}% Contiguous</strong>
              </div>

              <div style={{ padding: '10px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ color: 'var(--text-tertiary)', display: 'block' }}>MoEFCC Environmental Status:</span>
                <strong style={{ color: 'var(--text-primary)' }}>{project.cufData.environmentalClearanceStatus}</strong>
              </div>

              <div style={{ padding: '10px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ color: 'var(--text-tertiary)', display: 'block' }}>Milestones Achieved / Total:</span>
                <strong className="num-mono" style={{ color: 'var(--text-primary)' }}>{project.cufData.milestonesAchievedCount} / {project.cufData.totalMilestonesCount}</strong>
              </div>

              <div style={{ padding: '10px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ color: 'var(--text-tertiary)', display: 'block' }}>Contractor Default Flag:</span>
                <strong style={{ color: project.cufData.isContractorDefault ? 'var(--accent-rose)' : 'var(--accent-emerald)' }}>
                  {project.cufData.isContractorDefault ? 'YES (Default Recorded)' : 'NO (Compliant)'}
                </strong>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
