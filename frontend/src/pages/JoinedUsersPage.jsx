import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { HiOutlineUserGroup, HiOutlineMail, HiOutlineClipboard } from 'react-icons/hi';
import api from '../services/api/client';
import useAuthStore from '../store/authStore';

export default function JoinedUsersPage() {
  const { user } = useAuthStore();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/admin/users');
      setUsers(data);
    } catch (err) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const copyEmail = (email) => {
    navigator.clipboard.writeText(email);
    toast.success(`Copied: ${email}`);
  };

  if (user?.globalRole !== 'ADMIN') {
    return (
      <div className="flex items-center justify-center h-full">
        <h2 className="text-xl font-bold text-slate-400">Unauthorized Access</h2>
      </div>
    );
  }

  const roleColors = {
    ADMIN: { bg: '#fff1f2', text: '#e11d48', border: '#fecdd3' },
    USER: { bg: '#f0f9ff', text: '#0284c7', border: '#bae6fd' },
    PENDING_ADMIN: { bg: '#fffbeb', text: '#d97706', border: '#fde68a' },
  };

  return (
    <div className="animate-fade-in max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">Joined Users</h1>
        <p className="text-[var(--color-text-secondary)]">
          All registered users — copy an email to quickly add members to projects.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-[var(--color-border)] overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--color-border)] flex items-center justify-between bg-[var(--color-surface-lighter)]">
          <h2 className="font-semibold text-lg flex items-center gap-2">
            <HiOutlineUserGroup className="text-sky-500" />
            All Users
          </h2>
          <span className="badge badge-member">{users.length}</span>
        </div>

        {loading ? (
          <div className="p-8 flex justify-center">
            <div className="w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center">
            <HiOutlineUserGroup className="mx-auto text-4xl text-slate-300 mb-3" />
            <h3 className="text-lg font-medium text-slate-700">No users yet</h3>
            <p className="text-sm text-slate-500">Users will appear here once they sign up.</p>
          </div>
        ) : (
          <div className="divide-y divide-[var(--color-border)]">
            {users.map((u) => {
              const rc = roleColors[u.globalRole] || roleColors.USER;
              return (
                <div key={u.id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-sm"
                      style={{ background: 'linear-gradient(135deg, #0ea5e9, #06b6d4)' }}
                    >
                      {u.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800 text-sm">{u.name}</h3>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <HiOutlineMail size={13} />
                        {u.email}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className="text-[0.65rem] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border"
                      style={{ background: rc.bg, color: rc.text, borderColor: rc.border }}
                    >
                      {u.globalRole === 'PENDING_ADMIN' ? 'Pending' : u.globalRole}
                    </span>
                    <button
                      onClick={() => copyEmail(u.email)}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-sky-600 hover:bg-sky-50 border border-transparent hover:border-sky-200 transition-all"
                      title="Copy email"
                    >
                      <HiOutlineClipboard size={14} />
                      Copy Email
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
