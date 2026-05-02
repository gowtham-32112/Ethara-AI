import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  HiOutlineArrowLeft, HiOutlineClipboardList, HiOutlineClock,
  HiOutlineCheckCircle, HiOutlineExclamation,
} from 'react-icons/hi';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import toast from 'react-hot-toast';
import useTaskStore from '../store/taskStore';

const STATUS_COLORS = {
  TODO: '#94a3b8',
  IN_PROGRESS: '#3b82f6',
  DONE: '#10b981',
};

const PRIORITY_COLORS = {
  LOW: '#34d399',
  MEDIUM: '#fbbf24',
  HIGH: '#f87171',
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-lg px-3 py-2 text-xs">
      <p className="font-medium text-[var(--color-text)]">{label || payload[0]?.name}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color || p.fill }}>
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
};

export default function DashboardPage() {
  const { id } = useParams();
  const { dashboard, fetchDashboard } = useTaskStore();

  useEffect(() => {
    fetchDashboard(id).catch(() => toast.error('Failed to load dashboard'));
  }, [id, fetchDashboard]);

  if (!dashboard) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const statusData = Object.entries(dashboard.byStatus).map(([name, value]) => ({
    name: name === 'IN_PROGRESS' ? 'In Progress' : name === 'TODO' ? 'To Do' : 'Done',
    value,
    fill: STATUS_COLORS[name],
  }));

  const priorityData = Object.entries(dashboard.byPriority).map(([name, value]) => ({
    name,
    value,
    fill: PRIORITY_COLORS[name],
  }));

  const userData = dashboard.tasksByUser.map((u) => ({
    name: u.user.name.split(' ')[0],
    Total: u.total,
    Done: u.done,
    Pending: u.total - u.done,
  }));

  const statCards = [
    {
      label: 'Total Tasks',
      value: dashboard.totalTasks,
      icon: HiOutlineClipboardList,
      color: '#818cf8',
      bg: 'rgba(129,140,248,0.1)',
    },
    {
      label: 'In Progress',
      value: dashboard.byStatus.IN_PROGRESS,
      icon: HiOutlineClock,
      color: '#3b82f6',
      bg: 'rgba(59,130,246,0.1)',
    },
    {
      label: 'Completed',
      value: dashboard.byStatus.DONE,
      icon: HiOutlineCheckCircle,
      color: '#10b981',
      bg: 'rgba(16,185,129,0.1)',
    },
    {
      label: 'Overdue',
      value: dashboard.overdueCount,
      icon: HiOutlineExclamation,
      color: '#ef4444',
      bg: 'rgba(239,68,68,0.1)',
    },
  ];

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-6">
        <Link
          to={`/app/projects/${id}`}
          className="inline-flex items-center gap-1.5 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-colors mb-3"
        >
          <HiOutlineArrowLeft size={14} />
          Back to Board
        </Link>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">
          Overview of project progress and team performance
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card, i) => (
          <div
            key={card.label}
            className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-light)] p-4 animate-fade-in"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ background: card.bg }}
              >
                <card.icon size={18} style={{ color: card.color }} />
              </div>
            </div>
            <p className="text-2xl font-bold" style={{ color: card.color }}>{card.value}</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Status distribution */}
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-light)] p-5">
          <h3 className="text-sm font-semibold mb-4">Task Status Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                dataKey="value"
                stroke="none"
                paddingAngle={3}
              >
                {statusData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                iconType="circle"
                iconSize={8}
                formatter={(value) => <span className="text-xs text-[var(--color-text-secondary)]">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Priority breakdown */}
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-light)] p-5">
          <h3 className="text-sm font-semibold mb-4">Priority Breakdown</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={priorityData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                dataKey="value"
                stroke="none"
                paddingAngle={3}
              >
                {priorityData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                iconType="circle"
                iconSize={8}
                formatter={(value) => <span className="text-xs text-[var(--color-text-secondary)]">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tasks per user */}
      {userData.length > 0 && (
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-light)] p-5 mb-8">
          <h3 className="text-sm font-semibold mb-4">Tasks per Team Member</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={userData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(51,65,85,0.5)" />
              <XAxis
                dataKey="name"
                tick={{ fill: '#94a3b8', fontSize: 12 }}
                axisLine={{ stroke: '#334155' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#94a3b8', fontSize: 12 }}
                axisLine={{ stroke: '#334155' }}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                iconType="circle"
                iconSize={8}
                formatter={(value) => <span className="text-xs text-[var(--color-text-secondary)]">{value}</span>}
              />
              <Bar dataKey="Done" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Pending" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Overdue tasks */}
      {dashboard.overdueTasks?.length > 0 && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-5">
          <h3 className="text-sm font-semibold text-red-400 mb-4 flex items-center gap-2">
            <HiOutlineExclamation size={16} />
            Overdue Tasks ({dashboard.overdueCount})
          </h3>
          <div className="space-y-2">
            {dashboard.overdueTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between p-3 rounded-lg bg-[var(--color-surface-light)] border border-[var(--color-border)]"
              >
                <div className="flex items-center gap-3">
                  <span className={`badge badge-${task.priority.toLowerCase()}`}>
                    {task.priority}
                  </span>
                  <span className="text-sm">{task.title}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-[var(--color-text-muted)]">
                  {task.assignee && (
                    <span>{task.assignee.name}</span>
                  )}
                  <span className="text-red-400">
                    Due {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
