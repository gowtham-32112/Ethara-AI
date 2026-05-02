import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlinePlus, HiOutlineFolder, HiOutlineUsers, HiOutlineClipboardList } from 'react-icons/hi';
import toast from 'react-hot-toast';
import useProjectStore from '../store/projectStore';
import useAuthStore from '../store/authStore';
import CreateProjectModal from '../components/CreateProjectModal';

export default function ProjectsPage() {
  const { projects, loading, fetchProjects } = useProjectStore();
  const { user } = useAuthStore();
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    fetchProjects().catch(() => toast.error('Failed to load projects'));
  }, [fetchProjects]);

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Projects</h1>
          <p className="text-[var(--color-text-secondary)] text-sm mt-1">
            Manage and track your team's projects
          </p>
        </div>
        {user?.globalRole === 'ADMIN' && (
          <button
            id="create-project-btn"
            onClick={() => setShowCreate(true)}
            className="btn-primary"
          >
            <HiOutlinePlus size={16} />
            New Project
          </button>
        )}
      </div>

      {/* Loading state */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 rounded-xl bg-[var(--color-surface-light)] animate-pulse" />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && projects.length === 0 && (
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 bg-[var(--color-surface-light)]">
            <HiOutlineFolder className="text-[var(--color-text-muted)] text-2xl" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No projects yet</h3>
          <p className="text-[var(--color-text-secondary)] text-sm mb-6">
            {user?.globalRole === 'ADMIN' ? 'Create your first project to get started' : 'You have not been assigned to any projects yet'}
          </p>
          {user?.globalRole === 'ADMIN' && (
            <button onClick={() => setShowCreate(true)} className="btn-primary mx-auto">
              <HiOutlinePlus size={16} />
              Create Project
            </button>
          )}
        </div>
      )}

      {/* Project grid */}
      {!loading && projects.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project, index) => (
            <Link
              key={project.id}
              to={`/app/projects/${project.id}`}
              className="group block rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-light)] p-5 hover:border-indigo-500/40 hover:bg-[var(--color-surface-lighter)]/50 transition-all duration-200 animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                     style={{
                       background: `linear-gradient(135deg, ${
                         ['#6366f1', '#8b5cf6', '#ec4899', '#06b6d4', '#f59e0b', '#10b981'][index % 6]
                       }, ${
                         ['#818cf8', '#a78bfa', '#f472b6', '#22d3ee', '#fbbf24', '#34d399'][index % 6]
                       })`,
                     }}>
                  <HiOutlineFolder className="text-white text-lg" />
                </div>
                <span className={`badge ${project.role === 'ADMIN' ? 'badge-admin' : 'badge-member'}`}>
                  {project.role}
                </span>
              </div>

              <h3 className="font-semibold text-lg mb-1 group-hover:text-indigo-400 transition-colors">
                {project.name}
              </h3>
              {project.description && (
                <p className="text-sm text-[var(--color-text-secondary)] line-clamp-2 mb-4">
                  {project.description}
                </p>
              )}

              <div className="flex items-center gap-4 text-xs text-[var(--color-text-muted)]">
                <span className="flex items-center gap-1">
                  <HiOutlineUsers size={14} />
                  {project.memberCount} members
                </span>
                <span className="flex items-center gap-1">
                  <HiOutlineClipboardList size={14} />
                  {project.taskCount} tasks
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Create modal */}
      {showCreate && <CreateProjectModal onClose={() => setShowCreate(false)} />}
    </div>
  );
}
