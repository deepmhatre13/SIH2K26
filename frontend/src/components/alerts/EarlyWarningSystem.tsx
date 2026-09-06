import React, { useState } from 'react';
import type { EarlyWarningAlert } from '../../types';
import { 
  AlertTriangle, 
  Clock, 
  IndianRupee, 
  CheckCircle2, 
  Send, 
  Search,
  Sparkles
} from 'lucide-react';

interface EarlyWarningSystemProps {
  alerts: EarlyWarningAlert[];
  onSelectProjectById?: (projectId: string) => void;
}

export const EarlyWarningSystem: React.FC<EarlyWarningSystemProps> = ({
  alerts: initialAlerts,
  onSelectProjectById
}) => {
  const [alerts, setAlerts] = useState<EarlyWarningAlert[]>(initialAlerts);
  const [severityFilter, setSeverityFilter] = useState<'ALL' | 'CRITICAL' | 'HIGH' | 'MEDIUM'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleUpdateStatus = (alertId: string, newStatus: 'ACKNOWLEDGED' | 'INTERVENTION_INITIATED' | 'RESOLVED') => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, status: newStatus } : a));
    showToast(`Alert #${alertId} updated to "${newStatus.replace('_', ' ')}"`);
  };

  const filteredAlerts = alerts.filter(alert => {
    const matchesSeverity = severityFilter === 'ALL' || alert.severity === severityFilter;
    const matchesSearch = 
      alert.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.agency.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.sector.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.headline.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSeverity && matchesSearch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 9999,
          background: 'var(--bg-secondary)',
          border: '1px solid var(--accent-emerald)',
          color: 'var(--text-primary)',
          padding: '12px 20px',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '0.82rem',
          fontWeight: 600
        }}>
          <CheckCircle2 size={18} color="var(--accent-emerald)" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header & Stats Banner */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={22} color="var(--accent-rose)" />
            Early Warning Alert System (EWAS) & Prescriptive Triage
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Real-time proactive surveillance flagging emerging bottlenecks with actionable ministerial interventions
          </p>
        </div>

        {/* Severity Filter Tabs */}
        <div style={{
          display: 'flex',
          background: 'var(--bg-tertiary)',
          padding: '4px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)'
        }}>
          {(['ALL', 'CRITICAL', 'HIGH', 'MEDIUM'] as const).map(sev => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                background: severityFilter === sev ? 'var(--accent-cyan)' : 'transparent',
                color: severityFilter === sev ? '#070c18' : 'var(--text-secondary)',
                fontWeight: 700,
                fontSize: '0.76rem',
                cursor: 'pointer'
              }}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-panel" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <Search size={16} color="var(--text-tertiary)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search alerts by project name, agency, sector, or headline..."
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

        <div style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>
          Showing <strong>{filteredAlerts.length}</strong> active early warning signals
        </div>
      </div>

      {/* Alerts Feed */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filteredAlerts.map(alert => {
          const isCritical = alert.severity === 'CRITICAL';
          const isHigh = alert.severity === 'HIGH';

          return (
            <div
              key={alert.id}
              className="glass-panel glass-panel-interactive"
              style={{
                padding: '20px',
                borderLeft: `4px solid ${
                  isCritical ? 'var(--accent-rose)' :
                  isHigh ? 'var(--accent-amber)' : 'var(--accent-blue)'
                }`
              }}
            >
              {/* Alert Header Row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span className={`badge badge-${alert.severity.toLowerCase()}`}>
                    <span className={`pulse-dot pulse-dot-${isCritical ? 'critical' : 'emerald'}`} />
                    {alert.severity} PRIORITY
                  </span>
                  <span className="badge badge-cyan">{alert.sector}</span>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-tertiary)' }}>
                    Agency: <strong>{alert.agency}</strong>
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="num-mono" style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>
                    {alert.timestamp}
                  </span>
                  <span style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-full)',
                    background: alert.status === 'RESOLVED' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.08)',
                    color: alert.status === 'RESOLVED' ? 'var(--accent-emerald)' : 'var(--text-secondary)'
                  }}>
                    {alert.status.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {/* Headline & Project Name */}
              <h3 
                onClick={() => onSelectProjectById && onSelectProjectById(alert.projectId)}
                style={{
                  fontSize: '1.05rem',
                  fontWeight: 800,
                  color: 'var(--text-primary)',
                  cursor: onSelectProjectById ? 'pointer' : 'default',
                  marginBottom: '4px'
                }}
              >
                {alert.projectName}
              </h3>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: isCritical ? 'var(--accent-rose)' : 'var(--accent-amber)', marginBottom: '8px' }}>
                {alert.headline}
              </h4>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '14px' }}>
                {alert.description}
              </p>

              {/* Impact Telemetry Ribbon */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '12px',
                padding: '12px 14px',
                background: 'var(--bg-tertiary)',
                borderRadius: 'var(--radius-md)',
                marginBottom: '16px'
              }}>
                <div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Sparkles size={12} color="var(--accent-cyan)" /> AI Detection Lead Time:
                  </span>
                  <strong className="num-mono" style={{ fontSize: '0.9rem', color: 'var(--accent-cyan)' }}>
                    +{alert.detectionLeadTimeMonths} Months Advance Notice
                  </strong>
                </div>

                <div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <IndianRupee size={12} color="var(--accent-rose)" /> Potential Cost Escalation:
                  </span>
                  <strong className="num-mono" style={{ fontSize: '0.9rem', color: 'var(--accent-rose)' }}>
                    +₹{alert.predictedCostImpactCr.toLocaleString('en-IN')} Cr
                  </strong>
                </div>

                <div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={12} color="var(--accent-amber)" /> Potential Milestone Delay:
                  </span>
                  <strong className="num-mono" style={{ fontSize: '0.9rem', color: 'var(--accent-amber)' }}>
                    +{alert.predictedTimeImpactMonths} Months
                  </strong>
                </div>
              </div>

              {/* Prescriptive Remedial Actions */}
              <div style={{ marginBottom: '16px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '8px' }}>
                  Prescriptive Remedial Interventions:
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {alert.prescriptiveRecommendations.map((rec, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
                      <CheckCircle2 size={14} color="var(--accent-emerald)" style={{ marginTop: '2px', flexShrink: 0 }} />
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px', borderTop: '1px solid var(--border-subtle)', paddingTop: '12px' }}>
                <button
                  onClick={() => handleUpdateStatus(alert.id, 'ACKNOWLEDGED')}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-medium)',
                    color: 'var(--text-primary)',
                    fontSize: '0.74rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Acknowledge
                </button>

                <button
                  onClick={() => handleUpdateStatus(alert.id, 'INTERVENTION_INITIATED')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '6px 14px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--accent-cyan)',
                    border: 'none',
                    color: '#070c18',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  <Send size={13} />
                  <span>Escalate to PMG / Cabinet Secretariat</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
