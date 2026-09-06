import { useOutletContext } from 'react-router-dom';
import { RiskScoringFramework } from '../components/risk/RiskScoringFramework';
import type { PageContext } from './pageTypes';

export default function Risk() {
  const { projects, onSelectProject } = useOutletContext<PageContext>();
  return <RiskScoringFramework projects={projects} onSelectProject={onSelectProject} />;
}
