import { Activity, LockKeyhole } from 'lucide-react';
import { useEffect } from 'react';

import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  useEffect(() => {
    document.body.className = 'theme-light';
    return () => {
      document.body.className = 'theme-light';
    };
  }, []);

  return (
    <main className="login-page">
      <div className="login-page-grid" />
      <div className="login-shell">
        <header className="login-brand">
          <div className="login-brand-mark"><Activity size={21} /></div>
          <div>
            <strong>PAIMANA <span>AI</span></strong>
            <small>Infrastructure Monitoring & Analytics</small>
          </div>
        </header>
        <LoginForm />
        <p className="login-legal"><LockKeyhole size={13} /> Government of India monitoring network</p>
      </div>
    </main>
  )
}
