import React, { useState, useEffect } from 'react';
import type { Project, WhatIfSimulationInput, WhatIfSimulationResult } from '../../types';
import { projectService } from '../../services/projectService';
import { Sliders, RefreshCw, AlertTriangle } from 'lucide-react';

interface CostSimulationStudioProps {
  project: Project;
  onProjectChange?: (projectId: string) => void;
  availableProjects: Project[];
}

export const CostSimulationStudio: React.FC<CostSimulationStudioProps> = ({
  project,
  onProjectChange,
  availableProjects
}) => {
  const [inputs, setInputs] = useState<WhatIfSimulationInput>({
    landAcquisitionDelayMonths: 6,
    environmentalClearanceMonths: 4,
    commodityInflationRatePercent: 8,
    contractorCashflowLagFactor: 1.15,
    monsoonDisruptionDays: 20
  });

  const [result, setResult] = useState<WhatIfSimulationResult | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  // Run simulation whenever inputs or selected project change
  useEffect(() => {
    let isMounted = true;
    const run = async () => {
      setIsSimulating(true);
      const res = await projectService.runWhatIfSimulation(project, inputs);
      if (isMounted) {
        setResult(res);
        setIsSimulating(false);
      }
    };
    run();
    return () => { isMounted = false; };
  }, [project, inputs]);

  const handleReset = () => {
    setInputs({
      landAcquisitionDelayMonths: 0,
      environmentalClearanceMonths: 0,
      commodityInflationRatePercent: 5,
      contractorCashflowLagFactor: 1.0,
      monsoonDisruptionDays: 0
    });
  };

  return (
    <div className="glass-panel" style={{ padding: '24px' }}>
      {/* Studio Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sliders size={20} color="var(--accent-cyan)" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Interactive "What-If" Cost & Schedule Simulation Studio
            </h3>
            <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>
              Dynamic Sensitivity Engine
            </span>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '3px' }}>
            Simulate the compounded cost escalation and timeline delay across regulatory, inflation, and contractor variables
          </p>
        </div>

        {/* Project Picker for Simulation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>Active Project:</label>
          <select
            value={project.id}
            onChange={(e) => onProjectChange && onProjectChange(e.target.value)}
            style={{
              background: 'var(--bg-tertiary)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-sm)',
              padding: '6px 12px',
              fontSize: '0.78rem',
              fontWeight: 600,
              maxWidth: '320px',
              outline: 'none'
            }}
          >
            {availableProjects.map(p => (
              <option key={p.id} value={p.id}>
                {p.name.slice(0, 42)}... ({p.sector})
              </option>
            ))}
          </select>

          <button
            onClick={handleReset}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '6px 12px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-secondary)',
              fontSize: '0.75rem',
              cursor: 'pointer'
            }}
            title="Reset to baseline"
          >
            <RefreshCw size={12} style={{ animation: isSimulating ? 'spin 1s linear infinite' : 'none' }} />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Sliders, Right Results */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '24px'
      }}>
        {/* Left Column: Sensitivity Sliders */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Slider 1: Land Acquisition Delay */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '6px' }}>
              <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Land Acquisition Delay:</span>
              <strong className="num-mono" style={{ color: 'var(--accent-cyan)' }}>
                +{inputs.landAcquisitionDelayMonths} Months
              </strong>
            </div>
            <input
              type="range"
              min="0"
              max="36"
              step="1"
              value={inputs.landAcquisitionDelayMonths}
              onChange={(e) => setInputs({ ...inputs, landAcquisitionDelayMonths: Number(e.target.value) })}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'var(--text-tertiary)', marginTop: '2px' }}>
              <span>0 mo (Immediate)</span>
              <span>18 mo</span>
              <span>36 mo (Severe Dispute)</span>
            </div>
          </div>

          {/* Slider 2: Environmental Clearance */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '6px' }}>
              <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Forest & Statutory Clearance Lag:</span>
              <strong className="num-mono" style={{ color: 'var(--accent-cyan)' }}>
                +{inputs.environmentalClearanceMonths} Months
              </strong>
            </div>
            <input
              type="range"
              min="0"
              max="24"
              step="1"
              value={inputs.environmentalClearanceMonths}
              onChange={(e) => setInputs({ ...inputs, environmentalClearanceMonths: Number(e.target.value) })}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'var(--text-tertiary)', marginTop: '2px' }}>
              <span>0 mo</span>
              <span>12 mo</span>
              <span>24 mo (FAC Delay)</span>
            </div>
          </div>

          {/* Slider 3: Commodity Inflation Rate */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '6px' }}>
              <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Steel & Cement Commodity Inflation (WPI):</span>
              <strong className="num-mono" style={{ color: inputs.commodityInflationRatePercent > 10 ? 'var(--accent-rose)' : 'var(--accent-amber)' }}>
                {inputs.commodityInflationRatePercent}%
              </strong>
            </div>
            <input
              type="range"
              min="-2"
              max="25"
              step="1"
              value={inputs.commodityInflationRatePercent}
              onChange={(e) => setInputs({ ...inputs, commodityInflationRatePercent: Number(e.target.value) })}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'var(--text-tertiary)', marginTop: '2px' }}>
              <span>-2% (Deflation)</span>
              <span>8% (Historical Avg)</span>
              <span>25% (Supercycle)</span>
            </div>
          </div>

          {/* Slider 4: Contractor Cashflow Lag */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '6px' }}>
              <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Contractor Liquidity / Disbursal Lag:</span>
              <strong className="num-mono" style={{ color: inputs.contractorCashflowLagFactor > 1.3 ? 'var(--accent-rose)' : 'var(--accent-cyan)' }}>
                {inputs.contractorCashflowLagFactor}x Factor
              </strong>
            </div>
            <input
              type="range"
              min="0.8"
              max="2.0"
              step="0.05"
              value={inputs.contractorCashflowLagFactor}
              onChange={(e) => setInputs({ ...inputs, contractorCashflowLagFactor: Number(e.target.value) })}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'var(--text-tertiary)', marginTop: '2px' }}>
              <span>0.8x (Liquid)</span>
              <span>1.0x (Normal)</span>
              <span>2.0x (Severe Distress)</span>
            </div>
          </div>

          {/* Slider 5: Monsoon Disruption */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '6px' }}>
              <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Monsoon & Extreme Weather Disruption:</span>
              <strong className="num-mono" style={{ color: 'var(--text-primary)' }}>
                +{inputs.monsoonDisruptionDays} Days
              </strong>
            </div>
            <input
              type="range"
              min="0"
              max="90"
              step="5"
              value={inputs.monsoonDisruptionDays}
              onChange={(e) => setInputs({ ...inputs, monsoonDisruptionDays: Number(e.target.value) })}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'var(--text-tertiary)', marginTop: '2px' }}>
              <span>0 Days</span>
              <span>45 Days</span>
              <span>90 Days (Flash Floods)</span>
            </div>
          </div>
        </div>

        {/* Right Column: Simulated Live Outturn */}
        <div style={{
          background: 'var(--bg-tertiary)',
          borderRadius: 'var(--radius-lg)',
          padding: '20px',
          border: '1px solid var(--border-medium)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                Simulated AI Forecast Outturn
              </span>
              {result && (
                <span className={`badge badge-${result.newRiskLevel.toLowerCase()}`}>
                  {result.newRiskLevel} RISK (PCRI: {result.newRiskScore})
                </span>
              )}
            </div>

            {/* Main Cost Delta Display */}
            {result && (
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  Simulated Terminal Completion Cost:
                </div>
                <div className="num-mono" style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.1 }}>
                  ₹{result.simulatedCostCr.toLocaleString('en-IN')} Cr
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px', fontSize: '0.78rem' }}>
                  <span style={{
                    color: result.costDeltaCr > 0 ? 'var(--accent-rose)' : 'var(--accent-emerald)',
                    fontWeight: 700
                  }}>
                    {result.costDeltaCr > 0 ? `+₹${result.costDeltaCr.toLocaleString('en-IN')} Cr (+${result.costDeltaPercent}%)` : 'Baseline Parity'}
                  </span>
                  <span style={{ color: 'var(--text-tertiary)' }}>
                    vs. Base ₹{result.basePredictedCostCr.toLocaleString('en-IN')} Cr
                  </span>
                </div>
              </div>
            )}

            {/* Timeline Impact */}
            {result && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px',
                padding: '12px',
                background: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-md)',
                marginBottom: '16px'
              }}>
                <div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>Projected Delay:</span>
                  <div className="num-mono" style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--accent-amber)' }}>
                    {result.simulatedMonths} Mo
                  </div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                    (+{result.timeDeltaMonths} mo incremental)
                  </span>
                </div>
                <div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>95% Confidence Corridor:</span>
                  <div className="num-mono" style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    ₹{(result.confidenceLowerBoundCr / 1000).toFixed(1)}k - {(result.confidenceUpperBoundCr / 1000).toFixed(1)}k Cr
                  </div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)' }}>
                    Gaussian ML Bound
                  </span>
                </div>
              </div>
            )}

            {/* Key Vulnerability Drivers */}
            {result && (
              <div>
                <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  Identified Critical Vulnerabilities:
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {result.keyVulnerabilityFactors.map((v, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                      <AlertTriangle size={13} color="var(--accent-amber)" style={{ marginTop: '2px', flexShrink: 0 }} />
                      <span>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)', fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>
            *Simulation engine integrates historical OCMS multi-decade escalation coefficients calibrated against 1,981 central sector projects.
          </div>
        </div>
      </div>
    </div>
  );
};
