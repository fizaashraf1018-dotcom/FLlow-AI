import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { NoteFile } from '../../types';
import {
  FileText,
  Plus,
  Search,
  Download,
  Sparkles,
  FileCode,
  FileSpreadsheet,
  FileImage,
  Video,
  X,
  Tag,
  BookOpen,
} from 'lucide-react';

export const NotesView: React.FC = () => {
  const { currentUser, notes, addNote, classes } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // AI Smart Search State
  const [aiQuery, setAiQuery] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<{
    summary: string;
    directAnswer: string;
    keyKeywords: string[];
    matchedIds: string[];
  } | null>(null);

  // New Note Form State
  const [title, setTitle] = useState('');
  const [fileType, setFileType] = useState<'pdf' | 'docx' | 'ppt' | 'image' | 'video' | 'text'>('pdf');
  const [contentSnippet, setContentSnippet] = useState('');
  const [category, setCategory] = useState('Physics Notes');
  const [classId, setClassId] = useState('');
  const [tags, setTags] = useState('Study, Physics, Lecture');

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !contentSnippet.trim()) return;

    addNote({
      title,
      fileType,
      fileSize: `${(Math.random() * 5 + 0.5).toFixed(1)} MB`,
      contentSnippet,
      authorId: currentUser.id,
      authorName: currentUser.name,
      category,
      classId: classId || undefined,
      tags: tags.split(',').map((t) => t.trim()),
    });

    setTitle('');
    setContentSnippet('');
    setIsModalOpen(false);
  };

  const runAiSmartSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuery.trim()) return;

    setAiLoading(true);
    setAiResult(null);

    try {
      const response = await fetch('/api/ai/smart-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: aiQuery,
          items: notes.map((n) => ({
            id: n.id,
            title: n.title,
            content: n.contentSnippet,
            type: n.fileType,
            author: n.authorName,
          })),
        }),
      });

      const data = await response.json();
      setAiResult(data);
    } catch {
      // Handled silently
    } finally {
      setAiLoading(false);
    }
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="w-5 h-5 text-rose-500" />;
      case 'docx':
        return <FileCode className="w-5 h-5 text-blue-500" />;
      case 'ppt':
        return <FileSpreadsheet className="w-5 h-5 text-amber-500" />;
      case 'image':
        return <FileImage className="w-5 h-5 text-emerald-500" />;
      case 'video':
        return <Video className="w-5 h-5 text-purple-500" />;
      default:
        return <FileText className="w-5 h-5 text-pink-500" />;
    }
  };

  const filteredNotes = notes.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.contentSnippet.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCat = selectedCategory === 'all' ? true : n.category === selectedCategory;

    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <FileText className="w-6 h-6 text-pink-600" />
            Notes & File Storage
          </h1>
          <p className="text-xs text-slate-500">
            Upload, search, and share PDFs, DOCX, PPTs, videos, and study guides.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white font-bold text-xs shadow-md hover:opacity-90 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Upload New Note File</span>
        </button>
      </div>

      {/* AI Smart Search & Summarizer Box */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-pink-50 via-purple-50 to-rose-50 border border-pink-200/80 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-pink-700">
          <Sparkles className="w-4 h-4 text-pink-500 animate-pulse" />
          <span>AI Smart Search & Notes Summarizer (Powered by Gemini)</span>
        </div>

        <form onSubmit={runAiSmartSearch} className="flex gap-2">
          <input
            type="text"
            value={aiQuery}
            onChange={(e) => setAiQuery(e.target.value)}
            placeholder="Ask AI anything about your uploaded notes (e.g., 'Summarize Schrodinger wave equations')..."
            className="flex-1 text-xs font-medium px-4 py-2.5 rounded-2xl bg-white border border-pink-200 focus:outline-none focus:border-pink-500 text-slate-800 shadow-2xs"
          />
          <button
            type="submit"
            disabled={aiLoading}
            className="px-5 py-2.5 rounded-2xl bg-pink-600 text-white font-bold text-xs shadow-xs hover:bg-pink-700 transition-all cursor-pointer disabled:opacity-50 shrink-0"
          >
            {aiLoading ? 'Analyzing Notes...' : 'Ask AI'}
          </button>
        </form>

        {aiResult && (
          <div className="p-4 rounded-2xl bg-white border border-pink-200 shadow-sm space-y-2 text-xs text-slate-700 animate-in fade-in duration-200">
            <p className="font-bold text-pink-800">💡 Smart Synthesis Answer:</p>
            <p className="leading-relaxed text-slate-800">{aiResult.directAnswer}</p>
            <p className="text-[11px] text-slate-500">{aiResult.summary}</p>
            {aiResult.keyKeywords?.length > 0 && (
              <div className="flex items-center gap-1.5 pt-1">
                <span className="text-[10px] font-bold text-slate-400">Key terms:</span>
                {aiResult.keyKeywords.map((kw, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700"
                  >
                    #{kw}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Filter & Standard Search Bar */}
      <div className="p-4 rounded-3xl bg-white border border-pink-100/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter files by name, tags, or content..."
            className="w-full text-xs font-medium pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-pink-400"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="text-xs font-semibold px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-pink-400 text-slate-700"
        >
          <option value="all">All Categories</option>
          <option value="Physics Notes">Physics Notes</option>
          <option value="CS Study Guide">CS Study Guide</option>
          <option value="Business Strategy">Business Strategy</option>
        </select>
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredNotes.map((note) => (
          <div
            key={note.id}
            className="p-5 rounded-3xl bg-white border border-pink-100/90 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-3"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="p-2.5 rounded-2xl bg-pink-50/80 border border-pink-100">
                  {getFileIcon(note.fileType)}
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 uppercase">
                  {note.fileType} • {note.fileSize}
                </span>
              </div>

              <h3 className="font-bold text-sm text-slate-800 line-clamp-1">{note.title}</h3>
              <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">{note.contentSnippet}</p>
            </div>

            <div className="space-y-3 pt-2 border-t border-slate-100">
              <div className="flex flex-wrap gap-1">
                {note.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-purple-50 text-purple-600"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <div>
                  <span className="font-bold text-slate-700 block text-[11px]">{note.authorName}</span>
                  <span className="text-[10px] text-slate-400">{note.createdAt}</span>
                </div>

                <a
                  href={`#download-${note.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    alert(`Downloading "${note.title}"...`);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-pink-50 text-pink-700 hover:bg-pink-100 font-bold text-xs flex items-center gap-1 transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" /> Download
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Note Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-pink-100 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-400 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-bold text-slate-800 mb-1">Upload Note / Study Material</h2>
            <p className="text-xs text-slate-400 mb-4">Share notes with your class or save to personal storage.</p>

            <form onSubmit={handleCreateNote} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Document Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Lecture 05 - Quantum Field Theory.pdf"
                  className="w-full font-medium px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">File Format</label>
                  <select
                    value={fileType}
                    onChange={(e: any) => setFileType(e.target.value)}
                    className="w-full font-medium px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-pink-500"
                  >
                    <option value="pdf">PDF Document</option>
                    <option value="docx">Word DOCX</option>
                    <option value="ppt">PowerPoint PPT</option>
                    <option value="image">Image File</option>
                    <option value="video">Video Recording</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Associate Class (Optional)</label>
                  <select
                    value={classId}
                    onChange={(e) => setClassId(e.target.value)}
                    className="w-full font-medium px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-pink-500"
                  >
                    <option value="">Personal Note (No Class)</option>
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Note Summary / Content Snippet *</label>
                <textarea
                  rows={3}
                  required
                  value={contentSnippet}
                  onChange={(e) => setContentSnippet(e.target.value)}
                  placeholder="Key concepts, formulas, or lecture takeaways covered in this note..."
                  className="w-full font-medium px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="e.g. Physics, Quantum, Exam2026"
                  className="w-full font-medium px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold shadow-xs hover:opacity-90 transition-all cursor-pointer"
                >
                  Upload & Index File
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
