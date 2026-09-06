import { useOutletContext } from 'react-router-dom';
import { CostOverrunModel } from '../components/predictions/CostOverrunModel';
import { TimeOverrunModel } from '../components/predictions/TimeOverrunModel';
import type { PageContext } from './pageTypes';

export default function Predictions() {
  const { projects, onSelectProject } = useOutletContext<PageContext>();
  return <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}><CostOverrunModel projects={projects} onSelectProject={onSelectProject} /><div style={{ height: '1px', background: 'var(--border-subtle)' }} /><TimeOverrunModel projects={projects} onSelectProject={onSelectProject} /></div>;
}
