import React from 'react';
import { StatCard } from '../common/StatCard';
import { InteractiveSCurve } from './InteractiveSCurve';
import { PortfolioHealth } from './PortfolioHealth';
import { SectorBreakdown } from './SectorBreakdown';
import type { Project, SectorType } from '../../types';
import { MACRO_PORTFOLIO_STATS } from '../../data/mockAnalytics';
import { 
  FolderKanban, 
  IndianRupee, 
  TrendingUp, 
  AlertOctagon, 
  Clock, 
  Zap, 
  ArrowRight, 
  Layers 
} from 'lucide-react';

interface ExecutiveDashboardProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
  onNavigateToTab: (tabId: string) => void;
  onFilterSector: (sector: SectorType) => void;
}

export const ExecutiveDashboard: React.FC<ExecutiveDashboardProps> = ({
  projects,
  onSelectProject,
  onNavigateToTab,
  onFilterSector
}) => {
  const stats = MACRO_PORTFOLIO_STATS;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Top Banner with Executive Notice */}
      <div 
        className="glass-panel" 
        style={{
          padding: '16px 22px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(99, 102, 241, 0.08) 100%)',
          // borderLeft: '4px solid var(--accent-cyan)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'rgba(6, 182, 212, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-cyan)'
          }}>
            <Zap size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '0.98rem', fontWeight: 800, }}>
              AI-Powered Early Warning Decision Support (April 2026 Telemetry)
            </h3>
            <p style={{ fontSize: '0.78rem', marginTop: '2px' }}>
              Monitoring 1,981 Central Sector Infrastructure Projects (₹150 Cr & above). Predictive models indicate 
              <strong style={{ color: 'var(--accent-rose)' }}> ₹5.65 Lakh Cr </strong> total cost escalation potential with an 
              <strong style={{ color: 'var(--accent-emerald)' }}> 8.4-month average advance warning window </strong> over legacy OCMS.
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigateToTab('predictions')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 16px',
            borderRadius: 'var(--radius-md)',
            // color: '#070c18',
            border: 'none',
            fontSize: '0.8rem',
            fontWeight: 700,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            boxShadow: '0 2px 8px rgba(6, 182, 212, 0.3)'
          }}
        >
          <span>Explore Predictive Models</span>
          <ArrowRight size={14} />
        </button>
      </div>

      {/* KPI Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px'
      }}>
        <StatCard
          title="Monitored Projects"
          value={stats.totalMonitoredProjects.toLocaleString('en-IN')}
          subtitle={`Across ${stats.totalMinistriesMonitored} Ministries & ${stats.totalSectorsMonitored} Sectors`}
          icon={FolderKanban}
          color="cyan"
          deltaText="100% Monitored"
          deltaType="positive"
        />
        <StatCard
          title="Portfolio Outlay"
          value={`₹${stats.revisedCostTotalLakhCr}L Cr`}
          subtitle={`Orig Sanction: ₹${stats.originalCostTotalLakhCr}L Cr`}
          icon={IndianRupee}
          color="blue"
          deltaText={`+${stats.escalationPercentage}% Escalation`}
          deltaType="negative"
        />
        <StatCard
          title="Cumulative Expenditure"
          value={`₹${stats.cumulativeExpenditureLakhCr}L Cr`}
          subtitle={`Financial Burn Rate: ${stats.expenditureRatioPercent}%`}
          icon={TrendingUp}
          color="emerald"
          deltaText="On Budget Plan"
          deltaType="positive"
        />
        <StatCard
          title="Early Warning Flags"
          value={stats.projectsInRedAlert}
          subtitle="Critical Red alert threshold"
          icon={AlertOctagon}
          color="rose"
          deltaText="Requires PMG Action"
          deltaType="negative"
        />
        <StatCard
          title="Average Schedule Delay"
          value={`${stats.avgTimeOverrunMonths} Mo`}
          subtitle={`${stats.projectsWithTimeOverrun} delayed projects`}
          icon={Clock}
          color="amber"
          deltaText={`${stats.earlyWarningLeadTimeMonths} Mo Early Detection`}
          deltaType="positive"
        />
      </div>

      {/* S-Curve Chart & Portfolio Health */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))',
        gap: '20px'
      }}>
        <InteractiveSCurve />
        <PortfolioHealth />
      </div>

      {/* Sector Breakdown Table */}
      <SectorBreakdown 
        onSelectSector={(sector) => {
          onFilterSector(sector);
          onNavigateToTab('explorer');
        }} 
      />

      {/* Flagship Mega Projects Quick-Select Cards */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Layers size={18} color="var(--accent-cyan)" />
              High-Priority National Projects Under Active Surveillance
            </h4>
            <p style={{ fontSize: '0.74rem', color: 'var(--text-tertiary)', marginTop: '2px' }}>
              Select any project to inspect 360° telemetry, S-curves, milestone risk projections, and CUF records
            </p>
          </div>

          <button
            onClick={() => onNavigateToTab('explorer')}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--accent-cyan)',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            View All 1,981 Projects &rarr;
          </button>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
          gap: '14px'
        }}>
          {projects.slice(0, 4).map(project => (
            <div
              key={project.id}
              onClick={() => onSelectProject(project)}
              className="glass-panel glass-panel-interactive"
              style={{
                padding: '16px',
                cursor: 'pointer',
                // borderLeft: `4px solid ${
                //   project.riskLevel === 'CRITICAL' ? 'var(--accent-rose)' :
                //   project.riskLevel === 'HIGH' ? 'var(--accent-amber)' : 'var(--accent-emerald)'
                // }`
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>
                  {project.sector}
                </span>
                <span className={`badge badge-${project.riskLevel.toLowerCase()}`}>
                  {project.riskLevel}
                </span>
              </div>

              <h5 style={{
                fontSize: '0.86rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
                lineHeight: 1.3,
                marginBottom: '8px',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}>
                {project.name}
              </h5>

              <div style={{ fontSize: '0.73rem', color: 'var(--text-secondary)', marginBottom: '10px' }}>
                Agency: <strong>{project.implementingAgency}</strong>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '8px',
                padding: '8px 10px',
                background: 'var(--bg-tertiary)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.72rem'
              }}>
                <div>
                  <span style={{ color: 'var(--text-tertiary)' }}>Cost Overrun:</span>
                  <div className="num-mono" style={{
                    fontWeight: 700,
                    color: project.costOverrunPercent > 30 ? 'var(--accent-rose)' : 'var(--accent-emerald)'
                  }}>
                    +{project.costOverrunPercent.toFixed(1)}%
                  </div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-tertiary)' }}>Delay:</span>
                  <div className="num-mono" style={{
                    fontWeight: 700,
                    color: project.timeOverrunMonths > 24 ? 'var(--accent-amber)' : 'var(--text-secondary)'
                  }}>
                    {project.timeOverrunMonths} months
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
