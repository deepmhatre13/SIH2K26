import { useState } from 'react';
import { LockKeyhole, Mail, ShieldCheck, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';

export function LoginForm() {
  const navigate = useNavigate();
  const { login, register, isLoading } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    try {
      if (mode === 'register') await register(email, password);
      else await login(email, password);
      navigate('/dashboard', { replace: true });
    } catch (requestError) {
      const responseError = requestError as { response?: { data?: { detail?: string } } };
      setError(responseError.response?.data?.detail || 'Unable to sign in. Check your credentials and try again.');
    }
  };

  return (
    <section className="login-card" aria-labelledby="login-title">
      <div className="login-card-header">
        <div className="login-seal"><ShieldCheck size={24} /></div>
        <div>
          <p className="login-eyebrow"><Sparkles size={13} /> SECURE ACCESS</p>
          <h1 id="login-title">{mode === 'login' ? 'Welcome back' : 'Create your account'}</h1>
          <p>{mode === 'login' ? 'Sign in to the PAIMANA AI command center.' : 'Register for the PAIMANA AI command center.'}</p>
        </div>
      </div>

      <form className="login-fields" onSubmit={handleSubmit}>
        <label htmlFor="email">Official email</label>
        <div className="login-input-wrap">
          <Mail size={17} aria-hidden="true" />
          <input id="email" type="email" placeholder="name@ministry.gov.in" value={email} onChange={(event) => setEmail(event.target.value)} required />
        </div>

        <div className="login-label-row">
          <label htmlFor="password">Password</label>
          <a href="#forgot-password">Forgot password?</a>
        </div>
        <div className="login-input-wrap">
          <LockKeyhole size={17} aria-hidden="true" />
          <input id="password" type="password" placeholder="Enter your password" value={password} onChange={(event) => setPassword(event.target.value)} required />
        </div>

        {error && <p className="login-error" role="alert">{error}</p>}
        <button className="login-submit" type="submit" disabled={isLoading}>
          {isLoading ? 'Please wait...' : mode === 'login' ? 'Sign in to PAIMANA' : 'Create PAIMANA account'}
        </button>
      </form>

      <div className="login-mode-switch">
        <span>{mode === 'login' ? 'New to PAIMANA?' : 'Already registered?'}</span>
        <button type="button" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}>
          {mode === 'login' ? 'Sign up' : 'Login'}
        </button>
      </div>

      <div className="login-card-footer">
        <span className="login-status-dot" />
        <span>MoSPI / IPMD secure monitoring environment</span>
      </div>
    </section>
  );
}
