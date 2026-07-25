import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Megaphone, Plus, Search, Sparkles, Trash2, Bell, CheckCircle2, BookOpen, X, Send } from 'lucide-react';

export const AnnouncementsView: React.FC = () => {
  const { currentUser, classes, announcements, addAnnouncement, deleteAnnouncement } = useApp();

  const isTeacherOrAdmin = currentUser.role === 'teacher' || currentUser.role === 'admin';

  // Filters
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Post Announcement Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetClassId, setTargetClassId] = useState<string>(classes[0]?.id || 'all');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  // AI Draft Generator state
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    let targetClassName = 'All Classes (Broadcast)';
    if (targetClassId !== 'all') {
      const found = classes.find((c) => c.id === targetClassId);
      if (found) targetClassName = found.title;
    }

    addAnnouncement({
      classId: targetClassId,
      className: targetClassName,
      authorName: currentUser.name,
      title,
      content,
    });

    setTitle('');
    setContent('');
    setAiPrompt('');
    setIsModalOpen(false);
  };

  const handleGenerateAiDraft = () => {
    if (!aiPrompt.trim()) return;

    setIsGeneratingAi(true);
    setTimeout(() => {
      const topic = aiPrompt.trim();
      let selectedName = 'All Students';
      if (targetClassId !== 'all') {
        const found = classes.find((c) => c.id === targetClassId);
        if (found) selectedName = found.title;
      }

      setTitle(`📢 Important Update: ${topic}`);
      setContent(
        `Dear Students of ${selectedName},\n\nPlease take note regarding: ${topic}.\n\n• Make sure to review your course portal and upcoming deadlines.\n• Reach out during instructor office hours if you have any questions.\n\nBest regards,\n${currentUser.name}`
      );
      setIsGeneratingAi(false);
    }, 800);
  };

  // Filtered announcements list
  const filteredAnnouncements = announcements.filter((ann) => {
    const matchesClass =
      selectedClassFilter === 'all' || ann.classId === 'all' || ann.classId === selectedClassFilter;
    const matchesSearch =
      ann.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ann.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ann.className.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ann.authorName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesClass && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-slate-900 flex items-center gap-2.5">
            <Megaphone className="w-7 h-7 text-pink-600" />
            Classroom Announcements & Broadcasts
          </h1>
          <p className="text-xs text-slate-500">
            {isTeacherOrAdmin
              ? 'Publish important course updates, exam notifications, and deadlines directly to student streams.'
              : 'Stay up to date with official course announcements and updates from your professors.'}
          </p>
        </div>

        {isTeacherOrAdmin && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white font-bold text-xs shadow-md hover:opacity-95 transition-all flex items-center gap-2 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Post New Announcement</span>
          </button>
        )}
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-3xl bg-white border border-pink-100/80 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search announcements by title, content, or course..."
            className="w-full text-xs font-medium pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-pink-400"
          />
        </div>

        {/* Filter by Class */}
        <select
          value={selectedClassFilter}
          onChange={(e) => setSelectedClassFilter(e.target.value)}
          className="text-xs font-bold px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 focus:outline-none focus:border-pink-500 w-full sm:w-auto"
        >
          <option value="all">All Classrooms</option>
          {classes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </select>
      </div>

      {/* Announcements List / Feed */}
      <div className="space-y-4">
        {filteredAnnouncements.length === 0 ? (
          <div className="p-12 text-center bg-white border border-dashed border-slate-200 rounded-3xl space-y-2">
            <Bell className="w-8 h-8 text-slate-300 mx-auto" />
            <h3 className="font-serif font-bold text-slate-700 text-sm">No announcements found</h3>
            <p className="text-xs text-slate-400">
              {searchQuery ? `No results matching "${searchQuery}"` : 'No announcements posted for this section yet.'}
            </p>
          </div>
        ) : (
          filteredAnnouncements.map((ann) => (
            <div
              key={ann.id}
              className="p-6 rounded-3xl bg-white border border-pink-200/60 shadow-2xs hover:shadow-md transition-all space-y-3 relative group"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-pink-100 text-pink-800 border border-pink-200">
                    {ann.className}
                  </span>
                  <span className="text-xs text-slate-400">• Posted by <strong className="text-slate-700">{ann.authorName}</strong></span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400 font-medium">{ann.createdAt}</span>

                  {isTeacherOrAdmin && (
                    <button
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this announcement?')) {
                          deleteAnnouncement(ann.id);
                        }
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer opacity-80 group-hover:opacity-100"
                      title="Delete Announcement"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              <h2 className="text-lg font-serif font-bold text-slate-900">{ann.title}</h2>
              <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">{ann.content}</p>
            </div>
          ))
        )}
      </div>

      {/* Teacher Post Announcement Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-pink-100 relative max-h-[90vh] overflow-y-auto space-y-5">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-400 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700 border border-purple-200">
                Teacher Broadcast Portal
              </span>
              <h2 className="text-xl font-serif font-bold text-slate-900 mt-1">Create Announcement</h2>
              <p className="text-xs text-slate-500">
                Broadcast an official notice to your class members or across all enrolled students.
              </p>
            </div>

            {/* AI Prompt Assistant Tool */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200/80 space-y-2">
              <label className="text-xs font-bold text-pink-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-pink-600 animate-pulse" />
                <span>Flow AI Announcement Generator</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="e.g. Midterm exam timing shift to Friday 3 PM..."
                  className="flex-1 text-xs font-medium px-3 py-2 rounded-xl bg-white border border-pink-200 focus:outline-none focus:border-pink-500"
                />
                <button
                  type="button"
                  disabled={isGeneratingAi || !aiPrompt.trim()}
                  onClick={handleGenerateAiDraft}
                  className="px-3.5 py-2 rounded-xl bg-pink-600 text-white text-xs font-bold hover:bg-pink-700 disabled:opacity-50 transition-all cursor-pointer shrink-0 flex items-center gap-1"
                >
                  {isGeneratingAi ? 'Drafting...' : 'Draft with AI'}
                </button>
              </div>
            </div>

            <form onSubmit={handleCreateAnnouncement} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Target Classroom *</label>
                <select
                  value={targetClassId}
                  onChange={(e) => setTargetClassId(e.target.value)}
                  className="w-full font-semibold px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-pink-500 bg-slate-50"
                >
                  <option value="all">🌐 All Classes (Broadcast to all students)</option>
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      📚 {c.title} ({c.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Announcement Heading *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Midterm Examination Schedule Released"
                  className="w-full font-medium px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Detailed Message *</label>
                <textarea
                  rows={5}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write announcement details, syllabus guidelines, instructions..."
                  className="w-full font-medium px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white font-bold shadow-xs hover:opacity-95 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Publish Announcement</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
