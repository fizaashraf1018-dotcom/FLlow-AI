import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  BookOpen,
  CheckSquare,
  Sparkles,
  TrendingUp,
  CreditCard,
  Plus,
  ArrowRight,
  Clock,
  UserCheck,
  Megaphone,
  Award,
  AlertCircle,
  FileText,
  Target,
} from 'lucide-react';

interface DashboardViewProps {
  onSelectTab?: (tab: string) => void;
  onNavigate?: (tab: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onSelectTab, onNavigate }) => {
  const {
    currentUser,
    classes,
    tasks,
    assignments,
    submissions,
    announcements,
    toggleTaskComplete,
    joinClassByCode,
  } = useApp();

  const handleSelect = (tab: string) => {
    if (onSelectTab) onSelectTab(tab);
    if (onNavigate) onNavigate(tab);
  };

  const [joinCode, setJoinCode] = useState('');
  const [joinMsg, setJoinMsg] = useState<{ text: string; isError: boolean } | null>(null);

  const userTasks = tasks.filter((t) => t.userId === currentUser.id);
  const pendingTasks = userTasks.filter((t) => !t.isCompleted);
  const userClasses = classes.filter(
    (c) => c.teacherId === currentUser.id || currentUser.role === 'student'
  );
  const pendingEvaluations = submissions.filter((s) => s.status === 'pending');

  const handleJoinClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCode.trim()) return;
    const success = joinClassByCode(joinCode);
    if (success) {
      setJoinMsg({ text: 'Successfully joined classroom!', isError: false });
      setJoinCode('');
      setTimeout(() => setJoinMsg(null), 3000);
    } else {
      setJoinMsg({ text: 'Invalid class code. Please check and try again.', isError: true });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Welcome Hero Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 p-6 md:p-8 text-white shadow-xl shadow-pink-200/60">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold text-white border border-white/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span className="capitalize font-sans">{currentUser.role} Workspace</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold tracking-tight text-white leading-tight">
              Welcome back, <span className="italic font-normal">{currentUser.name}</span>
            </h1>
            <p className="text-pink-100 text-xs md:text-sm font-medium leading-relaxed">
              {currentUser.role === 'teacher' &&
                'Manage your digital classrooms, evaluate assignments with AI assistance, and grow your recurring student subscription earnings.'}
              {currentUser.role === 'student' &&
                'Track your coursework, access teacher study materials, submit assignments, and get AI-assisted feedback.'}
              {currentUser.role === 'entrepreneur' &&
                'Organize workspace tasks, collaborate with team members, and track client deliverables efficiently.'}
              {currentUser.role === 'admin' &&
                'Audit platform growth, verify teacher applications, and monitor subscription health.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => handleSelect('ai-assistant')}
              className="px-4 py-2.5 rounded-2xl bg-white text-pink-700 font-bold text-xs shadow-md hover:bg-pink-50 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-pink-500 animate-spin" />
              <span>Ask Flow AI</span>
            </button>
            <button
              onClick={() => handleSelect('tasks')}
              className="px-4 py-2.5 rounded-2xl bg-white/15 backdrop-blur-md text-white font-bold text-xs hover:bg-white/25 transition-all border border-white/20 flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>New Task</span>
            </button>
          </div>
        </div>
      </div>

      {/* Teacher Subscription Notification Banner */}
      {currentUser.role === 'teacher' && (
        <div className="p-4 rounded-3xl bg-gradient-to-r from-pink-50 via-purple-50 to-rose-50 border border-pink-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-pink-100 text-pink-700 shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-serif font-bold text-slate-900">Teacher Subscription: PKR 300 / month</span>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Active Pro
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Next renewal date: {currentUser.subscriptionRenewsAt || '2026-08-15'}. Unlimited classes & AI Auto-grader enabled.
              </p>
            </div>
          </div>
          <button
            onClick={() => handleSelect('subscription')}
            className="px-4 py-2 rounded-2xl bg-pink-600 text-white text-xs font-bold hover:bg-pink-700 transition-all shadow-2xs shrink-0 cursor-pointer"
          >
            Manage Billing & Earnings
          </button>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div
          onClick={() => handleSelect('classes')}
          className="p-5 rounded-3xl bg-white/95 border border-pink-200/60 shadow-2xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Enrolled Classes</span>
            <div className="p-2.5 rounded-2xl bg-pink-50 text-pink-600 group-hover:scale-110 transition-all">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-serif font-bold text-slate-900">{userClasses.length}</div>
          <p className="text-[11px] text-pink-600 font-medium mt-1">Active learning spaces</p>
        </div>

        {/* Metric 2 */}
        <div
          onClick={() => handleSelect('tasks')}
          className="p-5 rounded-3xl bg-white/95 border border-pink-200/60 shadow-2xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Pending Tasks</span>
            <div className="p-2.5 rounded-2xl bg-purple-50 text-purple-600 group-hover:scale-110 transition-all">
              <CheckSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-serif font-bold text-slate-900">{pendingTasks.length}</div>
          <p className="text-[11px] text-purple-600 font-medium mt-1">
            {pendingTasks.filter((t) => t.priority === 'high').length} high priority
          </p>
        </div>

        {/* Metric 3 */}
        <div
          onClick={() => handleSelect('assignments')}
          className="p-5 rounded-3xl bg-white/95 border border-pink-200/60 shadow-2xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {currentUser.role === 'teacher' ? 'Submissions to Grade' : 'Active Assignments'}
            </span>
            <div className="p-2.5 rounded-2xl bg-rose-50 text-rose-600 group-hover:scale-110 transition-all">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-serif font-bold text-slate-900">
            {currentUser.role === 'teacher' ? pendingEvaluations.length : assignments.length}
          </div>
          <p className="text-[11px] text-rose-600 font-medium mt-1">
            {currentUser.role === 'teacher' ? 'Ready for AI Auto-Grader' : 'Coursework pending'}
          </p>
        </div>

        {/* Metric 4 */}
        <div
          onClick={() => handleSelect(currentUser.role === 'teacher' ? 'subscription' : 'progress')}
          className="p-5 rounded-3xl bg-white/95 border border-pink-200/60 shadow-2xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {currentUser.role === 'teacher' ? 'Monthly Rate' : 'Completion Rate'}
            </span>
            <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-600 group-hover:scale-110 transition-all">
              {currentUser.role === 'teacher' ? <CreditCard className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
            </div>
          </div>
          <div className="text-3xl font-serif font-bold text-slate-900">
            {currentUser.role === 'teacher' ? 'PKR 300' : '92%'}
          </div>
          <p className="text-[11px] text-emerald-600 font-medium mt-1">
            {currentUser.role === 'teacher' ? 'Recurring income active' : 'Top performer tier'}
          </p>
        </div>
      </div>

      {/* Main Grid: Left Tasks & Classes, Right Announcements & Join Class */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Tasks Widget */}
          <div className="p-6 rounded-3xl bg-white/95 border border-pink-200/60 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif font-bold text-xl text-slate-900">Priority Tasks & Objectives</h2>
                <p className="text-xs text-slate-500">Upcoming deliverables and workspace action items.</p>
              </div>
              <button
                onClick={() => handleSelect('tasks')}
                className="text-xs font-bold text-pink-600 hover:text-pink-700 flex items-center gap-1 cursor-pointer"
              >
                View All Tasks <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {pendingTasks.length === 0 ? (
                <div className="text-center py-6 border border-dashed border-slate-200 rounded-2xl">
                  <p className="text-xs text-slate-400 font-serif italic">All tasks completed! Great job! 🎉</p>
                </div>
              ) : (
                pendingTasks.slice(0, 4).map((task) => (
                  <div
                    key={task.id}
                    className="p-3.5 rounded-2xl border border-slate-200/60 bg-slate-50/50 hover:bg-pink-50/30 transition-all flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={task.isCompleted}
                        onChange={() => toggleTaskComplete(task.id)}
                        className="w-4 h-4 rounded-md accent-pink-600 cursor-pointer"
                      />
                      <div>
                        <p className="text-xs font-semibold text-slate-800 line-clamp-1">{task.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              task.priority === 'high'
                                ? 'bg-rose-100 text-rose-700 border border-rose-200'
                                : 'bg-purple-100 text-purple-700 border border-purple-200'
                            }`}
                          >
                            {task.priority.toUpperCase()}
                          </span>
                          <span className="text-[10px] text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Due {task.dueDate} {task.dueTime}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Featured Classes */}
          <div className="p-6 rounded-3xl bg-white/95 border border-pink-200/60 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif font-bold text-xl text-slate-900">Featured Classrooms</h2>
                <p className="text-xs text-slate-500">Access study materials, assignments, and discussions.</p>
              </div>
              <button
                onClick={() => handleSelect('classes')}
                className="text-xs font-bold text-pink-600 hover:text-pink-700 flex items-center gap-1 cursor-pointer"
              >
                Explore Classes <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {userClasses.slice(0, 2).map((cls) => (
                <div
                  key={cls.id}
                  onClick={() => handleSelect('classes')}
                  className="rounded-3xl border border-pink-200/60 overflow-hidden bg-white hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className={`p-4 bg-gradient-to-r ${cls.bannerGradient} text-white`}>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-black/20 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/20">
                      Code: {cls.code}
                    </span>
                    <h3 className="font-serif font-bold text-base mt-2 line-clamp-1 group-hover:underline">{cls.title}</h3>
                    <p className="text-[11px] text-white/90">{cls.subject}</p>
                  </div>
                  <div className="p-3.5 flex items-center justify-between text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <img src={cls.teacherAvatar} alt={cls.teacherName} className="w-6 h-6 rounded-full object-cover ring-1 ring-pink-200" />
                      <span className="text-[11px] font-semibold">{cls.teacherName}</span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-medium">{cls.studentCount} Students</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): Join Class + Announcements */}
        <div className="space-y-6">
          {/* Join Classroom Card */}
          <div className="p-6 rounded-3xl bg-white/95 border border-pink-200/60 shadow-xs space-y-3">
            <h3 className="font-serif font-bold text-base text-slate-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-pink-600" />
              Join Classroom
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Enter the 6-character class code provided by your teacher (e.g. <span className="font-mono text-pink-600 font-bold">PHYS-301</span>).
            </p>

            <form onSubmit={handleJoinClass} className="space-y-2.5">
              <input
                type="text"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
                placeholder="Class code (e.g. PHYS-301)"
                className="w-full text-xs font-semibold px-3.5 py-2.5 rounded-2xl border border-slate-200 focus:outline-none focus:border-pink-500 uppercase tracking-wider shadow-2xs"
              />
              <button
                type="submit"
                className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-xs shadow-xs hover:opacity-95 transition-all cursor-pointer"
              >
                Join Class
              </button>
            </form>

            {joinMsg && (
              <p
                className={`text-[11px] p-2.5 rounded-2xl border ${
                  joinMsg.isError ? 'bg-rose-50 border-rose-200 text-rose-600' : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                }`}
              >
                {joinMsg.text}
              </p>
            )}
          </div>

          {/* Announcements Widget */}
          <div className="p-6 rounded-3xl bg-white/95 border border-pink-200/60 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-base text-slate-900 flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-pink-600" />
                Class Announcements
              </h3>
              <button
                onClick={() => handleSelect('announcements')}
                className="text-xs font-bold text-pink-600 hover:text-pink-700 flex items-center gap-1 cursor-pointer bg-pink-50 px-2.5 py-1 rounded-full border border-pink-200/70"
              >
                {currentUser.role === 'teacher' ? 'Post & Manage' : 'View All'} <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {announcements.length === 0 ? (
                <p className="text-xs text-slate-400 font-serif italic">No announcements posted yet.</p>
              ) : (
                announcements.slice(0, 4).map((ann) => (
                  <div key={ann.id} className="p-3.5 rounded-2xl bg-gradient-to-r from-pink-50/70 to-purple-50/40 border border-pink-200/70 text-xs space-y-1">
                    <div className="flex items-center justify-between font-bold text-slate-900">
                      <span className="line-clamp-1">{ann.title}</span>
                      <span className="text-[10px] font-semibold text-pink-800 bg-pink-100/80 px-2 py-0.5 rounded-full shrink-0 ml-2">{ann.className}</span>
                    </div>
                    <p className="text-slate-600 text-[11px] leading-relaxed line-clamp-2">{ann.content}</p>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-pink-100/80">
                      <span>By {ann.authorName}</span>
                      <span>{ann.createdAt}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {currentUser.role === 'teacher' && (
              <button
                onClick={() => handleSelect('announcements')}
                className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-xs shadow-xs hover:opacity-95 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Publish New Broadcast</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
