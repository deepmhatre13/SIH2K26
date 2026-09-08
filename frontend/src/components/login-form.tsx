import { LockKeyhole, Mail, ShieldCheck, Sparkles } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;

export function LoginForm() {
  const navigate = useNavigate();
  const { login, register, loginWithGoogle, isLoading } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  // No client ID configured -> show the placeholder button straight away;
  // otherwise it only appears if the GIS script fails to load.
  const [showGoogleFallback, setShowGoogleFallback] = useState(!GOOGLE_CLIENT_ID);
  const googleWrapRef = useRef<HTMLDivElement>(null);

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

  const handleGoogleCredential = useCallback(async (credential?: string) => {
    if (!credential) return;
    setError('');
    try {
      await loginWithGoogle(credential);
      navigate('/dashboard', { replace: true });
    } catch (requestError) {
      const responseError = requestError as { response?: { data?: { detail?: string } } };
      setError(responseError.response?.data?.detail || 'Google sign-in failed. Please try again.');
    }
  }, [loginWithGoogle, navigate]);

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return; // fallback button is already visible
    let cancelled = false;
    const renderWhenReady = (attemptsLeft: number) => {
      if (cancelled || !googleWrapRef.current) return;
      if (window.google?.accounts?.id) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: (response) => { void handleGoogleCredential(response.credential); },
        });
        // renderButton appends an iframe; clear first so a re-run of this effect
        // can never stack duplicate Google buttons.
        googleWrapRef.current.innerHTML = '';
        window.google.accounts.id.renderButton(googleWrapRef.current, {
          theme: 'filled_black',
          size: 'large',
          text: 'continue_with',
          shape: 'pill',
          logo_alignment: 'center',
        });
      } else if (attemptsLeft > 0) {
        window.setTimeout(() => renderWhenReady(attemptsLeft - 1), 250);
      } else {
        setShowGoogleFallback(true);
      }
    };
    renderWhenReady(20);
    return () => { cancelled = true; };
  }, [handleGoogleCredential]);

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

      <div className="login-divider"><span>or continue with</span></div>
      <div className="login-google-wrap" ref={googleWrapRef}>
        {showGoogleFallback && (
          <button
            type="button"
            className="login-google-fallback"
            onClick={() => setError(GOOGLE_CLIENT_ID
              ? 'Google sign-in could not load. Check your network connection and refresh the page.'
              : 'Google sign-in is not configured yet. Create an OAuth client ID and set VITE_GOOGLE_CLIENT_ID in frontend/.env (see .env.example).')}
          >
            <svg width="16" height="16" viewBox="0 0 18 18" aria-hidden="true">
              <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92a8.78 8.78 0 0 0 2.68-6.62z" />
              <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.32A9 9 0 0 0 9 18z" />
              <path fill="#FBBC05" d="M3.97 10.72a5.4 5.4 0 0 1 0-3.44V4.96H.96a9 9 0 0 0 0 8.08l3.01-2.32z" />
              <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.59A9 9 0 0 0 .96 4.96l3.01 2.32C4.68 5.16 6.66 3.58 9 3.58z" />
            </svg>
            Sign in with Google
          </button>
        )}
      </div>

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
