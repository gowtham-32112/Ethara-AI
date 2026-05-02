import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { HiOutlineUserAdd, HiOutlineCheckCircle, HiOutlineXCircle } from 'react-icons/hi';
import api from '../services/api/client';
import useAuthStore from '../store/authStore';

export default function AdminDashboard() {
  const { user } = useAuthStore();
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  const fetchPendingRequests = async () => {
    try {
      const { data } = await api.get('/admin/pending');
      setPendingUsers(data);
    } catch (err) {
      toast.error('Failed to load pending admin requests');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await api.post(`/admin/approve/${id}`);
      toast.success('Admin request approved');
      fetchPendingRequests();
    } catch (err) {
      toast.error('Failed to approve request');
    }
  };

  const handleReject = async (id) => {
    try {
      await api.post(`/admin/reject/${id}`);
      toast.success('Admin request rejected');
      fetchPendingRequests();
    } catch (err) {
      toast.error('Failed to reject request');
    }
  };

  if (user?.globalRole !== 'ADMIN') {
    return (
      <div className="flex items-center justify-center h-full">
        <h2 className="text-xl font-bold text-slate-400">Unauthorized Access</h2>
      </div>
    );
  }

  return (
    <div className="animate-fade-in max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">Admin Requests</h1>
        <p className="text-[var(--color-text-secondary)]">Review and approve new admin access requests.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-[var(--color-border)] overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--color-border)] flex items-center justify-between bg-[var(--color-surface-lighter)]">
          <h2 className="font-semibold text-lg flex items-center gap-2">
            <HiOutlineUserAdd className="text-sky-500" />
            Pending Admin Requests
          </h2>
          <span className="badge badge-member">{pendingUsers.length}</span>
        </div>

        {loading ? (
          <div className="p-8 flex justify-center">
            <div className="w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : pendingUsers.length === 0 ? (
          <div className="p-12 text-center">
            <HiOutlineCheckCircle className="mx-auto text-4xl text-slate-300 mb-3" />
            <h3 className="text-lg font-medium text-slate-700">All caught up</h3>
            <p className="text-sm text-slate-500">No pending admin requests at this time.</p>
          </div>
        ) : (
          <div className="divide-y divide-[var(--color-border)]">
            {pendingUsers.map((u) => (
              <div key={u.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div>
                  <h3 className="font-semibold text-slate-800">{u.name}</h3>
                  <p className="text-sm text-slate-500">{u.email}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleReject(u.id)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-all"
                  >
                    <HiOutlineXCircle size={18} />
                    Reject
                  </button>
                  <button
                    onClick={() => handleApprove(u.id)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium text-emerald-600 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-all"
                  >
                    <HiOutlineCheckCircle size={18} />
                    Approve
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
