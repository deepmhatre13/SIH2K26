import React from 'react';
import { SHAP_FEATURE_ATTRIBUTION } from '../../data/mockAnalytics';
import { FileSpreadsheet, Sparkles, Database } from 'lucide-react';

export const CUFDriverAnalysis: React.FC = () => {
  const cufShare = 62;
  const externalShare = 38;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileSpreadsheet size={22} color="var(--accent-cyan)" />
            Common Upload Form (CUF) Driver Analysis & Attribution
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Empirical evaluation of existing CUF reporting fields vis-à-vis external variables (SHAP explainability)
          </p>
        </div>

        <span className="badge badge-cyan" style={{ fontSize: '0.72rem', padding: '4px 10px' }}>
          Research Dimension (c) Addressed
        </span>
      </div>

      {/* Hero Explanatory Power Split */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '14px' }}>
          Attribution Split: CUF Reporting Form vs. External Synthetic Variables
        </h3>

        {/* Proportional Bar */}
        <div style={{
          display: 'flex',
          height: '24px',
          borderRadius: 'var(--radius-full)',
          overflow: 'hidden',
          background: 'var(--bg-tertiary)',
          gap: '3px',
          marginBottom: '14px'
        }}>
          <div style={{
            width: `${cufShare}%`,
            background: 'linear-gradient(90deg, #0284c7 0%, #06b6d4 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.75rem',
            fontWeight: 800,
            color: '#070c18'
          }}>
            {cufShare}% Existing CUF Fields
          </div>
          <div style={{
            width: `${externalShare}%`,
            background: 'linear-gradient(90deg, #f59e0b 0%, #ea580c 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.75rem',
            fontWeight: 800,
            color: '#ffffff'
          }}>
            {externalShare}% External Non-CUF Variables
          </div>
        </div>

        <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          Our empirical analysis demonstrates that while <strong>62%</strong> of cost escalation variance is explainable using existing Common Upload Form monthly entries (primarily expenditure burn-rates and milestone achievement count), the remaining <strong>38%</strong> requires enrichment from non-CUF variables: state-level statutory clearance friction, macro commodity inflation, and contractor balance sheet stress.
        </p>
      </div>

      {/* SHAP Feature Importance Breakdown */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={16} color="var(--accent-cyan)" />
              SHAP (Shapley Additive exPlanations) Feature Importance Breakdown
            </h4>
            <p style={{ fontSize: '0.74rem', color: 'var(--text-tertiary)', marginTop: '2px' }}>
              Relative contribution of individual predictors towards final project cost overrun prediction
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px', fontSize: '0.72rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--accent-cyan)' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: 'var(--accent-cyan)' }} />
              CUF Field
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--accent-amber)' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: 'var(--accent-amber)' }} />
              External Non-CUF
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {SHAP_FEATURE_ATTRIBUTION.map((item, idx) => {
            const isCUF = item.source === 'CUF Field';
            const barWidth = (item.importanceScore / 0.25) * 100;

            return (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                      {item.featureName}
                    </span>
                    <span className={`badge ${isCUF ? 'badge-cyan' : 'badge-high'}`} style={{ fontSize: '0.62rem', padding: '1px 6px' }}>
                      {item.source}
                    </span>
                  </div>
                  <strong className="num-mono" style={{ color: isCUF ? 'var(--accent-cyan)' : 'var(--accent-amber)' }}>
                    SHAP Score: {item.importanceScore}
                  </strong>
                </div>

                {/* Progress bar */}
                <div style={{ width: '100%', height: '8px', background: 'var(--bg-tertiary)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${barWidth}%`,
                    height: '100%',
                    background: isCUF ? 'var(--accent-cyan)' : 'var(--accent-amber)',
                    borderRadius: '4px',
                    transition: 'width 0.6s ease'
                  }} />
                </div>

                <p style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', marginTop: '2px' }}>
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Policy Recommendations Card for MoSPI / IPMD (Prescriptive Proposal) */}
      <div 
        className="glass-panel" 
        style={{
          padding: '20px',
          background: 'rgba(99, 102, 241, 0.05)',
          borderLeft: '4px solid var(--accent-indigo)'
        }}
      >
        <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Database size={18} color="var(--accent-indigo)" />
          Prescriptive Policy Recommendation: Modernizing CUF to "CUF 2.0"
        </h4>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '12px' }}>
          To capture the <strong>38% unaccounted variance</strong> without requiring line ministries to manually upload bulky external datasets, we propose that the PAIMANA backend automatically ingest:
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px', fontSize: '0.75rem' }}>
          <div style={{ padding: '10px 14px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
            <strong style={{ color: 'var(--accent-cyan)' }}>1. State Single-Window RoW API:</strong>
            <p style={{ color: 'var(--text-tertiary)', marginTop: '2px' }}>Direct telemetry on revenue department land demarcations and forest clearance approvals.</p>
          </div>

          <div style={{ padding: '10px 14px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
            <strong style={{ color: 'var(--accent-amber)' }}>2. Automated RBI / WPI Commodity Index:</strong>
            <p style={{ color: 'var(--text-tertiary)', marginTop: '2px' }}>Auto-linked steel, cement, and diesel indices mapped dynamically to EPC billing schedules.</p>
          </div>

          <div style={{ padding: '10px 14px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
            <strong style={{ color: 'var(--accent-emerald)' }}>3. EPC Contractor Multi-Package Health Index:</strong>
            <p style={{ color: 'var(--text-tertiary)', marginTop: '2px' }}>Cross-referencing contractor execution load across NHAI, Railways, and NTPC to avert overextension.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
