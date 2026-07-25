import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Bot, Sparkles, Send, Calendar, CheckCircle2, Clock } from 'lucide-react';

export const AIAssistantView: React.FC = () => {
  const { currentUser } = useApp();

  const [activeTab, setActiveTab] = useState<'chat' | 'planner'>('chat');

  // Chat State
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([
    {
      role: 'assistant',
      content: `Hello ${currentUser.name}! I am Flow AI, your intelligent study and productivity assistant. How can I assist you with your classes, assignments, or study roadmap today?`,
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Planner State
  const [goal, setGoal] = useState('Ace upcoming Physics & Computer Science exams');
  const [timeframeDays, setTimeframeDays] = useState(7);
  const [plannerLoading, setPlannerLoading] = useState(false);
  const [plannerResult, setPlannerResult] = useState<any>(null);

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg = { role: 'user' as const, content: inputText };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInputText('');
    setIsChatLoading(true);

    try {
      const response = await fetch('/api/ai/study-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages,
          context: { role: currentUser.role, name: currentUser.name },
        }),
      });

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: data.reply || 'I am ready to help!' },
      ]);
    } catch {
      // Handled
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleGeneratePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setPlannerLoading(true);

    try {
      const response = await fetch('/api/ai/study-planner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goal,
          timeframeDays,
          role: currentUser.role,
          subjectsOrProjects: ['Physics', 'Computer Science', 'Task Management'],
        }),
      });

      const data = await response.json();
      setPlannerResult(data);
    } catch {
      // Handled
    } finally {
      setPlannerLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-slate-900 flex items-center gap-2">
            <Bot className="w-6 h-6 text-pink-600" />
            Flow AI Assistant & Study Planner
          </h1>
          <p className="text-xs text-slate-500">
            Intelligent chat partner, personalized roadmap creator, and learning helper powered by Gemini.
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 bg-slate-100/80 rounded-2xl text-xs font-semibold border border-slate-200/60">
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'chat' ? 'bg-white text-pink-700 shadow-2xs font-serif font-bold' : 'text-slate-600'
            }`}
          >
            💬 Interactive Chat
          </button>
          <button
            onClick={() => setActiveTab('planner')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'planner' ? 'bg-white text-pink-700 shadow-2xs font-serif font-bold' : 'text-slate-600'
            }`}
          >
            📅 AI Study Planner
          </button>
        </div>
      </div>

      {activeTab === 'chat' ? (
        /* Chat View */
        <div className="rounded-3xl bg-white border border-pink-100 p-6 shadow-xs h-[calc(100vh-220px)] flex flex-col justify-between">
          <div className="flex-1 overflow-y-auto space-y-4 pr-1">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex items-start gap-3 ${
                  m.role === 'user' ? 'flex-row-reverse' : ''
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    m.role === 'user'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gradient-to-tr from-pink-500 to-rose-500 text-white shadow-xs'
                  }`}
                >
                  {m.role === 'user' ? 'U' : <Sparkles className="w-4 h-4 animate-pulse" />}
                </div>

                <div
                  className={`p-4 rounded-2xl text-xs leading-relaxed max-w-xl ${
                    m.role === 'user'
                      ? 'bg-purple-600 text-white rounded-tr-none font-medium'
                      : 'bg-pink-50/70 border border-pink-100 text-slate-800 rounded-tl-none'
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}

            {isChatLoading && (
              <div className="flex items-center gap-2 text-xs text-pink-600 font-semibold animate-pulse p-2">
                <Sparkles className="w-4 h-4" /> Flow AI is formulating an answer...
              </div>
            )}
          </div>

          <form onSubmit={handleSendChat} className="pt-4 border-t border-slate-100 flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask Flow AI about your physics formulas, REST APIs, or schedule..."
              className="flex-1 text-xs font-medium px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-pink-500"
            />
            <button
              type="submit"
              disabled={isChatLoading}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-xs shadow-md hover:opacity-90 transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
            >
              <Send className="w-4 h-4" /> Send
            </button>
          </form>
        </div>
      ) : (
        /* Planner View */
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white border border-pink-100 shadow-xs space-y-4">
            <h2 className="font-bold text-base text-slate-800 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-pink-600" />
              Generate Personalized Learning Roadmap
            </h2>

            <form onSubmit={handleGeneratePlan} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Learning Goal / Objective *</label>
                  <input
                    type="text"
                    required
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    className="w-full font-medium px-3.5 py-2.5 rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Timeframe (Days)</label>
                  <select
                    value={timeframeDays}
                    onChange={(e) => setTimeframeDays(Number(e.target.value))}
                    className="w-full font-medium px-3.5 py-2.5 rounded-xl border border-slate-200"
                  >
                    <option value={3}>3-Day Intensive Sprint</option>
                    <option value={7}>7-Day Standard Plan</option>
                    <option value={14}>14-Day Comprehensive Roadmap</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={plannerLoading}
                className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-xs shadow-md hover:opacity-90 transition-all cursor-pointer"
              >
                {plannerLoading ? 'Creating Roadmap with Gemini...' : 'Generate Roadmap'}
              </button>
            </form>
          </div>

          {/* Generated Plan Output */}
          {plannerResult && (
            <div className="p-6 rounded-3xl bg-white border border-pink-200 shadow-md space-y-6 animate-in fade-in duration-200">
              <div className="pb-4 border-b border-slate-100">
                <h3 className="text-lg font-black text-slate-800">{plannerResult.planTitle}</h3>
                <p className="text-xs text-pink-600 font-semibold mt-0.5">
                  Target: {plannerResult.totalHoursPerDay} hours/day study commitment
                </p>
              </div>

              <div className="space-y-4">
                {plannerResult.schedule?.map((dayItem: any, idx: number) => (
                  <div key={idx} className="p-4 rounded-2xl border border-pink-100 bg-pink-50/40 space-y-2 text-xs">
                    <div className="flex items-center justify-between font-bold text-slate-800">
                      <span>Day {dayItem.dayNumber}: {dayItem.title}</span>
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-pink-100 text-pink-800">
                        {dayItem.estimatedMinutes} mins
                      </span>
                    </div>

                    <p className="text-slate-600 font-medium">{dayItem.focusArea}</p>

                    <ul className="list-disc list-inside space-y-1 text-slate-700 pt-1">
                      {dayItem.tasks?.map((t: string, tidx: number) => (
                        <li key={tidx}>{t}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {plannerResult.expertTip && (
                <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 text-xs font-medium text-purple-800">
                  <strong>💡 Flow AI Expert Tip:</strong> {plannerResult.expertTip}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
