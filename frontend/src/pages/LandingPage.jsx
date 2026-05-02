import { Link } from 'react-router-dom';
import {
  HiOutlineViewGrid, HiOutlineClipboardList, HiOutlineUserGroup,
  HiOutlineChartBar, HiOutlineShieldCheck, HiOutlineLightningBolt,
  HiOutlineArrowRight, HiOutlineCheck, HiOutlineStar,
} from 'react-icons/hi';

const FEATURES = [
  {
    icon: HiOutlineClipboardList,
    title: 'Kanban Boards',
    desc: 'Visualize workflows with drag‑friendly columns — To Do, In Progress, Done — all in real time.',
    color: '#0ea5e9',
    bg: 'rgba(14,165,233,0.08)',
  },
  {
    icon: HiOutlineUserGroup,
    title: 'Team Collaboration',
    desc: 'Invite members, assign roles, and keep everyone aligned on responsibilities and deadlines.',
    color: '#8b5cf6',
    bg: 'rgba(139,92,246,0.08)',
  },
  {
    icon: HiOutlineChartBar,
    title: 'Live Dashboards',
    desc: 'Track progress with beautiful charts — task distribution, priority breakdown, and team velocity.',
    color: '#10b981',
    bg: 'rgba(16,185,129,0.08)',
  },
  {
    icon: HiOutlineShieldCheck,
    title: 'Role‑Based Access',
    desc: 'Admins manage projects and approve new admins. Members focus on their assigned tasks.',
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.08)',
  },
  {
    icon: HiOutlineLightningBolt,
    title: 'Instant Task Assignment',
    desc: 'Assign or reassign any task with one click — unassigned tasks are highlighted for quick action.',
    color: '#ef4444',
    bg: 'rgba(239,68,68,0.08)',
  },
  {
    icon: HiOutlineStar,
    title: 'Priority Management',
    desc: 'Classify tasks as High, Medium, or Low — overdue items are flagged automatically.',
    color: '#06b6d4',
    bg: 'rgba(6,182,212,0.08)',
  },
];

