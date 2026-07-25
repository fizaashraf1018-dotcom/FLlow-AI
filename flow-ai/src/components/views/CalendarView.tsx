import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight, CheckSquare, Target } from 'lucide-react';

export const CalendarView: React.FC = () => {
  const { tasks, assignments, quizzes } = useApp();
  const [currentMonth, setCurrentMonth] = useState('July 2026');

  // Days in month sample view
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-pink-600" />
            Calendar & Schedule Matrix
          </h1>
          <p className="text-xs text-slate-500">
            Track assignment due dates, quiz schedules, and personal task deadlines in one place.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-2xl border border-pink-100 shadow-2xs text-xs font-bold text-slate-700">
          <button className="p-1 hover:bg-slate-100 rounded-lg cursor-pointer">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span>{currentMonth}</span>
          <button className="p-1 hover:bg-slate-100 rounded-lg cursor-pointer">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="rounded-3xl bg-white border border-pink-100 p-6 shadow-xs space-y-4">
        {/* Days Header */}
        <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-pink-500 uppercase tracking-wider pb-2 border-b border-slate-100">
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-2">
          {days.map((day) => {
            const dateStr = `2026-07-${day.toString().padStart(2, '0')}`;
            const dayTasks = tasks.filter((t) => t.dueDate === dateStr);
            const dayAssignments = assignments.filter((a) => a.dueDate === dateStr);
            const isToday = day === 24;

            return (
              <div
                key={day}
                className={`min-h-[90px] p-2 rounded-2xl border transition-all ${
                  isToday
                    ? 'bg-pink-50/80 border-pink-400 font-bold shadow-2xs ring-2 ring-pink-200'
                    : 'bg-slate-50/40 border-slate-100 hover:border-pink-200 hover:bg-pink-50/20'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className={isToday ? 'text-pink-700 font-black' : 'text-slate-700 font-bold'}>
                    {day}
                  </span>
                  {isToday && (
                    <span className="text-[9px] font-extrabold text-pink-600 bg-pink-100 px-1.5 rounded-md">
                      Today
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  {dayTasks.map((t) => (
                    <div
                      key={t.id}
                      className="text-[10px] p-1 rounded-lg bg-purple-100 text-purple-800 font-semibold truncate"
                      title={t.title}
                    >
                      ✓ {t.title}
                    </div>
                  ))}

                  {dayAssignments.map((a) => (
                    <div
                      key={a.id}
                      className="text-[10px] p-1 rounded-lg bg-rose-100 text-rose-800 font-semibold truncate"
                      title={a.title}
                    >
                      🎯 {a.title}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
