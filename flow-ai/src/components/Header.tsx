import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import flowAiLogo from '../assets/images/flow_ai_icon_1784979923657.jpg';
import {
  Bell,
  Search,
  Sparkles,
  UserCheck,
  Award,
  ChevronDown,
  Check,
  CheckCircle2,
  ShieldAlert,
  LogIn,
  ShieldCheck,
} from 'lucide-react';
import { UserRole } from '../types';

interface HeaderProps {
  onOpenRoleModal: () => void;
  onSelectTab?: (tab: string) => void;
  onSearchQueryChange?: (q: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenRoleModal,
  onSelectTab,
  onSearchQueryChange,
}) => {
  const { currentUser, notifications, markNotificationRead, setCurrentView, firebaseUser, setIsAuthModalOpen } = useApp();
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [searchVal, setSearchVal] = useState('');

  const handleTabSelect = (tab: string) => {
    if (onSelectTab) {
      onSelectTab(tab);
    } else if (setCurrentView) {
      setCurrentView(tab);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read && n.userId === currentUser.id).length;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchVal(e.target.value);
    if (onSearchQueryChange) {
      onSearchQueryChange(e.target.value);
    }
  };

  const roleColors: Record<UserRole, { badge: string; text: string }> = {
    teacher: { badge: 'bg-pink-50 text-pink-700 border-pink-200/80', text: 'Teacher (Pro)' },
    student: { badge: 'bg-purple-50 text-purple-700 border-purple-200/80', text: 'Student' },
    entrepreneur: { badge: 'bg-rose-50 text-rose-700 border-rose-200/80', text: 'Entrepreneur / Pro' },
    admin: { badge: 'bg-slate-100 text-slate-800 border-slate-300/80', text: 'Platform Admin' },
  };

  return (
    <header className="sticky top-0 z-30 bg-white/85 backdrop-blur-md border-b border-pink-200/50 px-4 lg:px-8 py-3.5 flex items-center justify-between shadow-2xs">
      {/* Brand & Search */}
      <div className="flex items-center gap-6">
        <div
          onClick={() => handleTabSelect('dashboard')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-2xl overflow-hidden bg-gradient-to-tr from-pink-500 via-rose-400 to-purple-600 flex items-center justify-center text-white shadow-md shadow-pink-200/60 group-hover:scale-105 transition-all p-0.5 border border-pink-200/60">
            <img src={flowAiLogo} alt="Flow AI Logo" className="w-full h-full object-cover rounded-[14px]" referrerPolicy="no-referrer" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-2xl tracking-tight text-slate-900">
                Flow <span className="italic font-normal text-pink-600">AI</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block font-medium tracking-tight">
              Smart Learning & Productivity Platform
            </p>
          </div>
        </div>

        {/* Global Search */}
        <div className="hidden md:flex items-center relative w-64 lg:w-80">
          <Search className="w-4 h-4 absolute left-3.5 text-slate-400" />
          <input
            type="text"
            value={searchVal}
            onChange={handleSearchChange}
            placeholder="Search notes, tasks, classes..."
            className="w-full text-xs font-medium pl-9 pr-4 py-2 rounded-2xl bg-slate-50/80 border border-slate-200/80 focus:outline-none focus:border-pink-400 focus:bg-white transition-all text-slate-700 placeholder-slate-400 shadow-2xs"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* PKR 300 Teacher Subscription Tag */}
        {currentUser.role === 'teacher' && (
          <button
            onClick={() => handleTabSelect('subscription')}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200/80 text-xs font-semibold text-pink-700 hover:shadow-xs transition-all cursor-pointer"
            title="Manage Teacher Subscription"
          >
            <Award className="w-3.5 h-3.5 text-pink-600" />
            <span>PKR 300/mo Active</span>
          </button>
        )}

        {/* 100% Free Student Account Tag */}
        {currentUser.role === 'student' && (
          <button
            onClick={() => handleTabSelect('subscription')}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-xs font-semibold text-emerald-700 hover:shadow-xs transition-all cursor-pointer"
            title="Students access Flow AI 100% Free"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>100% Free Student Access</span>
          </button>
        )}

        {/* Authentication Button */}
        <button
          onClick={() => setIsAuthModalOpen(true)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl border text-xs font-semibold transition-all cursor-pointer shadow-2xs ${
            firebaseUser
              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
              : 'bg-white text-slate-700 border-slate-200 hover:border-pink-300'
          }`}
          title={firebaseUser ? `Account Active (${firebaseUser.email})` : 'Sign In'}
        >
          {firebaseUser ? (
            <>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden md:inline">Signed In</span>
            </>
          ) : (
            <>
              <LogIn className="w-3.5 h-3.5 text-pink-600" />
              <span>Sign In</span>
            </>
          )}
        </button>

        {/* Role Quick Switcher Badge */}
        <button
          onClick={onOpenRoleModal}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl border text-xs font-semibold transition-all cursor-pointer shadow-2xs ${roleColors[currentUser.role].badge}`}
        >
          <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse"></span>
          <span>Role: {roleColors[currentUser.role].text}</span>
          <ChevronDown className="w-3.5 h-3.5 ml-0.5 opacity-70" />
        </button>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifMenu(!showNotifMenu)}
            className="relative p-2 rounded-2xl bg-slate-50/80 hover:bg-pink-50 text-slate-600 hover:text-pink-600 border border-slate-200/80 transition-all cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-pink-600 text-white text-[10px] font-bold flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifMenu && (
            <div className="absolute right-0 mt-2 w-80 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-pink-200/80 p-3.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2 px-1">
                <span className="font-serif font-bold text-sm text-slate-900 flex items-center gap-1.5">
                  <Bell className="w-3.5 h-3.5 text-pink-500" /> Notifications
                </span>
                <span className="text-[10px] text-pink-600 font-semibold bg-pink-50 px-2 py-0.5 rounded-full border border-pink-200/60">
                  {unreadCount} new
                </span>
              </div>

              <div className="max-h-64 overflow-y-auto space-y-1.5 pr-1 text-xs">
                {notifications.filter((n) => n.userId === currentUser.id).length === 0 ? (
                  <p className="text-center py-4 text-slate-400 font-serif italic">No notifications yet.</p>
                ) : (
                  notifications
                    .filter((n) => n.userId === currentUser.id)
                    .map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => markNotificationRead(notif.id)}
                        className={`p-2.5 rounded-xl transition-all cursor-pointer border ${
                          notif.read
                            ? 'bg-slate-50/60 border-slate-100 text-slate-500'
                            : 'bg-pink-50/60 border-pink-200/80 text-slate-800 font-medium'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-[11px] text-pink-700">{notif.title}</span>
                          <span className="text-[9px] text-slate-400">{notif.createdAt}</span>
                        </div>
                        <p className="text-[11px] text-slate-600 line-clamp-2">{notif.message}</p>
                      </div>
                    ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar */}
        <div
          onClick={() => handleTabSelect('profile')}
          className="flex items-center gap-2.5 cursor-pointer p-1.5 rounded-2xl hover:bg-pink-50/60 transition-all border border-transparent hover:border-pink-200/50"
        >
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-8 h-8 rounded-2xl object-cover ring-2 ring-pink-200/80"
          />
          <div className="hidden lg:block text-left">
            <div className="flex items-center gap-1">
              <span className="text-xs font-bold text-slate-800 leading-tight">
                {currentUser.name}
              </span>
              {currentUser.isVerifiedTeacher && (
                <UserCheck className="w-3.5 h-3.5 text-pink-500" title="Verified Teacher" />
              )}
            </div>
            <span className="text-[10px] text-slate-400 block capitalize font-serif italic">
              {currentUser.role}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
