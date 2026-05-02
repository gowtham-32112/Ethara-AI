import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { HiOutlineViewGrid, HiOutlineFolder, HiOutlineLogout, HiOutlineMenu, HiOutlineX, HiOutlineShieldCheck, HiOutlineUserGroup } from 'react-icons/hi';
import useAuthStore from '../store/authStore';

export default function AppLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/app/projects', icon: HiOutlineFolder, label: 'Projects' },
  ];

  if (user?.globalRole === 'ADMIN') {
    navItems.push({ to: '/app/admin', icon: HiOutlineShieldCheck, label: 'Admin Requests' });
    navItems.push({ to: '/app/joined-users', icon: HiOutlineUserGroup, label: 'Joined Users' });
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 bg-white border-r border-[var(--color-border)] ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-[var(--color-border)]">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-sky-500 to-cyan-500 shadow-md shadow-sky-500/20">
            <HiOutlineViewGrid className="text-white text-lg" />
          </div>
          <span className="text-lg font-bold text-slate-800 tracking-tight">
            TeamFlow
          </span>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden ml-auto text-[var(--color-text-secondary)] hover:text-white"
          >
            <HiOutlineX size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/app/projects'}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-sky-50 text-sky-600'
                    : 'text-[var(--color-text-secondary)] hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* User section */}
        <div className="px-3 py-4 border-t border-[var(--color-border)]">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold bg-gradient-to-br from-sky-500 to-cyan-500 text-white shadow-sm">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-[var(--color-text-muted)] truncate">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-red-400 hover:bg-red-400/10 transition-colors"
              title="Logout"
            >
              <HiOutlineLogout size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center gap-3 px-4 py-3 border-b border-[var(--color-border)] bg-[var(--color-surface)]">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg text-[var(--color-text-secondary)] hover:bg-slate-100"
          >
            <HiOutlineMenu size={20} />
          </button>
          <span className="text-sm font-bold text-slate-800 tracking-tight">
            TeamFlow
          </span>
        </div>

        <div className="p-6 lg:p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
