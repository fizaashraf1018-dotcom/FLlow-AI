import React from 'react';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  CheckSquare,
  BookOpen,
  FileText,
  Target,
  CheckCircle2,
  MessageSquare,
  Calendar as CalendarIcon,
  TrendingUp,
  Bot,
  CreditCard,
  User,
  Sparkles,
  Megaphone,
} from 'lucide-react';

interface SidebarProps {
  activeTab?: string;
  onSelectTab?: (tab: string) => void;
  activeView?: string;
  onSelectView?: (view: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  activeView,
  onSelectView,
}) => {
  const { currentUser, tasks, submissions } = useApp();

  const currentTab = activeTab || activeView || 'dashboard';
  const handleSelect = (tab: string) => {
    if (onSelectTab) onSelectTab(tab);
    if (onSelectView) onSelectView(tab);
  };

  const pendingTaskCount = tasks.filter((t) => !t.isCompleted && t.userId === currentUser.id).length;
  const pendingEvaluationCount = submissions.filter((s) => s.status === 'pending').length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare, badge: pendingTaskCount > 0 ? pendingTaskCount : null },
    { id: 'classes', label: 'My Classes', icon: BookOpen },
    { id: 'announcements', label: 'Announcements', icon: Megaphone },
    { id: 'notes', label: 'Notes & Files', icon: FileText },
    { id: 'assignments', label: 'Assignments', icon: Target, badge: currentUser.role === 'teacher' && pendingEvaluationCount > 0 ? `${pendingEvaluationCount} eval` : null },
    { id: 'quizzes', label: 'Quizzes', icon: CheckCircle2 },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'calendar', label: 'Calendar', icon: CalendarIcon },
    { id: 'progress', label: 'Progress', icon: TrendingUp },
    { id: 'ai-assistant', label: 'AI Assistant', icon: Bot, isAi: true },
    { id: 'subscription', label: 'Subscription & PKR', icon: CreditCard },
    { id: 'profile', label: 'Profile & Settings', icon: User },
  ];

  return (
    <aside className="w-64 bg-white/90 backdrop-blur-md border border-pink-200/50 rounded-3xl flex flex-col justify-between py-5 px-3 shrink-0 h-[calc(100vh-85px)] sticky top-[80px] overflow-y-auto hidden md:flex shadow-2xs">
      {/* Upper Navigation Links */}
      <div className="space-y-1">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-widest text-pink-600/90 font-sans">
          Main Workspace
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleSelect(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-pink-50 to-purple-50 text-pink-800 border border-pink-200/80 shadow-2xs'
                  : 'text-slate-600 hover:bg-pink-50/50 hover:text-pink-600'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 ${
                    isActive
                      ? 'text-pink-600'
                      : item.isAi
                      ? 'text-purple-500 animate-pulse'
                      : 'text-slate-400'
                  }`}
                />
                <span className={isActive ? 'font-serif font-semibold text-slate-900' : ''}>{item.label}</span>
              </div>

              {item.badge && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-pink-100 text-pink-700 border border-pink-200/80">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Promo Box for AI Features */}
      <div className="pt-4 border-t border-pink-100/80 mt-4">
        <div className="p-4 rounded-2xl bg-gradient-to-tr from-pink-500 via-rose-400 to-purple-600 text-white shadow-md shadow-pink-200/60 relative overflow-hidden">
          <div className="absolute -right-3 -bottom-3 w-16 h-16 rounded-full bg-white/10 blur-sm"></div>
          <div className="flex items-center gap-1.5 text-xs font-serif font-bold mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Flow AI Engine</span>
          </div>
          <p className="text-[11px] text-pink-100 leading-snug mb-3">
            Auto-grade assignments, check quizzes, and generate study plans using Gemini.
          </p>
          <button
            onClick={() => handleSelect('ai-assistant')}
            className="w-full py-1.5 px-3 rounded-xl bg-white text-pink-700 text-[11px] font-bold hover:bg-pink-50 transition-all text-center cursor-pointer shadow-2xs"
          >
            Launch AI Assistant →
          </button>
        </div>
      </div>
    </aside>
  );
};
