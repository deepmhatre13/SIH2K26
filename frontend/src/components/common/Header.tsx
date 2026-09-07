import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  ShieldAlert, 
  Activity, 
  Bell, 
  Layers, 
  TrendingUp, 
  AlertTriangle, 
  Compass, 
  FileSpreadsheet, 
  Bot,
  LogOut
} from 'lucide-react';
import type { EarlyWarningAlert } from '../../types';
import { useAuth } from '../../context/authContext';

interface HeaderProps {
  alerts: EarlyWarningAlert[];
  onSearchSelect?: (projectId: string) => void;
  onOpenCopilot: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  alerts,
  onOpenCopilot
}) => {
  const navigate = useNavigate();
  const { userEmail, logout } = useAuth();
  const [time, setTime] = useState<string>('');
  const [showAlertDropdown, setShowAlertDropdown] = useState(false);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }) + ' IST');
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const criticalAlertsCount = alerts.filter(a => a.severity === 'CRITICAL').length;

  const navItems = [
    { id: 'dashboard', label: 'Executive Dashboard', icon: Activity },
    { id: 'predictions', label: 'Predictive Models', icon: TrendingUp },
    { id: 'risk', label: 'Risk Scoring (PCRI)', icon: ShieldAlert },
    { id: 'alerts', label: 'Early Warning (EWAS)', icon: AlertTriangle, badge: criticalAlertsCount },
    { id: 'benchmarking', label: 'Benchmarking', icon: Compass },
    { id: 'cuf', label: 'CUF Drivers & SHAP', icon: FileSpreadsheet },
    { id: 'explorer', label: 'Project Explorer', icon: Layers },
  ];

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 90, background: 'transparent', borderBottom: '1px solid var(--border-subtle)' }}>
      {/* Government of India Ribbon */}
      <div className="gov-ribbon" />

      {/* Top Utility & Identity Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 24px',
        borderBottom: '1px solid var(--border-subtle)'
      }}>
        {/* Left Branding */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {/* National Emblem & AI Seal */}
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #0b1e3b 0%, #06b6d4 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(6, 182, 212, 0.3)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <span style={{ fontWeight: 800, fontSize: '1.2rem', color: '#ffffff', letterSpacing: '-0.05em' }}>P</span>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '1.15rem', fontWeight: 800, letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                PAIMANA <span style={{ color: 'var(--accent-cyan)' }}>AI</span>
              </h1>
              <span className="badge badge-cyan" style={{ fontSize: '0.65rem', padding: '2px 7px' }}>
                MoSPI • IPMD
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.75rem', color: 'var(--accent-emerald)', background: 'rgba(16, 185, 129, 0.1)', padding: '2px 8px', borderRadius: '12px' }}>
                <span className="pulse-dot pulse-dot-emerald" />
                Live Telemetry (April 2026)
              </span>
            </div>
            <p style={{ fontSize: '0.73rem', color: 'var(--text-tertiary)', fontWeight: 500 }}>
              Project Assessment, Infrastructure Monitoring & Analytics for Nation-building
            </p>
          </div>
        </div>

        {/* Right Stats & Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Quick Portfolio Stats Pill */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            background: 'var(--bg-tertiary)',
            padding: '5px 12px',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.75rem',
            border: '1px solid var(--border-subtle)'
          }}>
            <div>
              <span style={{ color: 'var(--text-tertiary)' }}>Projects: </span>
              <strong className="num-mono" style={{ color: 'var(--text-primary)' }}>1,981</strong>
            </div>
            <div style={{ width: '1px', height: '12px', background: 'var(--border-medium)' }} />
            <div>
              <span style={{ color: 'var(--text-tertiary)' }}>Value: </span>
              <strong className="num-mono" style={{ color: 'var(--accent-cyan)' }}>₹42.78L Cr</strong>
            </div>
            <div style={{ width: '1px', height: '12px', background: 'var(--border-medium)' }} />
            <div className="num-mono" style={{ color: 'var(--text-secondary)', fontSize: '0.72rem' }}>
              {time}
            </div>
          </div>

          {/* AI Copilot Quick Launch Button */}
          <button
            onClick={onOpenCopilot}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 14px',
              borderRadius: 'var(--radius-full)',
              background: 'linear-gradient(135deg, #0284c7 0%, #06b6d4 100%)',
              color: '#ffffff',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.8rem',
              boxShadow: '0 2px 10px rgba(6, 182, 212, 0.35)',
              transition: 'transform 0.15s ease'
            }}
            onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.03)')}
            onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <Bot size={15} />
            <span>PAIMANA Copilot</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingLeft: '4px', borderLeft: '1px solid var(--border-subtle)' }}>
            <div title={userEmail || 'Signed-in user'} style={{ width: '34px', height: '34px', borderRadius: '50%', display: 'grid', placeItems: 'center', background: 'var(--accent-cyan)', color: '#07101c', fontWeight: 800, fontSize: '0.85rem' }}>
              {(userEmail?.[0] || 'U').toUpperCase()}
            </div>
            <button
              onClick={() => { logout(); navigate('/login', { replace: true }); }}
              title="Logout"
              aria-label="Logout"
              style={{ width: '34px', height: '34px', display: 'grid', placeItems: 'center', borderRadius: '50%', border: '1px solid var(--border-subtle)', background: 'var(--bg-tertiary)', color: 'var(--text-secondary)', cursor: 'pointer' }}
            >
              <LogOut size={15} />
            </button>
          </div>

          {/* Alert Notifications Center */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowAlertDropdown(!showAlertDropdown)}
              style={{
                position: 'relative',
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
              title="Early Warning Alerts"
            >
              <Bell size={16} />
              {criticalAlertsCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-2px',
                  right: '-2px',
                  background: 'var(--accent-rose)',
                  color: '#ffffff',
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 8px rgba(239, 68, 68, 0.6)'
                }}>
                  {criticalAlertsCount}
                </span>
              )}
            </button>

            {showAlertDropdown && (
              <div className="glass-panel" style={{
                position: 'absolute',
                top: '46px',
                right: 0,
                width: '340px',
                padding: '14px',
                zIndex: 100,
                boxShadow: 'var(--shadow-lg)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>Active Early Warnings ({alerts.length})</span>
                  <button 
                    onClick={() => { navigate('/alerts'); setShowAlertDropdown(false); }}
                    style={{ background: 'none', border: 'none', color: 'var(--accent-cyan)', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600 }}
                  >
                    View All &rarr;
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '280px', overflowY: 'auto' }}>
                  {alerts.slice(0, 4).map(alert => (
                    <div 
                      key={alert.id}
                      onClick={() => { navigate('/alerts'); setShowAlertDropdown(false); }}
                      style={{
                        padding: '8px 10px',
                        borderRadius: 'var(--radius-sm)',
                        background: alert.severity === 'CRITICAL' ? 'rgba(239, 68, 68, 0.1)' : 'var(--bg-tertiary)',
                        borderLeft: `3px solid ${alert.severity === 'CRITICAL' ? 'var(--accent-rose)' : 'var(--accent-amber)'}`,
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.7rem' }}>
                        <span style={{ fontWeight: 700, color: alert.severity === 'CRITICAL' ? 'var(--accent-rose)' : 'var(--accent-amber)' }}>{alert.severity}</span>
                        <span style={{ color: 'var(--text-tertiary)' }}>{alert.timestamp.split(' ')[0]}</span>
                      </div>
                      <p style={{ fontSize: '0.75rem', fontWeight: 600, marginTop: '2px', color: 'var(--text-primary)', lineHeight: 1.3 }}>
                        {alert.projectName}
                      </p>
                      <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '2px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                        {alert.headline}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Primary Navigation Tabs */}
      <nav style={{
        display: 'flex',
        alignItems: 'center',
        padding: '0 24px',
        overflowX: 'auto',
        gap: '4px',
        background: 'var(--bg-secondary)'
      }}>
        {navItems.map(item => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.id}
              to={`/${item.id === 'dashboard' ? 'dashboard' : item.id}`}
              className={({ isActive }) => isActive ? 'nav-tab nav-tab-active' : 'nav-tab'}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 16px',
                background: 'none',
                border: 'none',
                borderBottom: '2.5px solid transparent',
                color: 'var(--text-secondary)',
                fontWeight: 500,
                fontSize: '0.84rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'color var(--transition-fast), border-color var(--transition-fast)'
              }}
            >
              <Icon size={16} />
              <span>{item.label}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <span style={{
                  background: 'var(--accent-rose)',
                  color: '#ffffff',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  padding: '1px 6px',
                  borderRadius: '10px',
                  marginLeft: '2px'
                }}>
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>
    </header>
  );
};
