import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineViewGrid } from 'react-icons/hi';
import toast from 'react-hot-toast';
import useAuthStore from '../store/authStore';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await login(email, password);
      toast.success('Welcome back!');
      if (data.user.globalRole === 'ADMIN') {
        navigate('/app/admin');
      } else {
        navigate('/app/projects');
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left — branding panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center relative overflow-hidden bg-gradient-to-br from-sky-400 to-cyan-600">
        {/* Floating circles */}
        <div className="absolute top-20 left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-300/20 rounded-full blur-3xl" />
        <div className="relative z-10 text-center px-12">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 bg-white/20 backdrop-blur-sm border border-white/30 shadow-xl">
            <HiOutlineViewGrid className="text-white text-3xl" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">TeamFlow</h1>
          <p className="text-sky-50 text-lg max-w-md font-medium">
            Streamline your team's workflow with intuitive task management, Kanban boards, and real-time dashboards.
          </p>
        </div>
      </div>

      {/* Right — login form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-[var(--color-surface)]">
        <div className="w-full max-w-md animate-fade-in">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-sky-500 to-cyan-500 shadow-md">
              <HiOutlineViewGrid className="text-white text-xl" />
            </div>
            <span className="text-xl font-bold text-slate-800 tracking-tight">
              TeamFlow
            </span>
          </div>

          <h2 className="text-2xl font-bold mb-1">Welcome back</h2>
          <p className="text-[var(--color-text-secondary)] mb-8">Sign in to continue to your workspace</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Email / Username</label>
              <div className="relative">
                <HiOutlineMail className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
                <input
                  id="login-email"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-10"
                  placeholder="admin or you@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Password</label>
              <div className="relative">
                <HiOutlineLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
                <input
                  id="login-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-10"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-2.5"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-[var(--color-text-secondary)] mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-sky-600 hover:text-sky-500 font-semibold transition-colors">
              Create one
            </Link>
          </p>

          {/* Demo credentials */}
          <div className="mt-8 p-4 rounded-xl border border-sky-100 bg-sky-50/50">
            <p className="text-xs font-bold text-sky-800 uppercase tracking-wider mb-2">Demo Accounts</p>
            <div className="space-y-1 text-xs text-sky-900/80 font-medium">
              <p><span className="text-sky-600 font-bold">Admin:</span> admin / admin123</p>
              <p><span className="text-slate-500 font-bold">User:</span> alice@example.com / admin123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
