import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { AuthContext } from './authContext';

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(() => localStorage.getItem('paimana_user_email'));
  const [isLoading, setIsLoading] = useState(() => Boolean(localStorage.getItem('paimana_session')));

  const login = async (email: string, password: string) => {
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
  };

  const register = async (email: string, password: string) => {
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
  };

  const logout = () => {
    const sessionToken = localStorage.getItem('paimana_session');
    if (sessionToken) {
      void api.post('/auth/logout', null, { params: { session_token: sessionToken } });
    }
    localStorage.removeItem('paimana_session');
    localStorage.removeItem('paimana_user_email');
    setUserEmail(null);
    setIsAuthenticated(false);
  };

  useEffect(() => {
    const sessionToken = localStorage.getItem('paimana_session');
    if (!sessionToken) {
      return;
    }

    api.get('/auth/me')
      .then((response) => {
        const email = response.data.email as string;
        localStorage.setItem('paimana_user_email', email);
        setUserEmail(email);
        setIsAuthenticated(true);
      })
      .catch(() => {
        localStorage.removeItem('paimana_session');
        localStorage.removeItem('paimana_user_email');
        setUserEmail(null);
        setIsAuthenticated(false);
      })
      .finally(() => setIsLoading(false));

    const handleStorage = () => {
      setIsAuthenticated(Boolean(localStorage.getItem('paimana_session')));
      setUserEmail(localStorage.getItem('paimana_user_email'));
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, userEmail, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

