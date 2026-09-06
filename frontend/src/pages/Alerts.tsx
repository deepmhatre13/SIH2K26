import { useOutletContext } from 'react-router-dom';
import { EarlyWarningSystem } from '../components/alerts/EarlyWarningSystem';
import type { PageContext } from './pageTypes';

export default function Alerts() {
  const { alerts, onSelectProjectById } = useOutletContext<PageContext>();
  return <EarlyWarningSystem alerts={alerts} onSelectProjectById={onSelectProjectById} />;
}
