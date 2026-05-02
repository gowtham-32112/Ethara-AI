import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiOutlineUser, HiOutlineMail, HiOutlineLockClosed, HiOutlineViewGrid } from 'react-icons/hi';
import toast from 'react-hot-toast';
import useAuthStore from '../store/authStore';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [requestAdmin, setRequestAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  const register = useAuthStore((s) => s.register);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await register(name, email, password, requestAdmin);
      if (data.user.globalRole === 'PENDING_ADMIN') {
        toast.success('Your admin request is pending approval.', { duration: 4000 });
        navigate('/app/projects');
      } else if (data.user.globalRole === 'ADMIN') {
        toast.success('Account created!');
        navigate('/app/admin');
      } else {
        toast.success('Account created!');
        navigate('/app/projects');
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left — branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center relative overflow-hidden bg-gradient-to-br from-sky-400 to-cyan-600">
        <div className="absolute top-20 left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-300/20 rounded-full blur-3xl" />
        <div className="relative z-10 text-center px-12">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 bg-white/20 backdrop-blur-sm border border-white/30 shadow-xl">
            <HiOutlineViewGrid className="text-white text-3xl" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">Join TeamFlow</h1>
          <p className="text-sky-50 text-lg max-w-md font-medium">
            Create your workspace and start collaborating with your team in minutes.
          </p>
        </div>
      </div>

      {/* Right — register form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-[var(--color-surface)]">
        <div className="w-full max-w-md animate-fade-in">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-sky-500 to-cyan-500 shadow-md">
              <HiOutlineViewGrid className="text-white text-xl" />
            </div>
            <span className="text-xl font-bold text-slate-800 tracking-tight">
              TeamFlow
            </span>
          </div>

          <h2 className="text-2xl font-bold mb-1">Create an account</h2>
          <p className="text-[var(--color-text-secondary)] mb-8">Get started with your free workspace</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Full Name</label>
              <div className="relative">
                <HiOutlineUser className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
                <input
                  id="register-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-field pl-10"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Email</label>
              <div className="relative">
                <HiOutlineMail className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
                <input
                  id="register-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-10"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Password</label>
              <div className="relative">
                <HiOutlineLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
                <input
                  id="register-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-10"
                  placeholder="Min. 6 characters"
                  minLength={6}
                  required
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="request-admin"
                type="checkbox"
                checked={requestAdmin}
                onChange={(e) => setRequestAdmin(e.target.checked)}
                className="w-4 h-4 text-sky-600 bg-gray-100 border-gray-300 rounded focus:ring-sky-500"
              />
              <label htmlFor="request-admin" className="ml-2 text-sm font-medium text-[var(--color-text-secondary)]">
                Request Admin Access
              </label>
            </div>

            <button
              id="register-submit"
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-2.5"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-[var(--color-text-secondary)] mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-sky-600 hover:text-sky-500 font-semibold transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
