import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './store/authStore';
import AppLayout from './layouts/AppLayout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import DashboardPage from './pages/DashboardPage';
import AdminDashboard from './pages/AdminDashboard';
import JoinedUsersPage from './pages/JoinedUsersPage';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuthStore();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function GuestRoute({ children }) {
  const { user, loading } = useAuthStore();
  if (loading) return null;
  if (user) {
    return user.globalRole === 'ADMIN' ? <Navigate to="/app/admin" replace /> : <Navigate to="/app/projects" replace />;
  }
  return children;
}

function IndexRedirect() {
  const { user } = useAuthStore();
  if (user?.globalRole === 'ADMIN') return <Navigate to="/app/admin" replace />;
  return <Navigate to="/app/projects" replace />;
}

function LandingOrRedirect() {
  const { user, loading } = useAuthStore();
  if (loading) return null;
  if (user) {
    return user.globalRole === 'ADMIN' ? <Navigate to="/app/admin" replace /> : <Navigate to="/app/projects" replace />;
  }
  return <LandingPage />;
}

export default function App() {
  const init = useAuthStore((s) => s.init);

  useEffect(() => {
    init();
  }, [init]);

  return (
    <Routes>
      {/* Landing — public for guests, redirect if logged in */}
      <Route path="/" element={<LandingOrRedirect />} />

      {/* Auth routes */}
      <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
      <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />

      {/* Protected app routes */}
      <Route path="/app" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route index element={<IndexRedirect />} />
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="projects/:id" element={<ProjectDetailPage />} />
        <Route path="projects/:id/dashboard" element={<DashboardPage />} />
        <Route path="admin" element={<AdminDashboard />} />
        <Route path="joined-users" element={<JoinedUsersPage />} />
      </Route>

      {/* Legacy redirects */}
      <Route path="/projects" element={<Navigate to="/app/projects" replace />} />
      <Route path="/admin" element={<Navigate to="/app/admin" replace />} />
      <Route path="/joined-users" element={<Navigate to="/app/joined-users" replace />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
