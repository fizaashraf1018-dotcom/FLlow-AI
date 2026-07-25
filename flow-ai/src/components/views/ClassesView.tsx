import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ClassRoom } from '../../types';
import {
  BookOpen,
  Plus,
  Users,
  Copy,
  Check,
  Search,
  X,
  FileText,
  Target,
  CheckCircle2,
  Megaphone,
  Sparkles,
} from 'lucide-react';

export const ClassesView: React.FC = () => {
  const {
    currentUser,
    classes,
    addClass,
    joinClassByCode,
    notes,
    assignments,
    quizzes,
    announcements,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState<ClassRoom | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [bannerGradient, setBannerGradient] = useState('from-pink-500 via-rose-400 to-purple-500');

  const [joinCode, setJoinCode] = useState('');
  const [joinMsg, setJoinMsg] = useState<{ text: string; isError: boolean } | null>(null);

  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !subject.trim()) return;

    const created = addClass({
      title,
      subject,
      description: description || 'Digital classroom on Flow AI',
      teacherId: currentUser.id,
      teacherName: currentUser.name,
      teacherAvatar: currentUser.avatar,
      bannerGradient,
    });

    setTitle('');
    setSubject('');
    setDescription('');
    setIsCreateModalOpen(false);
    setSelectedClass(created);
  };

  const handleJoinClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCode.trim()) return;

    const success = joinClassByCode(joinCode);
    if (success) {
      setJoinMsg({ text: 'Classroom joined successfully!', isError: false });
      setTimeout(() => {
        setIsJoinModalOpen(false);
        setJoinMsg(null);
        setJoinCode('');
      }, 1500);
    } else {
      setJoinMsg({ text: 'Invalid class code. Please check code with your teacher.', isError: true });
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const filteredClasses = classes.filter(
    (c) =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.teacherName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-pink-600" />
            Digital Classrooms & Learning Hubs
          </h1>
          <p className="text-xs text-slate-500">
            Create interactive classes, share study materials, conduct quizzes, and manage students.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsJoinModalOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-white border border-pink-200 text-pink-700 font-bold text-xs shadow-2xs hover:bg-pink-50 transition-all cursor-pointer"
          >
            Join Class Code
          </button>

          {currentUser.role === 'teacher' && (
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white font-bold text-xs shadow-md hover:opacity-90 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create Classroom</span>
            </button>
          )}
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4 rounded-3xl bg-white border border-pink-100/80 shadow-xs flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search classrooms by title, subject, or professor..."
            className="w-full text-xs font-medium pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-pink-400"
          />
        </div>
      </div>

      {/* Classrooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredClasses.map((cls) => {
          const classNotes = notes.filter((n) => n.classId === cls.id);
          const classAssignments = assignments.filter((a) => a.classId === cls.id);
          const classQuizzes = quizzes.filter((q) => q.classId === cls.id);

          return (
            <div
              key={cls.id}
              className="rounded-3xl border border-pink-100 overflow-hidden bg-white shadow-2xs hover:shadow-lg transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Banner Header */}
                <div className={`p-5 bg-gradient-to-r ${cls.bannerGradient} text-white relative`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-black/25 px-2.5 py-1 rounded-full border border-white/20">
                      {cls.subject}
                    </span>

                    <button
                      onClick={() => copyCode(cls.code)}
                      className="flex items-center gap-1 text-[10px] font-bold bg-white/20 hover:bg-white/30 backdrop-blur-md px-2.5 py-1 rounded-full transition-all cursor-pointer"
                      title="Click to copy class code"
                    >
                      {copiedCode === cls.code ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-300" /> Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" /> Code: {cls.code}
                        </>
                      )}
                    </button>
                  </div>

                  <h3 className="font-extrabold text-lg line-clamp-1 group-hover:underline">
                    {cls.title}
                  </h3>
                  <p className="text-xs text-white/80 line-clamp-2 mt-1">{cls.description}</p>
                </div>

                {/* Class Stats */}
                <div className="p-4 grid grid-cols-3 gap-2 text-center border-b border-slate-100 text-xs">
                  <div className="p-2 rounded-xl bg-slate-50">
                    <span className="block font-bold text-slate-800">{classNotes.length}</span>
                    <span className="text-[10px] text-slate-400">Notes</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50">
                    <span className="block font-bold text-slate-800">{classAssignments.length}</span>
                    <span className="text-[10px] text-slate-400">Assignments</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50">
                    <span className="block font-bold text-slate-800">{classQuizzes.length}</span>
                    <span className="text-[10px] text-slate-400">Quizzes</span>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-4 bg-slate-50/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img
                    src={cls.teacherAvatar}
                    alt={cls.teacherName}
                    className="w-7 h-7 rounded-full object-cover ring-2 ring-pink-200"
                  />
                  <div>
                    <p className="text-xs font-bold text-slate-800 leading-none">{cls.teacherName}</p>
                    <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <Users className="w-3 h-3" /> {cls.studentCount} enrolled
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedClass(cls)}
                  className="px-3.5 py-1.5 rounded-xl bg-pink-600 text-white text-xs font-bold hover:bg-pink-700 transition-all cursor-pointer"
                >
                  Enter Class
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Class Detail Drawer / Modal */}
      {selectedClass && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 shadow-2xl border border-pink-100 relative max-h-[90vh] overflow-y-auto space-y-6">
            <button
              onClick={() => setSelectedClass(null)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-400 transition-all cursor-pointer z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Class Banner Header */}
            <div className={`p-6 rounded-2xl bg-gradient-to-r ${selectedClass.bannerGradient} text-white space-y-2`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider bg-black/20 px-3 py-1 rounded-full">
                  {selectedClass.subject}
                </span>
                <button
                  onClick={() => copyCode(selectedClass.code)}
                  className="flex items-center gap-1.5 text-xs font-bold bg-white/20 hover:bg-white/30 backdrop-blur-md px-3 py-1 rounded-full cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" /> Class Code: {selectedClass.code}
                </button>
              </div>

              <h2 className="text-2xl font-black">{selectedClass.title}</h2>
              <p className="text-xs text-white/90 leading-relaxed">{selectedClass.description}</p>
              <div className="text-xs text-pink-100 pt-2 flex items-center gap-2">
                <span>Instructor: <strong>{selectedClass.teacherName}</strong></span>
                <span>•</span>
                <span>{selectedClass.studentCount} Students Enrolled</span>
              </div>
            </div>

            {/* Class Tabs Content */}
            <div className="space-y-4">
              <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                <FileText className="w-4 h-4 text-pink-600" />
                Uploaded Study Materials & Lecture Notes
              </h3>

              <div className="space-y-2">
                {notes.filter((n) => n.classId === selectedClass.id).length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No notes uploaded for this class yet.</p>
                ) : (
                  notes
                    .filter((n) => n.classId === selectedClass.id)
                    .map((note) => (
                      <div key={note.id} className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/60 flex items-center justify-between gap-3 text-xs">
                        <div>
                          <p className="font-bold text-slate-800">{note.title}</p>
                          <p className="text-[11px] text-slate-500 line-clamp-1">{note.contentSnippet}</p>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-1 rounded-lg bg-pink-100 text-pink-700 shrink-0 uppercase">
                          {note.fileType} • {note.fileSize}
                        </span>
                      </div>
                    ))
                )}
              </div>

              <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2 pt-2">
                <Megaphone className="w-4 h-4 text-pink-600" />
                Class Announcements
              </h3>

              <div className="space-y-2">
                {announcements.filter((a) => a.classId === selectedClass.id || a.classId === 'all').length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No announcements for this classroom yet.</p>
                ) : (
                  announcements
                    .filter((a) => a.classId === selectedClass.id || a.classId === 'all')
                    .map((ann) => (
                      <div key={ann.id} className="p-3.5 rounded-2xl border border-pink-200/70 bg-pink-50/40 text-xs space-y-1">
                        <div className="flex items-center justify-between font-bold text-slate-800">
                          <span>{ann.title}</span>
                          <span className="text-[10px] text-slate-400 font-normal">{ann.createdAt}</span>
                        </div>
                        <p className="text-slate-600 text-[11px] leading-relaxed">{ann.content}</p>
                      </div>
                    ))
                )}
              </div>

              <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2 pt-2">
                <Target className="w-4 h-4 text-pink-600" />
                Active Class Assignments
              </h3>

              <div className="space-y-2">
                {assignments.filter((a) => a.classId === selectedClass.id).length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No active assignments right now.</p>
                ) : (
                  assignments
                    .filter((a) => a.classId === selectedClass.id)
                    .map((ass) => (
                      <div key={ass.id} className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/60 flex items-center justify-between text-xs">
                        <div>
                          <p className="font-bold text-slate-800">{ass.title}</p>
                          <p className="text-[11px] text-slate-500">Due: {ass.dueDate} • Max Points: {ass.maxPoints}</p>
                        </div>
                        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-purple-100 text-purple-700">
                          {ass.submissionCount} Submissions
                        </span>
                      </div>
                    ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Class Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-pink-100 relative">
            <button
              onClick={() => setIsCreateModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-400 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-bold text-slate-800 mb-1">Create Digital Classroom</h2>
            <p className="text-xs text-slate-400 mb-4">
              Students can join your class instantly using an auto-generated 6-digit code.
            </p>

            <form onSubmit={handleCreateClass} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Class Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Advanced AI & Deep Learning"
                  className="w-full font-medium px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Subject / Department *</label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Computer Science / AI"
                  className="w-full font-medium px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Class Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief overview of course outline, learning objectives..."
                  className="w-full font-medium px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Card Gradient Theme</label>
                <select
                  value={bannerGradient}
                  onChange={(e) => setBannerGradient(e.target.value)}
                  className="w-full font-medium px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-pink-500"
                >
                  <option value="from-pink-500 via-rose-400 to-purple-500">Pink & Purple Pulse</option>
                  <option value="from-purple-600 via-pink-500 to-rose-400">Deep Purple Velvet</option>
                  <option value="from-rose-500 via-pink-500 to-indigo-600">Rose Sunset</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold shadow-xs hover:opacity-90 transition-all cursor-pointer"
                >
                  Create & Generate Code
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Join Class Modal */}
      {isJoinModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-pink-100 relative">
            <button
              onClick={() => setIsJoinModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-400 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-bold text-slate-800 mb-1">Join Classroom with Code</h2>
            <p className="text-xs text-slate-400 mb-4">Ask your teacher for the 6-character class code.</p>

            <form onSubmit={handleJoinClass} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Classroom Code *</label>
                <input
                  type="text"
                  required
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value)}
                  placeholder="e.g. PHYS-301"
                  className="w-full text-center tracking-widest font-mono text-base font-bold px-3.5 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-pink-500 uppercase"
                />
              </div>

              {joinMsg && (
                <div
                  className={`p-3 rounded-xl text-xs font-semibold ${
                    joinMsg.isError ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'
                  }`}
                >
                  {joinMsg.text}
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsJoinModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold shadow-xs hover:opacity-90 transition-all cursor-pointer"
                >
                  Enroll Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
