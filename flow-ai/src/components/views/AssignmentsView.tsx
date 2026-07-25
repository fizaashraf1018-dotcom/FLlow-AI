import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Assignment, Submission } from '../../types';
import {
  Target,
  Plus,
  Sparkles,
  FileText,
  CheckCircle2,
  Clock,
  Send,
  Award,
  X,
  AlertCircle,
} from 'lucide-react';

export const AssignmentsView: React.FC = () => {
  const {
    currentUser,
    assignments,
    addAssignment,
    classes,
    submissions,
    addSubmission,
    updateSubmissionGrade,
  } = useApp();

  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [subSearchQuery, setSubSearchQuery] = useState('');

  // Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  // Submission Form State
  const [submissionContent, setSubmissionContent] = useState('');
  const [attachmentName, setAttachmentName] = useState('solution_draft.pdf');

  // Create Assignment State
  const [classId, setClassId] = useState(classes[0]?.id || '');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [maxPoints, setMaxPoints] = useState(100);
  const [rubricText, setRubricText] = useState('Accuracy (50%), Logical structure (30%), Formatting (20%).');

  // AI Evaluation Loading State
  const [evaluatingSubId, setEvaluatingSubId] = useState<string | null>(null);

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const targetClass = classes.find((c) => c.id === classId);

    addAssignment({
      classId,
      className: targetClass?.title || 'General Class',
      teacherId: currentUser.id,
      title,
      description,
      dueDate: dueDate || new Date().toISOString().split('T')[0],
      maxPoints,
      rubricText,
    });

    setTitle('');
    setDescription('');
    setIsCreateModalOpen(false);
  };

  const handleSubmitAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssignment || !submissionContent.trim()) return;

    addSubmission({
      assignmentId: selectedAssignment.id,
      studentId: currentUser.id,
      studentName: currentUser.name,
      studentAvatar: currentUser.avatar,
      content: submissionContent,
      attachmentName,
    });

    setSubmissionContent('');
    setIsSubmitModalOpen(false);
  };

  const handleRunAiEvaluation = async (sub: Submission) => {
    setEvaluatingSubId(sub.id);

    try {
      const response = await fetch('/api/ai/evaluate-assignment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: selectedAssignment?.title || 'Assignment Evaluation',
          instructions: selectedAssignment?.description || '',
          submissionText: sub.content,
          studentName: sub.studentName,
          rubric: selectedAssignment?.rubricText,
        }),
      });

      const data = await response.json();

      if (data.scoreOutof100 !== undefined) {
        updateSubmissionGrade(
          sub.id,
          data.scoreOutof100,
          data.summary,
          { ...data, evaluatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16) }
        );
      }
    } catch {
      // Handled silently
    } finally {
      setEvaluatingSubId(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <Target className="w-6 h-6 text-pink-600" />
            Assignment Hub & AI Auto-Grader
          </h1>
          <p className="text-xs text-slate-500">
            Post coursework, collect submissions, and grade instantly using Gemini AI models.
          </p>
        </div>

        {currentUser.role === 'teacher' && (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white font-bold text-xs shadow-md hover:opacity-90 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Assignment</span>
          </button>
        )}
      </div>

      {/* Assignments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {assignments.map((ass) => {
          const assSubmissions = submissions.filter((s) => s.assignmentId === ass.id);
          const studentSub = submissions.find(
            (s) => s.assignmentId === ass.id && s.studentId === currentUser.id
          );

          return (
            <div
              key={ass.id}
              className="p-6 rounded-3xl bg-white border border-pink-100/90 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-pink-50 text-pink-700 border border-pink-200">
                    {ass.className}
                  </span>
                  <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-pink-500" /> Due {ass.dueDate}
                  </span>
                </div>

                <h3 className="font-extrabold text-base text-slate-800">{ass.title}</h3>
                <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">{ass.description}</p>
              </div>

              {/* Rubric snippet */}
              <div className="p-3 rounded-2xl bg-purple-50/50 border border-purple-100 text-[11px] text-purple-800">
                <span className="font-bold">Grading Rubric:</span> {ass.rubricText}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <div className="text-xs text-slate-500 font-medium">
                  {currentUser.role === 'teacher' ? (
                    <span>{assSubmissions.length} Submissions</span>
                  ) : studentSub ? (
                    <span className="text-emerald-600 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Submitted ({studentSub.status})
                    </span>
                  ) : (
                    <span className="text-rose-600 font-semibold">Not Submitted Yet</span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {currentUser.role === 'student' && !studentSub && (
                    <button
                      onClick={() => {
                        setSelectedAssignment(ass);
                        setIsSubmitModalOpen(true);
                      }}
                      className="px-4 py-1.5 rounded-xl bg-pink-600 text-white font-bold text-xs shadow-2xs hover:bg-pink-700 transition-all cursor-pointer"
                    >
                      Submit Work
                    </button>
                  )}

                  <button
                    onClick={() => setSelectedAssignment(ass)}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 transition-all cursor-pointer"
                  >
                    View Submissions ({assSubmissions.length})
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Assignment Submissions & AI Evaluation Modal */}
      {selectedAssignment && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 shadow-2xl border border-pink-100 relative max-h-[90vh] overflow-y-auto space-y-6">
            <button
              onClick={() => setSelectedAssignment(null)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-400 transition-all cursor-pointer z-10"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-pink-50 text-pink-700 border border-pink-200">
                {selectedAssignment.className}
              </span>
              <h2 className="text-xl font-bold text-slate-800 mt-1">{selectedAssignment.title}</h2>
              <p className="text-xs text-slate-500">{selectedAssignment.description}</p>
            </div>

            {/* Submissions List */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h3 className="font-bold text-sm text-slate-800 flex items-center justify-between gap-2">
                  <span>Student Submissions</span>
                  <span className="text-xs font-semibold text-slate-400">
                    Total: {submissions.filter((s) => s.assignmentId === selectedAssignment.id).length}
                  </span>
                </h3>

                {/* Filter Submissions by Student Name */}
                <input
                  type="text"
                  value={subSearchQuery}
                  onChange={(e) => setSubSearchQuery(e.target.value)}
                  placeholder="Filter by student name..."
                  className="text-xs font-medium px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-pink-500"
                />
              </div>

              {(() => {
                const filteredSubs = submissions.filter(
                  (s) =>
                    s.assignmentId === selectedAssignment.id &&
                    s.studentName.toLowerCase().includes(subSearchQuery.toLowerCase())
                );

                if (filteredSubs.length === 0) {
                  return (
                    <div className="text-center py-8 border border-dashed border-slate-200 rounded-2xl">
                      <p className="text-xs text-slate-400">No student submissions found matching "{subSearchQuery}".</p>
                    </div>
                  );
                }

                return filteredSubs.map((sub) => {
                  return (
                    <div
                      key={sub.id}
                      className="p-5 rounded-2xl border border-pink-100 bg-slate-50/50 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={sub.studentAvatar}
                            alt={sub.studentName}
                            className="w-8 h-8 rounded-full object-cover ring-2 ring-pink-200"
                          />
                          <div>
                            <span className="font-bold text-xs text-slate-800 block">{sub.studentName}</span>
                            <span className="text-[10px] text-slate-400">{sub.submittedAt}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {sub.status === 'graded' ? (
                            <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                              Grade: {sub.grade} ({sub.score}/100)
                            </span>
                          ) : (
                            <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                              Pending Review
                            </span>
                          )}

                          <button
                            onClick={() => handleRunAiEvaluation(sub)}
                            disabled={evaluatingSubId === sub.id}
                            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-xs shadow-xs hover:opacity-90 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            {evaluatingSubId === sub.id ? 'Evaluating...' : 'Evaluate with Flow AI'}
                          </button>
                        </div>
                      </div>

                      {/* Content Box */}
                      <div className="p-3.5 rounded-xl bg-white border border-slate-200 text-xs font-mono text-slate-700 whitespace-pre-wrap max-h-48 overflow-y-auto">
                        {sub.content}
                      </div>

                      {/* AI Evaluation Output */}
                      {sub.aiEvaluation && (
                        <div className="p-4 rounded-2xl bg-gradient-to-r from-pink-50 via-purple-50 to-rose-50 border border-pink-200 text-xs space-y-2">
                          <div className="flex items-center justify-between font-bold text-pink-800">
                            <span className="flex items-center gap-1">
                              <Sparkles className="w-4 h-4 text-pink-500" /> Flow AI Evaluation Report
                            </span>
                            <span>Score: {sub.aiEvaluation.scoreOutof100}/100 ({sub.aiEvaluation.letterGrade})</span>
                          </div>

                          <p className="text-slate-800 font-medium">{sub.aiEvaluation.summary}</p>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[11px]">
                            <div className="bg-white/80 p-2.5 rounded-xl border border-pink-100">
                              <span className="font-bold text-emerald-700 block mb-1">Key Strengths:</span>
                              <ul className="list-disc list-inside space-y-0.5 text-slate-600">
                                {sub.aiEvaluation.strengths.map((st, i) => (
                                  <li key={i}>{st}</li>
                                ))}
                              </ul>
                            </div>

                            <div className="bg-white/80 p-2.5 rounded-xl border border-pink-100">
                              <span className="font-bold text-purple-700 block mb-1">Actionable Advice:</span>
                              <ul className="list-disc list-inside space-y-0.5 text-slate-600">
                                {sub.aiEvaluation.actionableTips.map((tip, i) => (
                                  <li key={i}>{tip}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Student Submit Work Modal */}
      {isSubmitModalOpen && selectedAssignment && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-pink-100 relative">
            <button
              onClick={() => setIsSubmitModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-400 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-bold text-slate-800 mb-1">Submit Assignment Solution</h2>
            <p className="text-xs text-slate-400 mb-4">{selectedAssignment.title}</p>

            <form onSubmit={handleSubmitAssignment} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Solution Text / Code *</label>
                <textarea
                  rows={6}
                  required
                  value={submissionContent}
                  onChange={(e) => setSubmissionContent(e.target.value)}
                  placeholder="Type or paste your complete assignment solution here..."
                  className="w-full font-mono text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Attachment File Name</label>
                <input
                  type="text"
                  value={attachmentName}
                  onChange={(e) => setAttachmentName(e.target.value)}
                  className="w-full font-medium px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-pink-600 text-white font-bold shadow-xs hover:bg-pink-700 transition-all cursor-pointer"
                >
                  Confirm & Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Assignment Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-pink-100 relative">
            <button
              onClick={() => setIsCreateModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-400 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-bold text-slate-800 mb-1">Create Coursework Assignment</h2>
            <p className="text-xs text-slate-400 mb-4">Set clear instructions and grading criteria.</p>

            <form onSubmit={handleCreateAssignment} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Target Class *</label>
                <select
                  value={classId}
                  onChange={(e) => setClassId(e.target.value)}
                  className="w-full font-medium px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-pink-500"
                >
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Assignment Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Assignment 3 - Neural Network Backpropagation"
                  className="w-full font-medium px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description & Instructions</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide instructions for students..."
                  className="w-full font-medium px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full font-medium px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-pink-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Max Points</label>
                  <input
                    type="number"
                    value={maxPoints}
                    onChange={(e) => setMaxPoints(Number(e.target.value))}
                    className="w-full font-medium px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-pink-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Grading Rubric / Criteria</label>
                <input
                  type="text"
                  value={rubricText}
                  onChange={(e) => setRubricText(e.target.value)}
                  placeholder="e.g. Derivation accuracy (50%), Code cleanliness (30%)..."
                  className="w-full font-medium px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-pink-500"
                />
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
                  Publish Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
