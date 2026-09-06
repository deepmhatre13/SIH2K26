import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, Navigate, Outlet, RouterProvider } from 'react-router-dom';
import App from './App';
import LoginPage from './app/login';
import { AuthProvider } from './context/AuthProvider';
import { useAuth } from './context/authContext';
import Dashboard from './pages/Dashboard';
import Predictions from './pages/Predictions';
import Risk from './pages/Risk';
import Alerts from './pages/Alerts';
import Benchmarking from './pages/Benchmarking';
import CUF from './pages/CUF';
import Explorer from './pages/Explorer';
import NotFound from './pages/NotFound';
import 'tailwindcss';
import './index.css';

export function ProtectedLayout() {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>Checking secure session...</div>;
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  {
    element: <ProtectedLayout />,
    children: [{
      element: <App />,
      children: [
        { index: true, element: <Navigate to="/dashboard" replace /> },
        { path: 'dashboard', element: <Dashboard /> },
        { path: 'predictions', element: <Predictions /> },
        { path: 'risk', element: <Risk /> },
        { path: 'alerts', element: <Alerts /> },
        { path: 'benchmarking', element: <Benchmarking /> },
        { path: 'cuf', element: <CUF /> },
        { path: 'explorer', element: <Explorer /> },
      ],
    }],
  },
  { path: '*', element: <NotFound /> },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>,
);
