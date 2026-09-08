import React, { useCallback, useEffect, useState } from 'react';
import api from '../services/api';
import { AuthContext } from './authContext';

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(() => localStorage.getItem('paimana_user_email'));
  const [isLoading, setIsLoading] = useState(() => Boolean(localStorage.getItem('paimana_session')));

  const clearSession = useCallback(() => {
    localStorage.removeItem('paimana_session');
    localStorage.removeItem('paimana_user_email');
    setUserEmail(null);
    setIsAuthenticated(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      localStorage.setItem('paimana_session', response.data.session_token);
      localStorage.setItem('paimana_user_email', email.toLowerCase());
      setUserEmail(email.toLowerCase());
      setIsAuthenticated(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await api.post('/auth/register', { email, password });
      localStorage.setItem('paimana_session', response.data.session_token);
      localStorage.setItem('paimana_user_email', email.toLowerCase());
      setUserEmail(email.toLowerCase());
      setIsAuthenticated(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Memoised so the Google Identity Services effect in the login form does not
  // re-initialise the SDK / re-render the button on every AuthProvider render.
  const loginWithGoogle = useCallback(async (credential: string) => {
    setIsLoading(true);
    try {
      const response = await api.post('/auth/google', { credential });
      const googleEmail = (response.data.email ?? '') as string;
      localStorage.setItem('paimana_session', response.data.session_token);
      if (googleEmail) localStorage.setItem('paimana_user_email', googleEmail.toLowerCase());
      setUserEmail(googleEmail ? googleEmail.toLowerCase() : null);
      setIsAuthenticated(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = () => {
    const sessionToken = localStorage.getItem('paimana_session');
    if (sessionToken) {
      void api.post('/auth/logout', null, { params: { session_token: sessionToken } });
    }
    clearSession();
  };

  useEffect(() => {
    const validateSession = async () => {
      const sessionToken = localStorage.getItem('paimana_session');
      if (!sessionToken) {
        clearSession();
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await api.get('/auth/me');
        const email = response.data.email as string;
        localStorage.setItem('paimana_user_email', email);
        setUserEmail(email);
        setIsAuthenticated(true);
      } catch {
        clearSession();
      } finally {
        setIsLoading(false);
      }
    };

    void validateSession();

    const handleStorage = () => {
      void validateSession();
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, userEmail, isLoading, login, register, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

