import { useNavigate, useOutletContext } from 'react-router-dom';
import { ExecutiveDashboard } from '../components/dashboard/ExecutiveDashboard';
import type { PageContext } from './pageTypes';

export default function Dashboard() {
  const navigate = useNavigate();
  const { projects, onSelectProject, onFilterSector } = useOutletContext<PageContext>();
  return <ExecutiveDashboard projects={projects} onSelectProject={onSelectProject} onNavigateToTab={(tabId) => navigate(`/${tabId}`)} onFilterSector={onFilterSector} />;
}
