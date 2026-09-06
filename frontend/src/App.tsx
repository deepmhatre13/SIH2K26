import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Header } from './components/common/Header';
import { ProjectDetailModal } from './components/explorer/ProjectDetailModal';
import { ProjectIntelligenceCopilot } from './components/assistant/ProjectIntelligenceCopilot';
import { projectService } from './services/projectService';
import type { Project, EarlyWarningAlert, SectorType } from './types';
import { Bot } from 'lucide-react';
import "tailwindcss";
export const App: React.FC = () => {
  const navigate = useNavigate();
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [projects, setProjects] = useState<Project[]>([]);
  const [alerts, setAlerts] = useState<EarlyWarningAlert[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [sectorFilter, setSectorFilter] = useState<SectorType | 'ALL'>('ALL');
  const [loading, setLoading] = useState(true);

  // Synchronize theme with body class
  useEffect(() => {
    document.body.className = theme === 'dark' ? 'theme-dark' : 'theme-light';
  }, [theme]);

  // Load initial data
  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      setLoading(true);
      const [projList, alertList] = await Promise.all([
        projectService.getProjects(),
        projectService.getAlerts()
      ]);
      if (isMounted) {
        setProjects(projList);
        setAlerts(alertList);
        setLoading(false);
      }
    };
    loadData();
    return () => { isMounted = false; };
  }, []);

  const handleOpenProjectModal = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleOpenProjectById = (projectId: string) => {
    const proj = projects.find(p => p.id === projectId);
    if (proj) {
      setSelectedProject(proj);
      setIsModalOpen(true);
    }
  };

  const context = {
    projects,
    alerts,
    sectorFilter,
    onSelectProject: handleOpenProjectModal,
    onSelectProjectById: handleOpenProjectById,
    onFilterSector: (sector: SectorType) => {
      setSectorFilter(sector);
      navigate('/explorer');
    }
  };

  

  return (
    <div className="project-grid-shell" style={{ minHeight: '100vh', width: '100%', position: 'relative', display: 'flex', flexDirection: 'column' }}>
      <div
        className="project-grid-layer"
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
          backgroundImage: `
            linear-gradient(to right, #e5e7eb 1px, transparent 1px),
            linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          opacity: 0.82
        }}
      />
      <div className="project-grid-content" style={{ position: 'relative', zIndex: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Header Navigation */}
      <Header
        alerts={alerts}
        theme={theme}
        setTheme={setTheme}
        onOpenCopilot={() => setIsCopilotOpen(true)}
      />

      {/* Main Container */}
      <main style={{ flex: 1, padding: '24px', maxWidth: '1440px', margin: '0 auto', width: '100%' }}>
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '50vh', color: 'var(--text-secondary)' }}>
            <div style={{ textAlign: 'center' }}>
              <div className="pulse-dot pulse-dot-critical" style={{ width: '14px', height: '14px', marginBottom: '12px' }} />
              <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>Initializing PAIMANA AI Telemetry Stream...</p>
            </div>
          </div>
        ) : (
          <Outlet context={context} />
        )}
      </main>

      {/* Floating Copilot Launcher Icon */}
      {!isCopilotOpen && (
        <button
          onClick={() => setIsCopilotOpen(true)}
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 90,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 20px',
            borderRadius: 'var(--radius-full)',
            background: 'linear-gradient(135deg, #0284c7 0%, #06b6d4 100%)',
            color: '#070c18',
            border: 'none',
            fontWeight: 800,
            fontSize: '0.85rem',
            boxShadow: '0 4px 20px rgba(6, 182, 212, 0.45)',
            cursor: 'pointer',
            transition: 'transform 0.15s ease'
          }}
          onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
          onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          <Bot size={18} color="#070c18" />
          <span>PAIMANA Copilot</span>
        </button>
      )}

      {/* LLM Conversational Copilot Drawer */}
      <ProjectIntelligenceCopilot
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
        onOpenProject={handleOpenProjectById}
      />

      {/* 360° Project Dossier Modal */}
      <ProjectDetailModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedProject(null);
        }}
      />

      {/* Official Government Footer */}
      <footer style={{
        marginTop: 'auto',
        background: 'rgba(12, 20, 39, 0.88)',
        borderTop: '1px solid var(--border-subtle)',
        backdropFilter: 'blur(10px)',
        padding: '24px 24px',
        fontSize: '0.75rem',
        color: 'var(--text-tertiary)'
      }}>
        <div style={{
          maxWidth: '1440px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div>
            <strong style={{ color: 'var(--text-primary)' }}>PAIMANA AI Decision Support Ecosystem</strong> • Infrastructure & Project Monitoring Division (IPMD)
            <div style={{ marginTop: '2px' }}>
              Ministry of Statistics and Programme Implementation (MoSPI), Government of India • National Repository of ₹150 Cr+ Infrastructure Projects
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span>Data Baseline: April 2026</span>
            <span>•</span>
              <span>API Gateway: FastAPI Ready (:8000)</span>
            <span>•</span>
            <span style={{ color: 'var(--accent-emerald)' }}>System Status: Operational</span>
          </div>
        </div>
      </footer>
      </div>
    </div>
  );
};
export default App;
