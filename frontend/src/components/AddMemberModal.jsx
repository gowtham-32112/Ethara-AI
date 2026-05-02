import { useState } from 'react';
import { HiOutlineX } from 'react-icons/hi';
import toast from 'react-hot-toast';
import useProjectStore from '../store/projectStore';

export default function AddMemberModal({ projectId, onClose }) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('MEMBER');
  const [loading, setLoading] = useState(false);
  const addMember = useProjectStore((s) => s.addMember);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addMember(projectId, email, role);
      toast.success('Member added!');
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to add member');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-light)] p-6 animate-scale-in">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold">Add Member</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:bg-white/5">
            <HiOutlineX size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">
              Email Address
            </label>
            <input
              id="member-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="colleague@example.com"
              required
            />
            <p className="text-xs text-[var(--color-text-muted)] mt-1.5">
              The user must already have an account
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Role</label>
            <select
              id="member-role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="input-field"
            >
              <option value="MEMBER">Member — Can view project and update assigned tasks</option>
              <option value="ADMIN">Admin — Full control over tasks and members</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-ghost">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Adding...' : 'Add Member'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
