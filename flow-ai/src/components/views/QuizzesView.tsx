import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Quiz, QuizQuestion, QuizResult } from '../../types';
import {
  CheckCircle2,
  Plus,
  Clock,
  Sparkles,
  Play,
  Check,
  X,
  HelpCircle,
  Award,
} from 'lucide-react';

export const QuizzesView: React.FC = () => {
  const {
    currentUser,
    quizzes,
    addQuiz,
    classes,
    addQuizResult,
    quizResults,
    users,
  } = useApp();

  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(0);
  const [isQuizSubmitted, setIsQuizSubmitted] = useState(false);
  const [submittedResult, setSubmittedResult] = useState<QuizResult | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Results Modal State
  const [selectedQuizForResults, setSelectedQuizForResults] = useState<Quiz | null>(null);
  const [resultSearchQuery, setResultSearchQuery] = useState('');

  // Modal State for Teacher Quiz Creation
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [classId, setClassId] = useState(classes[0]?.id || '');
  const [quizTitle, setQuizTitle] = useState('');
  const [quizDesc, setQuizDesc] = useState('');
  const [timeLimit, setTimeLimit] = useState(10);

  // Questions builder state
  const [questions, setQuestions] = useState<QuizQuestion[]>([
    {
      id: 'q1',
      question: 'What is the key principle behind quantum superposition?',
      options: [
        'A particle can exist in multiple states simultaneously until measured',
        'Energy is continuous and non-quantized',
        'Mass converts into pure thermal radiation instantly',
        'Speed of light depends on the observer frame',
      ],
      correctAnswerIndex: 0,
      explanation: 'Superposition allows physical systems to exist in linear combinations of eigen-states until a measurement collapses the wave function.',
    },
  ]);

  // Live Timer Effect
  useEffect(() => {
    if (!activeQuiz || isQuizSubmitted || timeLeftSeconds <= 0) return;

    const timer = setInterval(() => {
      setTimeLeftSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinishQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeQuiz, isQuizSubmitted, timeLeftSeconds]);

  const startQuiz = (quiz: Quiz) => {
    setActiveQuiz(quiz);
    setSelectedAnswers({});
    setTimeLeftSeconds(quiz.timeLimitMinutes * 60);
    setIsQuizSubmitted(false);
    setSubmittedResult(null);
  };

  const handleSelectOption = (qId: string, optionIdx: number) => {
    if (isQuizSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [qId]: optionIdx }));
  };

  const handleFinishQuiz = async () => {
    if (!activeQuiz || isQuizSubmitted) return;
    setIsQuizSubmitted(true);
    setIsAiLoading(true);

    // Calculate score
    let score = 0;
    const questionsEval = activeQuiz.questions.map((q) => {
      const userChoice = selectedAnswers[q.id];
      const isCorrect = userChoice === q.correctAnswerIndex;
      if (isCorrect) score += 10;
      return {
        id: q.id,
        question: q.question,
        userAnswer: q.options[userChoice] || 'No answer selected',
        correctAnswer: q.options[q.correctAnswerIndex],
        isCorrect,
      };
    });

    const totalPoints = activeQuiz.questions.length * 10;
    const percentage = Math.round((score / totalPoints) * 100);

    let aiFeedbackData = undefined;

    try {
      const response = await fetch('/api/ai/evaluate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quizTitle: activeQuiz.title,
          questions: questionsEval,
          studentName: currentUser.name,
        }),
      });

      const data = await response.json();
      aiFeedbackData = data;
    } catch {
      // Handled
    } finally {
      setIsAiLoading(false);
    }

    const result = addQuizResult({
      quizId: activeQuiz.id,
      quizTitle: activeQuiz.title,
      studentId: currentUser.id,
      studentName: currentUser.name,
      score,
      totalPoints,
      percentage,
      userAnswers: selectedAnswers,
      aiFeedback: aiFeedbackData,
    });

    setSubmittedResult(result);
  };

  const handleAddQuestion = () => {
    const nextId = `q${questions.length + 1}`;
    setQuestions((prev) => [
      ...prev,
      {
        id: nextId,
        question: `Question ${prev.length + 1}: `,
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        correctAnswerIndex: 0,
        explanation: 'Correct explanation...',
      },
    ]);
  };

  const handleCreateQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quizTitle.trim() || questions.length === 0) return;

    const targetClass = classes.find((c) => c.id === classId);

    addQuiz({
      classId,
      className: targetClass?.title || 'General Class',
      teacherId: currentUser.id,
      title: quizTitle,
      description: quizDesc,
      timeLimitMinutes: timeLimit,
      questions,
      totalPoints: questions.length * 10,
    });

    setQuizTitle('');
    setQuizDesc('');
    setIsCreateModalOpen(false);
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remSecs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-pink-600" />
            Interactive Quizzes & AI Feedback
          </h1>
          <p className="text-xs text-slate-500">
            Take timed quizzes, test your knowledge, and receive instant AI analysis.
          </p>
        </div>

        {currentUser.role === 'teacher' && (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white font-bold text-xs shadow-md hover:opacity-90 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Quiz</span>
          </button>
        )}
      </div>

      {/* Active Quiz Player Overlay */}
      {activeQuiz ? (
        <div className="p-6 rounded-3xl bg-white border border-pink-200 shadow-xl space-y-6 relative animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-pink-50 text-pink-700 border border-pink-200">
                {activeQuiz.className}
              </span>
              <h2 className="text-xl font-extrabold text-slate-800 mt-1">{activeQuiz.title}</h2>
            </div>

            <div className="flex items-center gap-3">
              {!isQuizSubmitted && (
                <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 font-mono font-bold text-sm">
                  <Clock className="w-4 h-4 text-rose-600 animate-pulse" />
                  <span>{formatTime(timeLeftSeconds)}</span>
                </div>
              )}

              <button
                onClick={() => setActiveQuiz(null)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-600 font-bold text-xs hover:bg-slate-200 transition-all cursor-pointer"
              >
                Close Module
              </button>
            </div>
          </div>

          {/* Quiz Questions List */}
          <div className="space-y-6">
            {activeQuiz.questions.map((q, idx) => (
              <div key={q.id} className="p-5 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-3">
                <p className="font-bold text-sm text-slate-800">
                  {idx + 1}. {q.question}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = selectedAnswers[q.id] === optIdx;
                    const isCorrect = q.correctAnswerIndex === optIdx;

                    let btnClass = 'bg-white border-slate-200 text-slate-700 hover:border-pink-300';
                    if (isSelected) {
                      btnClass = 'bg-pink-50 border-pink-500 text-pink-800 font-bold ring-2 ring-pink-200';
                    }
                    if (isQuizSubmitted) {
                      if (isCorrect) {
                        btnClass = 'bg-emerald-50 border-emerald-500 text-emerald-800 font-bold';
                      } else if (isSelected && !isCorrect) {
                        btnClass = 'bg-rose-50 border-rose-400 text-rose-800 font-bold';
                      }
                    }

                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectOption(q.id, optIdx)}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${btnClass}`}
                      >
                        <span>{opt}</span>
                        {isQuizSubmitted && isCorrect && <Check className="w-4 h-4 text-emerald-600" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {!isQuizSubmitted ? (
            <div className="flex justify-end pt-4">
              <button
                onClick={handleFinishQuiz}
                className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-xs shadow-md hover:opacity-90 transition-all cursor-pointer"
              >
                Submit Quiz Answers
              </button>
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-gradient-to-r from-pink-50 via-purple-50 to-rose-50 border border-pink-200 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-pink-800 font-bold text-base">
                  <Award className="w-5 h-5 text-pink-600" /> Quiz Completed!
                </div>
                {submittedResult && (
                  <span className="text-sm font-extrabold px-3 py-1 rounded-full bg-pink-100 text-pink-800">
                    Score: {submittedResult.score} / {submittedResult.totalPoints} ({submittedResult.percentage}%)
                  </span>
                )}
              </div>

              {isAiLoading ? (
                <div className="flex items-center gap-2 text-xs font-semibold text-pink-700 animate-pulse">
                  <Sparkles className="w-4 h-4" /> Generating AI quiz analysis and study recommendations...
                </div>
              ) : submittedResult?.aiFeedback ? (
                <div className="space-y-2 text-xs text-slate-800">
                  <p className="font-semibold">{submittedResult.aiFeedback.overallFeedback}</p>
                  {submittedResult.aiFeedback.recommendedTopics?.length > 0 && (
                    <div className="flex items-center gap-2 pt-1">
                      <span className="font-bold text-purple-700">Recommended Topics:</span>
                      {submittedResult.aiFeedback.recommendedTopics.map((top, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-bold">
                          {top}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          )}
        </div>
      ) : (
        /* Quizzes Available List */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {quizzes.map((quiz) => {
            const userResult = quizResults.find(
              (r) => r.quizId === quiz.id && r.studentId === currentUser.id
            );
            const totalQuizResults = quizResults.filter((r) => r.quizId === quiz.id);

            return (
              <div
                key={quiz.id}
                className="p-6 rounded-3xl bg-white border border-pink-100/90 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-pink-50 text-pink-700 border border-pink-200">
                      {quiz.className}
                    </span>
                    <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-pink-500" /> {quiz.timeLimitMinutes} mins
                    </span>
                  </div>

                  <h3 className="font-extrabold text-base text-slate-800">{quiz.title}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{quiz.description}</p>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 flex items-center justify-between text-xs text-slate-600">
                  <span>{quiz.questions.length} Multiple Choice Questions</span>
                  <span>{quiz.totalPoints} Total Points</span>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap">
                  {userResult ? (
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                      <Check className="w-4 h-4" /> Score: {userResult.score}/{userResult.totalPoints} ({userResult.percentage}%)
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400 font-medium">
                      {currentUser.role === 'teacher' ? `${totalQuizResults.length} Submissions` : 'Not attempted yet'}
                    </span>
                  )}

                  <div className="flex items-center gap-2">
                    {(currentUser.role === 'teacher' || currentUser.role === 'admin') && (
                      <button
                        onClick={() => setSelectedQuizForResults(quiz)}
                        className="px-3 py-2 rounded-xl bg-purple-50 text-purple-700 border border-purple-200/80 font-bold text-xs hover:bg-purple-100 transition-all cursor-pointer flex items-center gap-1"
                      >
                        <Award className="w-3.5 h-3.5" />
                        <span>Student Results ({totalQuizResults.length})</span>
                      </button>
                    )}

                    <button
                      onClick={() => startQuiz(quiz)}
                      className="px-4 py-2 rounded-xl bg-pink-600 text-white font-bold text-xs shadow-2xs hover:bg-pink-700 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5" /> Start Quiz
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Student Quiz Results Modal for Teachers */}
      {selectedQuizForResults && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-pink-100 relative max-h-[90vh] overflow-y-auto space-y-5">
            <button
              onClick={() => {
                setSelectedQuizForResults(null);
                setResultSearchQuery('');
              }}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-400 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                {selectedQuizForResults.className}
              </span>
              <h2 className="text-xl font-bold text-slate-800 mt-1">Student Results - {selectedQuizForResults.title}</h2>
              <p className="text-xs text-slate-500">View individual student scores, percentages, and AI performance breakdown.</p>
            </div>

            {/* Search Input for Student Name */}
            <div className="relative">
              <input
                type="text"
                value={resultSearchQuery}
                onChange={(e) => setResultSearchQuery(e.target.value)}
                placeholder="Search by student name..."
                className="w-full text-xs font-medium pl-3.5 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-pink-500"
              />
            </div>

            {/* Results Table / List */}
            <div className="space-y-3">
              {(() => {
                const resultsForQuiz = quizResults.filter(
                  (r) =>
                    r.quizId === selectedQuizForResults.id &&
                    r.studentName.toLowerCase().includes(resultSearchQuery.toLowerCase())
                );

                if (resultsForQuiz.length === 0) {
                  return (
                    <div className="p-8 text-center border border-dashed border-slate-200 rounded-2xl text-xs text-slate-400">
                      No student results found for this quiz.
                    </div>
                  );
                }

                return resultsForQuiz.map((res) => {
                  const studentObj = users.find((u) => u.id === res.studentId);
                  const avatarUrl =
                    studentObj?.avatar ||
                    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80';

                  return (
                    <div
                      key={res.id}
                      className="p-4 rounded-2xl border border-pink-100 bg-slate-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={avatarUrl}
                          alt={res.studentName}
                          className="w-10 h-10 rounded-full object-cover ring-2 ring-pink-200"
                        />
                        <div>
                          <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                            <span>{res.studentName}</span>
                            <span className="text-[10px] font-semibold text-slate-400">({studentObj?.email || 'Student'})</span>
                          </div>
                          <p className="text-[11px] text-slate-500">Submitted at: {res.completedAt}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 sm:text-right">
                        <div>
                          <div className="text-sm font-black text-pink-700">
                            {res.score} / {res.totalPoints} ({res.percentage}%)
                          </div>
                          <span
                            className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              res.percentage >= 80
                                ? 'bg-emerald-100 text-emerald-800'
                                : res.percentage >= 60
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {res.percentage >= 80 ? 'Grade A (Passed)' : res.percentage >= 60 ? 'Grade B' : 'Needs Review'}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Create Quiz Modal for Teachers */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-pink-100 relative max-h-[90vh] overflow-y-auto space-y-4">
            <button
              onClick={() => setIsCreateModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-400 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-bold text-slate-800">Create Interactive Quiz</h2>

            <form onSubmit={handleCreateQuiz} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Target Class *</label>
                <select
                  value={classId}
                  onChange={(e) => setClassId(e.target.value)}
                  className="w-full font-medium px-3.5 py-2 rounded-xl border border-slate-200"
                >
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Quiz Title *</label>
                <input
                  type="text"
                  required
                  value={quizTitle}
                  onChange={(e) => setQuizTitle(e.target.value)}
                  placeholder="e.g. Mid-Term Physics & AI Quiz"
                  className="w-full font-medium px-3.5 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Time Limit (Minutes)</label>
                  <input
                    type="number"
                    value={timeLimit}
                    onChange={(e) => setTimeLimit(Number(e.target.value))}
                    className="w-full font-medium px-3.5 py-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                <span className="font-bold text-slate-800">Questions ({questions.length})</span>
                <button
                  type="button"
                  onClick={handleAddQuestion}
                  className="px-3 py-1 rounded-xl bg-pink-100 text-pink-700 font-bold text-xs"
                >
                  + Add Question
                </button>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-pink-600 text-white font-bold"
                >
                  Publish Quiz
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
