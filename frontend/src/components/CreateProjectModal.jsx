import { useState } from 'react';
import { HiOutlineX } from 'react-icons/hi';
import toast from 'react-hot-toast';
import useProjectStore from '../store/projectStore';

export default function CreateProjectModal({ onClose }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const createProject = useProjectStore((s) => s.createProject);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createProject({ name, description: description || undefined });
      toast.success('Project created!');
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-light)] p-6 animate-scale-in">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold">Create Project</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:bg-white/5">
            <HiOutlineX size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">
              Project Name
            </label>
            <input
              id="project-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field"
              placeholder="e.g. Website Redesign"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">
              Description <span className="text-[var(--color-text-muted)]">(optional)</span>
            </label>
            <textarea
              id="project-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input-field resize-none"
              rows={3}
              placeholder="Brief description of the project..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-ghost">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
