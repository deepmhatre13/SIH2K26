import { Link } from 'react-router-dom';

export default function NotFound() {
  return <div className="glass-panel" style={{ padding: '40px', textAlign: 'center' }}><h2>Page not found</h2><p style={{ margin: '12px 0 20px', color: 'var(--text-secondary)' }}>The requested PAIMANA workspace does not exist.</p><Link to="/dashboard" style={{ color: 'var(--accent-cyan)', fontWeight: 700 }}>Return to dashboard</Link></div>;
}
