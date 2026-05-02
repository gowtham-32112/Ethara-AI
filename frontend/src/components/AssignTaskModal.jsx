import { useState } from 'react';
import { HiOutlineX, HiOutlineUser } from 'react-icons/hi';
import toast from 'react-hot-toast';
import useTaskStore from '../store/taskStore';

export default function AssignTaskModal({ task, members, onClose }) {
  const [assigneeId, setAssigneeId] = useState(task.assigneeId || '');
  const [loading, setLoading] = useState(false);
  const updateTask = useTaskStore((s) => s.updateTask);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateTask(task.id, { assigneeId: assigneeId || null });
      toast.success(assigneeId ? 'Task assigned!' : 'Task unassigned');
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to assign task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-light)] p-6 animate-scale-in">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <HiOutlineUser className="text-sky-500" />
            Assign Task
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:bg-slate-100">
            <HiOutlineX size={18} />
          </button>
        </div>

        <div className="mb-4 p-3 rounded-lg bg-slate-50 border border-[var(--color-border)]">
          <p className="text-sm font-medium text-slate-700">{task.title}</p>
          {task.description && (
            <p className="text-xs text-slate-500 mt-1 line-clamp-2">{task.description}</p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">
              Assign to Member
            </label>
            <select
              id="assign-member"
              value={assigneeId}
              onChange={(e) => setAssigneeId(e.target.value)}
              className="input-field"
            >
              <option value="">— Unassigned —</option>
              {members?.map((m) => (
                <option key={m.user.id} value={m.user.id}>
                  {m.user.name} ({m.user.email})
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-ghost">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Saving...' : 'Save Assignment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