const STEPS = [
  { num: '01', title: 'Create a Project', desc: 'Start a new workspace for your team in seconds.' },
  { num: '02', title: 'Invite Your Team', desc: 'Add members by email and assign Admin or Member roles.' },
  { num: '03', title: 'Create & Assign Tasks', desc: 'Build your task board, set priorities, and assign owners.' },
  { num: '04', title: 'Track & Deliver', desc: 'Monitor progress on dashboards and ship on time, every time.' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* ─── Navbar ─────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/80 border-b border-slate-100">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br from-sky-500 to-cyan-500 shadow-lg shadow-sky-500/25">
              <HiOutlineViewGrid className="text-white text-lg" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900">
              Team<span className="text-sky-500">Flow</span>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-5 py-2.5 text-sm font-semibold text-white rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40 hover:-translate-y-0.5 transition-all"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </header>

      {/* ─── Hero ───────────────────────────── */}
      <section className="relative pt-32 pb-20 lg:pt-44 lg:pb-32 px-6">
        {/* Background blobs */}
        <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-sky-200/40 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-cyan-200/30 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-40 right-10 w-[200px] h-[200px] bg-violet-200/20 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-xs font-bold uppercase tracking-wider mb-6">
            <HiOutlineLightningBolt size={14} />
            Task management, simplified
          </div>

          <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1] mb-6">
            Manage tasks.
            <br />
            <span className="bg-gradient-to-r from-sky-500 via-cyan-500 to-teal-400 bg-clip-text text-transparent">
              Deliver results.
            </span>
          </h1>

          <p className="text-lg lg:text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            TeamFlow brings your projects, tasks, and teams together in one beautiful workspace.
            Kanban boards, real‑time dashboards, and role‑based access — everything you need to
            ship faster.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="flex items-center gap-2 px-8 py-3.5 text-base font-bold text-white rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-500 shadow-xl shadow-sky-500/25 hover:shadow-sky-500/40 hover:-translate-y-1 transition-all"
            >
              Start for Free
              <HiOutlineArrowRight size={18} />
            </Link>
            <Link
              to="/login"
              className="flex items-center gap-2 px-8 py-3.5 text-base font-semibold text-slate-600 rounded-2xl border-2 border-slate-200 hover:border-sky-300 hover:text-sky-600 transition-all"
            >
              Sign In
            </Link>
          </div>

          <p className="mt-6 text-xs text-slate-400 flex items-center justify-center gap-1.5">
            <HiOutlineCheck size={14} className="text-emerald-500" />
            No credit card required • Free forever for small teams
          </p>
        </div>
      </section>

      {/* ─── Preview mockup ─────────────────── */}
      <section className="relative px-6 pb-20">
        <div className="max-w-5xl mx-auto">
          <div className="rounded-2xl border border-slate-200 shadow-2xl shadow-slate-200/50 overflow-hidden bg-white">
            {/* Fake browser bar */}
            <div className="flex items-center gap-2 px-4 py-3 bg-slate-50 border-b border-slate-100">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
              </div>
              <div className="flex-1 mx-4">
                <div className="max-w-sm mx-auto h-6 rounded-md bg-slate-100 flex items-center justify-center text-[10px] text-slate-400 font-medium">
                  teamflow.app/projects
                </div>
              </div>
            </div>
            {/* Fake app content */}
            <div className="flex">
              {/* Sidebar preview */}
              <div className="hidden md:block w-52 border-r border-slate-100 p-4 bg-slate-50/50">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-6 h-6 rounded-md bg-gradient-to-br from-sky-500 to-cyan-500" />
                  <span className="text-xs font-bold text-slate-700">TeamFlow</span>
                </div>
                {['Projects', 'Admin Requests', 'Joined Users'].map((item, i) => (
                  <div
                    key={item}
                    className={`flex items-center gap-2 px-2 py-1.5 rounded-md text-xs mb-1 ${
                      i === 0 ? 'bg-sky-50 text-sky-600 font-semibold' : 'text-slate-400'
                    }`}
                  >
                    <div className={`w-3.5 h-3.5 rounded ${i === 0 ? 'bg-sky-500' : 'bg-slate-200'}`} />
                    {item}
                  </div>
                ))}
              </div>
              {/* Board preview */}
              <div className="flex-1 p-5">
                <div className="text-sm font-bold text-slate-700 mb-4">Website Redesign — Board</div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { col: 'To Do', color: '#94a3b8', tasks: ['Design homepage', 'Write API docs'] },
                    { col: 'In Progress', color: '#3b82f6', tasks: ['Build navbar', 'Auth flow'] },
                    { col: 'Done', color: '#10b981', tasks: ['Setup CI/CD'] },
                  ].map(({ col, color, tasks }) => (
                    <div key={col} className="rounded-lg overflow-hidden border border-slate-100">
                      <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5" style={{ color }}>
                        <div className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
                        {col}
                      </div>
                      <div className="p-2 space-y-2 bg-slate-50/50 min-h-[80px]">
                        {tasks.map((t) => (
                          <div key={t} className="rounded-md bg-white p-2 border border-slate-100 text-[11px] text-slate-600 font-medium shadow-sm">
                            {t}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Features ───────────────────────── */}
      <section id="features" className="py-20 lg:py-28 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-sky-500 mb-3 block">Features</span>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              Everything your team needs
            </h2>
            <p className="text-slate-500 mt-3 max-w-xl mx-auto">
              Powerful tools designed for teams of any size, from startups to enterprise.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                className="group rounded-2xl border border-slate-200 bg-white p-6 hover:border-sky-200 hover:shadow-lg hover:shadow-sky-50 transition-all duration-300"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: f.bg }}
                >
                  <f.icon size={22} style={{ color: f.color }} />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How It Works ───────────────────── */}
      <section className="py-20 lg:py-28 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-sky-500 mb-3 block">How It Works</span>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              Up and running in minutes
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((s, i) => (
              <div key={s.num} className="relative text-center group">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-500 text-white flex items-center justify-center text-lg font-extrabold mx-auto mb-4 shadow-lg shadow-sky-500/20 group-hover:scale-110 transition-transform">
                  {s.num}
                </div>
                <h3 className="text-base font-bold text-slate-800 mb-1.5">{s.title}</h3>
                <p className="text-sm text-slate-500">{s.desc}</p>
                {i < STEPS.length - 1 && (
                  <div className="hidden lg:block absolute top-7 left-[calc(50%+2rem)] w-[calc(100%-4rem)] h-px bg-gradient-to-r from-sky-200 to-transparent" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Showcase Stats ─────────────────── */}
      <section className="py-16 px-6 bg-gradient-to-r from-sky-500 to-cyan-500">
        <div className="max-w-5xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8 text-center text-white">
          {[
            { val: '10K+', label: 'Tasks Managed' },
            { val: '500+', label: 'Teams Active' },
            { val: '99.9%', label: 'Uptime' },
            { val: '4.9★', label: 'User Rating' },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-3xl lg:text-4xl font-extrabold mb-1">{s.val}</p>
              <p className="text-sky-100 text-sm font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── CTA ────────────────────────────── */}
      <section className="py-20 lg:py-28 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mb-5">
            Ready to supercharge
            <br />
            your team's workflow?
          </h2>
          <p className="text-lg text-slate-500 mb-10 max-w-lg mx-auto">
            Join hundreds of teams already using TeamFlow to deliver projects faster and with less stress.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-10 py-4 text-lg font-bold text-white rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-500 shadow-xl shadow-sky-500/25 hover:shadow-sky-500/40 hover:-translate-y-1 transition-all"
          >
            Get Started — It's Free
            <HiOutlineArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* ─── Footer ─────────────────────────── */}
      <footer className="border-t border-slate-100 py-10 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-sky-500 to-cyan-500 flex items-center justify-center">
              <HiOutlineViewGrid className="text-white text-sm" />
            </div>
            <span className="text-sm font-bold text-slate-700">
              Team<span className="text-sky-500">Flow</span>
            </span>
          </div>
          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} TeamFlow. Built for productive teams.
          </p>
          <div className="flex items-center gap-5 text-xs text-slate-400">
            <span className="hover:text-sky-500 cursor-pointer transition-colors">Privacy</span>
            <span className="hover:text-sky-500 cursor-pointer transition-colors">Terms</span>
            <span className="hover:text-sky-500 cursor-pointer transition-colors">Contact</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
