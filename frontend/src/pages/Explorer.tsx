import { useOutletContext } from 'react-router-dom';
import { ProjectExplorer } from '../components/explorer/ProjectExplorer';
import type { PageContext } from './pageTypes';

export default function Explorer() {
  const { projects, sectorFilter, onSelectProject } = useOutletContext<PageContext>();
  return <ProjectExplorer projects={projects} onSelectProject={onSelectProject} initialSectorFilter={sectorFilter} />;
}
