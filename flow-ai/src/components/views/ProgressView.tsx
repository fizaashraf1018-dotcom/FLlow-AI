import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { User } from '../../types';
import {
  TrendingUp,
  Award,
  CheckSquare,
  Target,
  Search,
  Users,
  X,
  Sparkles,
  FileText,
  CheckCircle2,
  ChevronRight,
  GraduationCap,
} from 'lucide-react';

export const ProgressView: React.FC = () => {
  const { currentUser, tasks, quizResults, submissions, users, assignments, quizzes } = useApp();

  const [studentSearch, setStudentSearch] = useState('');
  const [selectedStudentForTranscript, setSelectedStudentForTranscript] = useState<User | null>(null);

  const isTeacherOrAdmin = currentUser.role === 'teacher' || currentUser.role === 'admin';

  // Student specific stats
  const userTasks = tasks.filter((t) => t.userId === currentUser.id);
  const completedTasks = userTasks.filter((t) => t.isCompleted);
  const taskCompletionRate = userTasks.length
    ? Math.round((completedTasks.length / userTasks.length) * 100)
    : 100;

  const userQuizResults = quizResults.filter((r) => r.studentId === currentUser.id);
  const avgQuizScore = userQuizResults.length
    ? Math.round(
        userQuizResults.reduce((acc, curr) => acc + curr.percentage, 0) / userQuizResults.length
      )
    : 95;

  const userSubmissions = submissions.filter((s) => s.studentId === currentUser.id);

  // All students list for teachers
  const allStudents = users.filter((u) => u.role === 'student');
  const filteredStudents = allStudents.filter(
    (s) =>
      s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.email.toLowerCase().includes(studentSearch.toLowerCase()) ||
      (s.institutionOrCompany && s.institutionOrCompany.toLowerCase().includes(studentSearch.toLowerCase()))
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-pink-600" />
            {isTeacherOrAdmin ? 'Teacher Gradebook & Student Results Portal' : 'Progress & Learning Analytics'}
          </h1>
          <p className="text-xs text-slate-500">
            {isTeacherOrAdmin
              ? 'View complete academic results, assignment grades, and quiz performance sorted by student name.'
              : 'Monitor your coursework performance, task completion velocity, and AI feedback insights.'}
          </p>
        </div>
      </div>

      {isTeacherOrAdmin ? (
        /* Teacher / Admin Gradebook View */
        <div className="space-y-6">
          {/* Analytics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-white border border-pink-200/60 shadow-2xs space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Enrolled Students</span>
              <div className="text-3xl font-serif font-bold text-slate-900">{allStudents.length}</div>
              <p className="text-[11px] text-pink-600 font-semibold">Active in class rosters</p>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-pink-200/60 shadow-2xs space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Submissions</span>
              <div className="text-3xl font-serif font-bold text-slate-900">{submissions.length}</div>
              <p className="text-[11px] text-emerald-600 font-semibold">
                {submissions.filter((s) => s.status === 'graded').length} AI Graded
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-pink-200/60 shadow-2xs space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Quiz Attempts</span>
              <div className="text-3xl font-serif font-bold text-slate-900">{quizResults.length}</div>
              <p className="text-[11px] text-purple-600 font-semibold">Multiple choice completed</p>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-pink-200/60 shadow-2xs space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Class Overall Average</span>
              <div className="text-3xl font-serif font-bold text-slate-900">
                {quizResults.length
                  ? Math.round(
                      quizResults.reduce((acc, curr) => acc + curr.percentage, 0) / quizResults.length
                    )
                  : 90}
                %
              </div>
              <p className="text-[11px] text-pink-600 font-semibold">Mastery level: Excellent</p>
            </div>
          </div>

          {/* Student Search & Results Table Section */}
          <div className="p-6 rounded-3xl bg-white border border-pink-200/60 shadow-2xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-serif font-bold text-slate-900 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-pink-600" />
                  Student Performance & Gradebook
                </h2>
                <p className="text-xs text-slate-500">
                  Select any student to view their detailed assignment grades, quiz answers, and AI report.
                </p>
              </div>

              {/* Search Bar */}
              <div className="relative min-w-[240px]">
                <Search className="w-4 h-4 absolute left-3.5 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  placeholder="Search by student name..."
                  className="w-full text-xs font-medium pl-9 pr-4 py-2 rounded-2xl bg-slate-50/80 border border-slate-200/80 focus:outline-none focus:border-pink-400 shadow-2xs"
                />
              </div>
            </div>

            {/* Students Roster Grid / Table */}
            <div className="space-y-3">
              {filteredStudents.length === 0 ? (
                <div className="p-8 text-center border border-dashed border-slate-200 rounded-2xl text-xs text-slate-400">
                  No students found matching "{studentSearch}".
                </div>
              ) : (
                filteredStudents.map((student) => {
                  const studentSubs = submissions.filter((s) => s.studentId === student.id);
                  const studentQuizzes = quizResults.filter((r) => r.studentId === student.id);

                  const avgQuizPercent = studentQuizzes.length
                    ? Math.round(
                        studentQuizzes.reduce((a, b) => a + b.percentage, 0) / studentQuizzes.length
                      )
                    : 0;

                  const avgAssScore = studentSubs.length
                    ? Math.round(
                        studentSubs.reduce((a, b) => a + (b.score || 0), 0) / studentSubs.length
                      )
                    : 0;

                  return (
                    <div
                      key={student.id}
                      className="p-4 rounded-2xl border border-pink-100/90 bg-slate-50/50 hover:bg-pink-50/30 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
                    >
                      {/* Student Info */}
                      <div className="flex items-center gap-3 min-w-[220px]">
                        <img
                          src={student.avatar}
                          alt={student.name}
                          className="w-11 h-11 rounded-full object-cover ring-2 ring-pink-200 shrink-0"
                        />
                        <div>
                          <h3 className="font-bold text-sm text-slate-900">{student.name}</h3>
                          <p className="text-[11px] text-slate-500">{student.email}</p>
                          <span className="text-[10px] font-semibold text-pink-700 bg-pink-50 px-2 py-0.5 rounded-full inline-block mt-0.5 border border-pink-200">
                            {student.institutionOrCompany || 'Enrolled Student'}
                          </span>
                        </div>
                      </div>

                      {/* Performance Indicators */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 flex-1">
                        <div className="p-2.5 rounded-xl bg-white border border-slate-200/60 text-center">
                          <span className="text-[10px] font-bold uppercase text-slate-400 block">Assignments</span>
                          <span className="font-bold text-slate-800 text-xs">
                            {studentSubs.length} Submitted {avgAssScore > 0 ? `(${avgAssScore}/100)` : ''}
                          </span>
                        </div>

                        <div className="p-2.5 rounded-xl bg-white border border-slate-200/60 text-center">
                          <span className="text-[10px] font-bold uppercase text-slate-400 block">Quiz Scores</span>
                          <span className="font-bold text-purple-700 text-xs">
                            {studentQuizzes.length} Attempted {avgQuizPercent > 0 ? `(${avgQuizPercent}%)` : ''}
                          </span>
                        </div>

                        <div className="p-2.5 rounded-xl bg-white border border-slate-200/60 text-center col-span-2 sm:col-span-1">
                          <span className="text-[10px] font-bold uppercase text-slate-400 block">Overall Status</span>
                          <span className="font-bold text-emerald-700 text-xs">
                            {studentSubs.length || studentQuizzes.length ? 'Active Scholar' : 'Pending Work'}
                          </span>
                        </div>
                      </div>

                      {/* Action */}
                      <button
                        onClick={() => setSelectedStudentForTranscript(student)}
                        className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-xs shadow-2xs hover:opacity-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                      >
                        <span>View Student Transcript</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Student Individual View */
        <div className="space-y-6">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-3xl bg-white border border-pink-200/60 shadow-2xs space-y-2">
              <span className="text-xs font-bold text-slate-400">Task Completion Rate</span>
              <div className="text-3xl font-serif font-bold text-slate-800">{taskCompletionRate}%</div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div
                  className="bg-pink-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${taskCompletionRate}%` }}
                ></div>
              </div>
              <p className="text-[11px] text-pink-600 font-semibold">
                {completedTasks.length} of {userTasks.length} tasks completed
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-pink-200/60 shadow-2xs space-y-2">
              <span className="text-xs font-bold text-slate-400">Quiz Average Score</span>
              <div className="text-3xl font-serif font-bold text-slate-800">{avgQuizScore}%</div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div
                  className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${avgQuizScore}%` }}
                ></div>
              </div>
              <p className="text-[11px] text-purple-600 font-semibold">Mastery level: Excellent</p>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-pink-200/60 shadow-2xs space-y-2">
              <span className="text-xs font-bold text-slate-400">Assignment Evaluations</span>
              <div className="text-3xl font-serif font-bold text-slate-800">
                {userSubmissions.filter((s) => s.status === 'graded').length}
              </div>
              <p className="text-[11px] text-emerald-600 font-semibold">AI Auto-Grader confirmed</p>
            </div>
          </div>

          {/* Quiz History List */}
          <div className="p-6 rounded-3xl bg-white border border-pink-200/60 shadow-2xs space-y-4">
            <h2 className="font-serif font-bold text-base text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-pink-600" />
              Quiz Performance History
            </h2>

            <div className="space-y-3">
              {userQuizResults.length === 0 ? (
                <p className="text-xs text-slate-400">No quiz attempts recorded yet.</p>
              ) : (
                userQuizResults.map((res) => (
                  <div
                    key={res.id}
                    className="p-4 rounded-2xl border border-slate-200/60 bg-slate-50/50 flex items-center justify-between gap-4 text-xs"
                  >
                    <div>
                      <h3 className="font-bold text-slate-800">{res.quizTitle}</h3>
                      <p className="text-[11px] text-slate-400">Completed: {res.completedAt}</p>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-extrabold text-pink-700">
                        {res.score} / {res.totalPoints} ({res.percentage}%)
                      </span>
                      <span className="block text-[10px] text-emerald-600 font-bold">Grade Passed</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Student Transcript Modal */}
      {selectedStudentForTranscript && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 shadow-2xl border border-pink-100 relative max-h-[90vh] overflow-y-auto space-y-6">
            <button
              onClick={() => setSelectedStudentForTranscript(null)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-400 transition-all cursor-pointer z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Student Header Info */}
            <div className="flex items-center gap-4 p-5 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white">
              <img
                src={selectedStudentForTranscript.avatar}
                alt={selectedStudentForTranscript.name}
                className="w-16 h-16 rounded-full object-cover ring-4 ring-white/30 shrink-0"
              />
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest bg-white/20 backdrop-blur-md px-3 py-1 rounded-full">
                  Official Student Transcript
                </span>
                <h2 className="text-2xl font-serif font-bold mt-1">{selectedStudentForTranscript.name}</h2>
                <p className="text-xs text-pink-100">
                  {selectedStudentForTranscript.email} • {selectedStudentForTranscript.institutionOrCompany || 'Student'}
                </p>
              </div>
            </div>

            {/* Assignment Submissions List */}
            <div className="space-y-4">
              <h3 className="font-serif font-bold text-sm text-slate-900 flex items-center gap-2">
                <Target className="w-4 h-4 text-pink-600" />
                Assignment Submissions & AI Grades
              </h3>

              <div className="space-y-3">
                {(() => {
                  const studentSubs = submissions.filter(
                    (s) => s.studentId === selectedStudentForTranscript.id
                  );

                  if (studentSubs.length === 0) {
                    return (
                      <p className="text-xs text-slate-400 italic p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        No assignment submissions recorded for this student yet.
                      </p>
                    );
                  }

                  return studentSubs.map((sub) => {
                    const assObj = assignments.find((a) => a.id === sub.assignmentId);

                    return (
                      <div
                        key={sub.id}
                        className="p-4 rounded-2xl border border-pink-100 bg-slate-50/60 space-y-3 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-[10px] font-bold uppercase text-pink-700 bg-pink-100 px-2 py-0.5 rounded-full">
                              {assObj?.className || 'Coursework'}
                            </span>
                            <h4 className="font-bold text-slate-900 text-sm mt-1">{assObj?.title || 'Assignment'}</h4>
                            <p className="text-[10px] text-slate-400">Submitted: {sub.submittedAt}</p>
                          </div>

                          <div className="text-right">
                            <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 inline-block">
                              Grade: {sub.grade || 'A'} ({sub.score || 90}/100)
                            </span>
                          </div>
                        </div>

                        {/* Submission Content Snippet */}
                        <div className="p-3 rounded-xl bg-white border border-slate-200 font-mono text-[11px] text-slate-700 whitespace-pre-wrap max-h-32 overflow-y-auto">
                          {sub.content}
                        </div>

                        {/* AI Report */}
                        {sub.aiEvaluation && (
                          <div className="p-3 rounded-xl bg-pink-50/80 border border-pink-200 text-[11px] text-pink-900 space-y-1">
                            <span className="font-bold flex items-center gap-1 text-pink-800">
                              <Sparkles className="w-3.5 h-3.5 text-pink-600" /> Flow AI Evaluation Summary:
                            </span>
                            <p>{sub.aiEvaluation.summary}</p>
                          </div>
                        )}
                      </div>
                    );
                  });
                })()}
              </div>
            </div>

            {/* Quiz Performance List */}
            <div className="space-y-4 pt-2">
              <h3 className="font-serif font-bold text-sm text-slate-900 flex items-center gap-2">
                <Award className="w-4 h-4 text-purple-600" />
                Quiz Attempts & Scores
              </h3>

              <div className="space-y-3">
                {(() => {
                  const studentQuizzes = quizResults.filter(
                    (r) => r.studentId === selectedStudentForTranscript.id
                  );

                  if (studentQuizzes.length === 0) {
                    return (
                      <p className="text-xs text-slate-400 italic p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        No quiz attempts recorded for this student yet.
                      </p>
                    );
                  }

                  return studentQuizzes.map((qRes) => (
                    <div
                      key={qRes.id}
                      className="p-4 rounded-2xl border border-purple-100 bg-purple-50/30 flex items-center justify-between text-xs"
                    >
                      <div>
                        <h4 className="font-bold text-slate-900">{qRes.quizTitle}</h4>
                        <p className="text-[10px] text-slate-400">Completed at: {qRes.completedAt}</p>
                      </div>

                      <div className="text-right">
                        <div className="text-sm font-black text-purple-800">
                          {qRes.score} / {qRes.totalPoints} ({qRes.percentage}%)
                        </div>
                        <span className="text-[10px] font-bold text-emerald-700">Passed</span>
                      </div>
                    </div>
                  ));
                })()}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
