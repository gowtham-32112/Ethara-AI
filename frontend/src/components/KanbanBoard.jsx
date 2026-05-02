import { useState } from 'react';
import { HiOutlineClock, HiOutlineUser, HiOutlinePencil } from 'react-icons/hi';
import toast from 'react-hot-toast';
import useTaskStore from '../store/taskStore';
import useAuthStore from '../store/authStore';
import AssignTaskModal from './AssignTaskModal';

const COLUMNS = [
  { key: 'TODO', label: 'To Do', color: '#94a3b8', bg: 'rgba(148,163,184,0.08)' },
  { key: 'IN_PROGRESS', label: 'In Progress', color: '#3b82f6', bg: 'rgba(59,130,246,0.08)' },
  { key: 'DONE', label: 'Done', color: '#10b981', bg: 'rgba(16,185,129,0.08)' },
];

const PRIORITY_COLORS = {
  HIGH: { bg: 'rgba(239,68,68,0.12)', color: '#f87171', border: 'rgba(239,68,68,0.25)' },
  MEDIUM: { bg: 'rgba(245,158,11,0.12)', color: '#fbbf24', border: 'rgba(245,158,11,0.25)' },
  LOW: { bg: 'rgba(16,185,129,0.12)', color: '#34d399', border: 'rgba(16,185,129,0.25)' },
};

export default function KanbanBoard({ projectId, isAdmin, members }) {
  const { tasks, updateTask, deleteTask } = useTaskStore();
  const { user } = useAuthStore();
  const [assigningTask, setAssigningTask] = useState(null);

  const grouped = {
    TODO: tasks.filter((t) => t.status === 'TODO'),
    IN_PROGRESS: tasks.filter((t) => t.status === 'IN_PROGRESS'),
    DONE: tasks.filter((t) => t.status === 'DONE'),
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await updateTask(taskId, { status: newStatus });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update task');
    }
  };

  const handleDelete = async (taskId) => {
    if (!confirm('Delete this task?')) return;
    try {
      await deleteTask(taskId);
      toast.success('Task deleted');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to delete task');
    }
  };

  const isOverdue = (task) => {
    if (!task.dueDate || task.status === 'DONE') return false;
    return new Date(task.dueDate) < new Date();
  };

  const canUpdateTask = (task) => {
    if (isAdmin) return true;
    return task.assigneeId === user?.id;
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {COLUMNS.map((col) => (
          <div key={col.key} className="rounded-xl border border-[var(--color-border)] overflow-hidden">
            {/* Column header */}
            <div
              className="px-4 py-3 flex items-center justify-between"
              style={{ background: col.bg }}
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ background: col.color }} />
                <span className="text-sm font-semibold" style={{ color: col.color }}>
                  {col.label}
                </span>
              </div>
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-white/5 text-[var(--color-text-muted)]">
                {grouped[col.key].length}
              </span>
            </div>

            {/* Cards */}
            <div className="p-2 space-y-2 min-h-[200px] bg-[var(--color-surface)]/50">
              {grouped[col.key].length === 0 && (
                <div className="text-center py-8 text-xs text-[var(--color-text-muted)]">
                  No tasks
                </div>
              )}

              {grouped[col.key].map((task) => {
                const prio = PRIORITY_COLORS[task.priority];
                const overdue = isOverdue(task);

                return (
                  <div
                    key={task.id}
                    className="group rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-light)] p-3.5 hover:border-sky-400/30 transition-all duration-150"
                  >
                    {/* Priority + actions */}
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className="text-[0.65rem] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                        style={{ background: prio.bg, color: prio.color, border: `1px solid ${prio.border}` }}
                      >
                        {task.priority}
                      </span>

                      <div className="flex items-center gap-1">
                        {/* Assign/Edit button — shows on unassigned tasks OR all tasks for admin */}
                        {isAdmin && (
                          <button
                            onClick={() => setAssigningTask(task)}
                            className="opacity-0 group-hover:opacity-100 text-[var(--color-text-muted)] hover:text-sky-500 transition-all text-xs p-0.5"
                            title={task.assignee ? 'Reassign task' : 'Assign task'}
                          >
                            <HiOutlinePencil size={14} />
                          </button>
                        )}
                        {isAdmin && (
                          <button
                            onClick={() => handleDelete(task.id)}
                            className="opacity-0 group-hover:opacity-100 text-[var(--color-text-muted)] hover:text-red-400 transition-all text-xs p-0.5"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Title */}
                    <h4 className="text-sm font-medium mb-1.5 leading-snug">{task.title}</h4>
                    {task.description && (
                      <p className="text-xs text-[var(--color-text-muted)] line-clamp-2 mb-3">
                        {task.description}
                      </p>
                    )}

                    {/* Meta row */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {task.assignee && (
                          <div className="flex items-center gap-1 text-xs text-[var(--color-text-secondary)]">
                            <div
                              className="w-5 h-5 rounded-full flex items-center justify-center text-[0.6rem] font-bold text-white"
                              style={{ background: 'linear-gradient(135deg, #0ea5e9, #06b6d4)' }}
                            >
                              {task.assignee.name.charAt(0)}
                            </div>
                            <span className="hidden sm:inline">{task.assignee.name.split(' ')[0]}</span>
                          </div>
                        )}
                        {!task.assignee && (
                          <button
                            onClick={() => isAdmin && setAssigningTask(task)}
                            className={`text-xs flex items-center gap-1 px-1.5 py-0.5 rounded ${
                              isAdmin
                                ? 'text-amber-600 bg-amber-50 hover:bg-amber-100 border border-amber-200 cursor-pointer transition-colors'
                                : 'text-[var(--color-text-muted)]'
                            }`}
                            disabled={!isAdmin}
                          >
                            <HiOutlineUser size={12} />
                            {isAdmin ? 'Assign' : 'Unassigned'}
                          </button>
                        )}
                      </div>

                      {task.dueDate && (
                        <span className={`text-xs flex items-center gap-1 ${overdue ? 'text-red-400' : 'text-[var(--color-text-muted)]'}`}>
                          <HiOutlineClock size={12} />
                          {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      )}
                    </div>

                    {/* Status transition buttons */}
                    {canUpdateTask(task) && (
                      <div className="flex gap-1.5 mt-3 pt-3 border-t border-[var(--color-border)]">
                        {COLUMNS.filter((c) => c.key !== task.status).map((c) => (
                          <button
                            key={c.key}
                            onClick={() => handleStatusChange(task.id, c.key)}
                            className="flex-1 text-[0.65rem] font-medium py-1 rounded-md transition-colors"
                            style={{
                              background: c.bg,
                              color: c.color,
                              border: `1px solid transparent`,
                            }}
                            onMouseEnter={(e) => e.target.style.borderColor = c.color + '40'}
                            onMouseLeave={(e) => e.target.style.borderColor = 'transparent'}
                          >
                            → {c.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Assign Task Modal */}
      {assigningTask && (
        <AssignTaskModal
          task={assigningTask}
          members={members}
          onClose={() => setAssigningTask(null)}
        />
      )}
    </>
  );
}
