import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  HiOutlineChartBar, HiOutlinePlus, HiOutlineUsers, HiOutlineArrowLeft,
  HiOutlineUserAdd, HiOutlineTrash,
} from 'react-icons/hi';
import toast from 'react-hot-toast';
import useProjectStore from '../store/projectStore';
import useTaskStore from '../store/taskStore';
import useAuthStore from '../store/authStore';
import KanbanBoard from '../components/KanbanBoard';
import CreateTaskModal from '../components/CreateTaskModal';
import AddMemberModal from '../components/AddMemberModal';

export default function ProjectDetailPage() {
  const { id } = useParams();
  const { user } = useAuthStore();
  const { currentProject, fetchProject, removeMember } = useProjectStore();
  const { fetchTasks } = useTaskStore();
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [activeTab, setActiveTab] = useState('board');

  // Find current user's role in this project
  const myMembership = currentProject?.members?.find((m) => m.user.id === user?.id);
  const isAdmin = myMembership?.role === 'ADMIN';

  useEffect(() => {
    fetchProject(id).catch(() => toast.error('Failed to load project'));
    fetchTasks(id).catch(() => toast.error('Failed to load tasks'));
  }, [id, fetchProject, fetchTasks]);

  const handleRemoveMember = async (userId, name) => {
    if (!confirm(`Remove ${name} from this project?`)) return;
    try {
      await removeMember(id, userId);
      toast.success('Member removed');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to remove member');
    }
  };

  if (!currentProject) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Breadcrumb + header */}
      <div className="mb-6">
        <Link
          to="/app/projects"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-colors mb-3"
        >
          <HiOutlineArrowLeft size={14} />
          Back to Projects
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-3">
              {currentProject.name}
              <span className={`badge ${isAdmin ? 'badge-admin' : 'badge-member'}`}>
                {myMembership?.role}
              </span>
            </h1>
            {currentProject.description && (
              <p className="text-sm text-[var(--color-text-secondary)] mt-1">
                {currentProject.description}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={`/app/projects/${id}/dashboard`}
              className="btn-ghost"
            >
              <HiOutlineChartBar size={16} />
              Dashboard
            </Link>
            {isAdmin && (
              <>
                <button onClick={() => setShowAddMember(true)} className="btn-ghost">
                  <HiOutlineUserAdd size={16} />
                  Add Member
                </button>
                <button onClick={() => setShowCreateTask(true)} className="btn-primary">
                  <HiOutlinePlus size={16} />
                  New Task
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-6 border-b border-[var(--color-border)]">
        {['board', 'members'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${
              activeTab === tab
                ? 'text-indigo-400 border-indigo-400'
                : 'text-[var(--color-text-muted)] border-transparent hover:text-[var(--color-text-secondary)]'
            }`}
          >
            {tab === 'members' && <HiOutlineUsers className="inline mr-1.5" size={14} />}
            {tab}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'board' && (
        <KanbanBoard projectId={id} isAdmin={isAdmin} members={currentProject.members} />
      )}

      {activeTab === 'members' && (
        <div className="space-y-2">
          {currentProject.members?.map((m) => (
            <div
              key={m.id}
              className="flex items-center justify-between p-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-light)]"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
                >
                  {m.user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium">{m.user.name}</p>
                  <p className="text-xs text-[var(--color-text-muted)]">{m.user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`badge ${m.role === 'ADMIN' ? 'badge-admin' : 'badge-member'}`}>
                  {m.role}
                </span>
                {isAdmin && m.user.id !== user.id && (
                  <button
                    onClick={() => handleRemoveMember(m.user.id, m.user.name)}
                    className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-red-400 hover:bg-red-400/10 transition-colors"
                  >
                    <HiOutlineTrash size={14} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      {showCreateTask && (
        <CreateTaskModal
          projectId={id}
          members={currentProject.members}
          onClose={() => setShowCreateTask(false)}
        />
      )}
      {showAddMember && (
        <AddMemberModal
          projectId={id}
          onClose={() => setShowAddMember(false)}
        />
      )}
    </div>
  );
}
