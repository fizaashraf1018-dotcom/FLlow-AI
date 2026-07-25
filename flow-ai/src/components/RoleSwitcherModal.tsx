import React from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import {
  GraduationCap,
  BookOpenCheck,
  Briefcase,
  ShieldCheck,
  X,
  Check,
  Sparkles,
} from 'lucide-react';

interface RoleSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RoleSwitcherModal: React.FC<RoleSwitcherModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, switchRole } = useApp();

  if (!isOpen) return null;

  const roles: Array<{
    id: UserRole;
    title: string;
    subtitle: string;
    icon: any;
    color: string;
    features: string[];
  }> = [
    {
      id: 'teacher',
      title: 'Teacher / Educator',
      subtitle: 'PKR 300/month subscription',
      icon: BookOpenCheck,
      color: 'from-pink-500 to-rose-500',
      features: [
        'Create & manage classrooms',
        'Upload materials (PDF, DOCX, PPT, Videos)',
        'Create Assignments & Quizzes',
        'AI-assisted Assignment Evaluation & Feedback',
        'Earn PKR subscription revenue & tracking',
      ],
    },
    {
      id: 'student',
      title: 'Student',
      subtitle: '100% Free Access • No Fees',
      icon: GraduationCap,
      color: 'from-purple-500 to-indigo-500',
      features: [
        '100% free access to all enrolled classes',
        'Join classes with 6-digit code',
        'Access notes & download study materials',
        'Submit assignments & take timed quizzes',
        'Receive instant AI feedback & grading',
        'AI Study Assistant & chat with teachers',
      ],
    },
    {
      id: 'entrepreneur',
      title: 'Entrepreneur / Professional',
      subtitle: 'Workspace collaboration & tasks',
      icon: Briefcase,
      color: 'from-rose-500 to-amber-500',
      features: [
        'Task Manager with due dates & priority levels',
        'Calendar & Workspace collaboration',
        'Note & File Storage for project files',
        'Team Chat & progress analytics',
      ],
    },
    {
      id: 'admin',
      title: 'Platform Admin',
      subtitle: 'Audit & platform oversight',
      icon: ShieldCheck,
      color: 'from-slate-700 to-slate-900',
      features: [
        'Verify teacher accounts & subscriptions',
        'Manage platform content & classrooms',
        'View platform usage analytics',
      ],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-pink-100 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-2">
          <div className="p-2 rounded-xl bg-pink-100 text-pink-600">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Switch User Persona / Role</h2>
            <p className="text-xs text-slate-500">
              Test Flow AI features from the perspective of different user roles in real-time.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 my-5">
          {roles.map((r) => {
            const Icon = r.icon;
            const isSelected = currentUser.role === r.id;

            return (
              <div
                key={r.id}
                onClick={() => {
                  switchRole(r.id);
                  onClose();
                }}
                className={`p-4 rounded-2xl border cursor-pointer transition-all hover:scale-[1.02] ${
                  isSelected
                    ? 'border-pink-500 bg-gradient-to-b from-pink-50/80 to-purple-50/50 shadow-md ring-2 ring-pink-300'
                    : 'border-slate-200 bg-white hover:border-pink-200 hover:bg-slate-50/80'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-9 h-9 rounded-xl bg-gradient-to-br ${r.color} text-white flex items-center justify-center shadow-xs`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-800">{r.title}</h3>
                      <p className="text-[11px] font-medium text-pink-600">{r.subtitle}</p>
                    </div>
                  </div>
                  {isSelected && (
                    <span className="p-1 rounded-full bg-pink-600 text-white shadow-2xs">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>

                <ul className="space-y-1 mt-3 pt-2 border-t border-slate-100 text-[11px] text-slate-600">
                  {r.features.map((feat, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-pink-400 shrink-0"></span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <div className="bg-pink-50/70 border border-pink-200/80 rounded-2xl p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-bold text-slate-800">
              Current Active Persona: <span className="text-pink-600 capitalize">{currentUser.role}</span>
            </span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold text-xs shadow-xs hover:opacity-90 transition-all cursor-pointer"
          >
            Continue with {currentUser.name}
          </button>
        </div>
      </div>
    </div>
  );
};
