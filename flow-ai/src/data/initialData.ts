import {
  User,
  ClassRoom,
  NoteFile,
  Task,
  Assignment,
  Submission,
  Quiz,
  QuizResult,
  Message,
  Notification,
  Announcement,
  SubscriptionTransaction,
} from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'u-teacher-1',
    name: 'Prof. Aisha Khan',
    email: 'aisha.khan@flowai.edu',
    role: 'teacher',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    isVerifiedTeacher: true,
    isSubscribedTeacher: true,
    subscriptionRenewsAt: '2026-08-15',
    bio: 'Senior Physics & Computer Science Educator | Passionate about AI-assisted interactive learning.',
    institutionOrCompany: 'National Science Academy',
  },
  {
    id: 'u-student-1',
    name: 'Zain Malik',
    email: 'zain.malik@student.pk',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    bio: 'CS Undergraduate & EdTech Enthusiast',
    institutionOrCompany: 'FAST NUCES Lahore',
  },
  {
    id: 'u-student-2',
    name: 'Fatima Ahmed',
    email: 'fatima.ahmed@student.pk',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    bio: 'Physics Major & Quantum Computing Researcher',
    institutionOrCompany: 'LUMS School of Science',
  },
  {
    id: 'u-student-3',
    name: 'Bilal Hassan',
    email: 'bilal.hassan@student.pk',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    bio: 'Software Engineering Scholar & Web Developer',
    institutionOrCompany: 'NUST Islamabad',
  },
  {
    id: 'u-student-4',
    name: 'Sara Imran',
    email: 'sara.imran@student.pk',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    bio: 'AI & Data Science Student',
    institutionOrCompany: 'GIKI Institute',
  },
  {
    id: 'u-entrepreneur-1',
    name: 'Hamza Farooq',
    email: 'hamza@growthcraft.co',
    role: 'entrepreneur',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    bio: 'Founder at GrowthCraft Studios | Managing remote tech teams & client deliverables.',
    institutionOrCompany: 'GrowthCraft Studios',
  },
  {
    id: 'u-admin-1',
    name: 'Flow Admin',
    email: 'admin@flowai.io',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    bio: 'Platform Administrator & Content Auditor',
    institutionOrCompany: 'Flow AI Global',
  },
];

export const INITIAL_CLASSES: ClassRoom[] = [
  {
    id: 'c-101',
    code: 'PHYS-301',
    title: 'Advanced Quantum Mechanics & AI Modeling',
    subject: 'Physics',
    teacherId: 'u-teacher-1',
    teacherName: 'Prof. Aisha Khan',
    teacherAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    description: 'Comprehensive study of wave equations, quantum state vectors, and machine learning simulations in physics.',
    studentCount: 38,
    bannerGradient: 'from-pink-500 via-rose-400 to-purple-500',
    createdAt: '2026-06-01',
  },
  {
    id: 'c-102',
    code: 'CS-402',
    title: 'Full-Stack Software Architecture & APIs',
    subject: 'Computer Science',
    teacherId: 'u-teacher-1',
    teacherName: 'Prof. Aisha Khan',
    teacherAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    description: 'Building high-scale web applications, microservices, Express JS, and AI API integrations.',
    studentCount: 52,
    bannerGradient: 'from-purple-600 via-pink-500 to-rose-400',
    createdAt: '2026-06-10',
  },
];

export const INITIAL_NOTES: NoteFile[] = [
  {
    id: 'note-1',
    classId: 'c-101',
    title: 'Lecture 04 - Wave Equations & Harmonic Oscillators.pdf',
    fileType: 'pdf',
    fileSize: '4.2 MB',
    contentSnippet: 'Mathematical derivation of Schrodinger time-independent equation with step-by-step boundary condition examples.',
    authorId: 'u-teacher-1',
    authorName: 'Prof. Aisha Khan',
    category: 'Physics Notes',
    downloadsCount: 142,
    createdAt: '2026-07-10',
    tags: ['Physics', 'Quantum', 'Equations'],
  },
  {
    id: 'note-2',
    classId: 'c-102',
    title: 'REST API Best Practices & Security Guide.docx',
    fileType: 'docx',
    fileSize: '1.8 MB',
    contentSnippet: 'Guidelines on JWT authentication, rate limiting, Express middleware, and CORS header security in Node.js applications.',
    authorId: 'u-teacher-1',
    authorName: 'Prof. Aisha Khan',
    category: 'CS Study Guide',
    downloadsCount: 210,
    createdAt: '2026-07-15',
    tags: ['Backend', 'Security', 'Express'],
  },
  {
    id: 'note-3',
    title: 'SaaS Startup Pitch Deck & Financial Roadmap.ppt',
    fileType: 'ppt',
    fileSize: '8.5 MB',
    contentSnippet: 'Template presentation deck for seed-stage startups, covering TAM/SAM, unit economics, customer acquisition cost, and revenue model.',
    authorId: 'u-entrepreneur-1',
    authorName: 'Hamza Farooq',
    category: 'Business Strategy',
    downloadsCount: 89,
    createdAt: '2026-07-20',
    tags: ['Startup', 'Pitch', 'Business'],
  },
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 't-1',
    userId: 'u-student-1',
    title: 'Complete Quantum Physics Assignment 2',
    description: 'Solve problem set 3 and review wave packet collapse concepts before Thursday.',
    dueDate: '2026-07-28',
    dueTime: '23:59',
    priority: 'high',
    category: 'Study',
    isCompleted: false,
    createdAt: '2026-07-22',
  },
  {
    id: 't-2',
    userId: 'u-student-1',
    title: 'Attempt Full-Stack Architecture Quiz',
    description: 'Take the online 15-minute quiz on Express middlewares and REST status codes.',
    dueDate: '2026-07-26',
    dueTime: '18:00',
    priority: 'high',
    category: 'Study',
    isCompleted: true,
    completedAt: '2026-07-24 14:20',
    createdAt: '2026-07-21',
  },
  {
    id: 't-3',
    userId: 'u-entrepreneur-1',
    title: 'Review Q3 Client Proposal & Sprint Goals',
    description: 'Finalize scope for mobile app redesign project and send invoice draft.',
    dueDate: '2026-07-29',
    dueTime: '12:00',
    priority: 'medium',
    category: 'Business',
    isCompleted: false,
    createdAt: '2026-07-23',
  },
  {
    id: 't-4',
    userId: 'u-teacher-1',
    title: 'Evaluate Quantum Physics Mid-Term Submissions',
    description: 'Use Flow AI Auto-Grader to evaluate 38 student assignments and post feedback.',
    dueDate: '2026-07-27',
    dueTime: '17:00',
    priority: 'high',
    category: 'Teaching',
    isCompleted: false,
    createdAt: '2026-07-23',
  },
];

export const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    id: 'a-1',
    classId: 'c-101',
    className: 'Advanced Quantum Mechanics & AI Modeling',
    teacherId: 'u-teacher-1',
    title: 'Assignment 2: Particle in a 1D Potential Well',
    description: 'Derive wave functions for n=1, n=2 energy states. Submit a typed response or scanned clear document explaining key physics principles.',
    dueDate: '2026-07-28',
    maxPoints: 100,
    rubricText: 'Accuracy of derivations (40%), Physical explanation (30%), Neatness & diagrams (30%).',
    submissionCount: 14,
    createdAt: '2026-07-18',
  },
  {
    id: 'a-2',
    classId: 'c-102',
    className: 'Full-Stack Software Architecture & APIs',
    teacherId: 'u-teacher-1',
    title: 'Assignment 1: Designing RESTful Endpoints & Middleware',
    description: 'Write an Express middleware that validates JWT tokens and handles rate limiting. Provide code snippet and test output.',
    dueDate: '2026-08-02',
    maxPoints: 100,
    rubricText: 'Code correctness (50%), Error handling (30%), Code cleanliness (20%).',
    submissionCount: 22,
    createdAt: '2026-07-20',
  },
];

export const INITIAL_SUBMISSIONS: Submission[] = [
  {
    id: 'sub-1',
    assignmentId: 'a-1',
    studentId: 'u-student-1',
    studentName: 'Zain Malik',
    studentAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    submittedAt: '2026-07-24 16:30',
    content: `Solution for 1D Infinite Potential Well Problem:

1. Boundary Conditions:
At x = 0 and x = L, wave function Psi(x) must equal 0 due to infinite potential barriers.
Solving the Schrodinger equation: -(hbar^2 / 2m) d^2 Psi / dx^2 = E Psi
Setting k = sqrt(2mE / hbar^2), general solution is Psi(x) = A sin(kx) + B cos(kx).

2. Applying Boundary Conditions:
Psi(0) = B = 0 -> Psi(x) = A sin(kx).
Psi(L) = A sin(kL) = 0 -> kL = n * pi for n = 1, 2, 3...
Energy levels E_n = (n^2 * pi^2 * hbar^2) / (2m L^2).

3. Normalization:
Integral from 0 to L of |Psi(x)|^2 dx = 1 -> A = sqrt(2/L).
Therefore, Psi_n(x) = sqrt(2/L) * sin(n * pi * x / L).

Conclusion: Energy is quantized and proportional to n^2.`,
    attachmentName: 'zain_malik_physics_ans.pdf',
    status: 'graded',
    score: 92,
    grade: 'A',
    aiEvaluation: {
      scoreOutof100: 92,
      letterGrade: 'A',
      summary: 'Excellent and mathematically rigorous solution. Clear step-by-step application of boundary conditions and normalization.',
      strengths: [
        'Correct boundary condition application',
        'Accurate derivation of energy level quantization E_n',
        'Clean normalization step resulting in sqrt(2/L)',
      ],
      improvements: [
        'Could include a brief physical interpretation of probability density |Psi(x)|^2 for n=1 vs n=2',
      ],
      actionableTips: [
        'Sketch the probability density nodes for extra clarity in future submissions',
      ],
      evaluatedAt: '2026-07-24 16:31',
    },
    teacherFeedback: 'Outstanding work Zain! AI evaluation confirmed your derivation is completely accurate.',
  },
  {
    id: 'sub-2',
    assignmentId: 'a-1',
    studentId: 'u-student-2',
    studentName: 'Fatima Ahmed',
    studentAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    submittedAt: '2026-07-24 15:10',
    content: `Derivation for 1D Infinite Quantum Potential Well:

1. Time-independent Schrodinger equation set up for V(x) = 0 inside (0, L).
2. Wavefunction form: Psi(x) = C sin(kx) + D cos(kx).
3. Enforcing Psi(0) = 0 gives D = 0.
4. Enforcing Psi(L) = 0 gives k = n*pi/L.
5. Wavefunctions: Psi_n(x) = sqrt(2/L) sin(n*pi*x/L).
6. Corresponding energy eigenvalues: E_n = (n^2 pi^2 hbar^2) / (2 m L^2).`,
    attachmentName: 'fatima_quantum_sol.pdf',
    status: 'graded',
    score: 88,
    grade: 'A-',
    aiEvaluation: {
      scoreOutof100: 88,
      letterGrade: 'A-',
      summary: 'Strong mathematical derivation with clear concise steps. Well structured boundary condition proof.',
      strengths: ['Clear step numbering', 'Accurate wavefunction normalization'],
      improvements: ['Add a brief note on ground state energy E1 non-zero zero-point energy.'],
      actionableTips: ['Mention physical significance of zero-point energy in quantum wells.'],
      evaluatedAt: '2026-07-24 15:15',
    },
    teacherFeedback: 'Great derivation Fatima! Very clear layout.',
  },
  {
    id: 'sub-3',
    assignmentId: 'a-2',
    studentId: 'u-student-3',
    studentName: 'Bilal Hassan',
    studentAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    submittedAt: '2026-07-23 18:45',
    content: `Express JWT & Rate Limiter Middleware Code:

const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing token' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Forbidden: Invalid token' });
  }
}

module.exports = authMiddleware;`,
    attachmentName: 'bilal_express_middleware.js',
    status: 'graded',
    score: 95,
    grade: 'A+',
    aiEvaluation: {
      scoreOutof100: 95,
      letterGrade: 'A+',
      summary: 'Production-ready Express authentication middleware implementation. Proper error handling and header parsing.',
      strengths: ['Correct Bearer token extraction', 'Clean try/catch block with exact HTTP status codes (401 and 403)'],
      improvements: ['Consider adding rate limiting using express-rate-limit package as optional enhancement'],
      actionableTips: ['Integrate IP rate limiting middleware alongside JWT verification'],
      evaluatedAt: '2026-07-23 18:50',
    },
    teacherFeedback: 'Flawless Express code structure, Bilal!',
  },
  {
    id: 'sub-4',
    assignmentId: 'a-2',
    studentId: 'u-student-4',
    studentName: 'Sara Imran',
    studentAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    submittedAt: '2026-07-24 11:20',
    content: `JWT Authentication Middleware in Express:

export const verifyJwt = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token required' });
  
  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
};`,
    attachmentName: 'sara_jwt_solution.ts',
    status: 'graded',
    score: 90,
    grade: 'A',
    aiEvaluation: {
      scoreOutof100: 90,
      letterGrade: 'A',
      summary: 'Clean TypeScript middleware using optional chaining on authorization header.',
      strengths: ['TypeScript types used properly', 'Clear status codes'],
      improvements: ['Include rate limiting header options'],
      actionableTips: ['Explicitly type req.user with interface declaration'],
      evaluatedAt: '2026-07-24 11:25',
    },
    teacherFeedback: 'Very neat TypeScript code, Sara!',
  },
];

export const INITIAL_QUIZZES: Quiz[] = [
  {
    id: 'quiz-1',
    classId: 'c-102',
    className: 'Full-Stack Software Architecture & APIs',
    teacherId: 'u-teacher-1',
    title: 'Quiz 1: Express HTTP Status Codes & Middleware',
    description: 'Quick check on Express middleware lifecycle, status codes, and error handlers.',
    timeLimitMinutes: 10,
    totalPoints: 30,
    attemptsCount: 29,
    createdAt: '2026-07-15',
    questions: [
      {
        id: 'q1',
        question: 'Which HTTP status code signifies a resource was successfully created on the server?',
        options: ['200 OK', '201 Created', '204 No Content', '400 Bad Request'],
        correctAnswerIndex: 1,
        explanation: '201 Created indicates that the request has succeeded and led to the creation of a resource.',
      },
      {
        id: 'q2',
        question: 'In Express, what parameter signature distinguishes an error-handling middleware?',
        options: ['(req, res, next)', '(err, req, res, next)', '(req, res, err)', '(next, req, res)'],
        correctAnswerIndex: 1,
        explanation: 'Express recognizes error-handling middleware by taking exactly 4 arguments: (err, req, res, next).',
      },
      {
        id: 'q3',
        question: 'Which header field is commonly used to send JWT Bearer tokens for authentication?',
        options: ['Content-Type', 'Authorization', 'X-Api-Key', 'Accept-Encoding'],
        correctAnswerIndex: 1,
        explanation: 'The Authorization header formatted as `Bearer <token>` is the standard protocol for OAuth & JWT tokens.',
      },
    ],
  },
];

export const INITIAL_QUIZ_RESULTS: QuizResult[] = [
  {
    id: 'qr-1',
    quizId: 'quiz-1',
    quizTitle: 'Quiz 1: Express HTTP Status Codes & Middleware',
    studentId: 'u-student-1',
    studentName: 'Zain Malik',
    score: 30,
    totalPoints: 30,
    percentage: 100,
    completedAt: '2026-07-24 14:20',
    userAnswers: {
      q1: 1,
      q2: 1,
      q3: 1,
    },
    aiFeedback: {
      overallFeedback: 'Perfect score! You demonstrated flawless knowledge of Express HTTP status codes and middleware fundamentals.',
      recommendedTopics: ['Advanced Rate Limiting', 'GraphQL vs REST'],
      feedbackPerQuestion: [
        {
          questionId: 'q1',
          isCorrect: true,
          explanation: 'Correct! 201 Created is the standard response for POST requests that generate a new resource.',
          studyTip: 'Keep using 201 Created when returning new resource IDs.',
        },
        {
          questionId: 'q2',
          isCorrect: true,
          explanation: 'Spot on! Express uses arity checking (fn.length === 4) to identify error handlers.',
          studyTip: 'Always place error handlers at the very end of your app.use stack.',
        },
        {
          questionId: 'q3',
          isCorrect: true,
          explanation: 'Correct! The Authorization header is standard.',
          studyTip: 'Remember to strip the "Bearer " prefix in server middleware.',
        },
      ],
    },
  },
  {
    id: 'qr-2',
    quizId: 'quiz-1',
    quizTitle: 'Quiz 1: Express HTTP Status Codes & Middleware',
    studentId: 'u-student-2',
    studentName: 'Fatima Ahmed',
    score: 20,
    totalPoints: 30,
    percentage: 67,
    completedAt: '2026-07-24 13:10',
    userAnswers: {
      q1: 1,
      q2: 0,
      q3: 1,
    },
    aiFeedback: {
      overallFeedback: 'Good effort! Review Express error-handling middleware signatures (4 parameters).',
      recommendedTopics: ['Express Middleware Arity', 'Error Boundary Middleware'],
      feedbackPerQuestion: [],
    },
  },
  {
    id: 'qr-3',
    quizId: 'quiz-1',
    quizTitle: 'Quiz 1: Express HTTP Status Codes & Middleware',
    studentId: 'u-student-3',
    studentName: 'Bilal Hassan',
    score: 30,
    totalPoints: 30,
    percentage: 100,
    completedAt: '2026-07-23 17:30',
    userAnswers: {
      q1: 1,
      q2: 1,
      q3: 1,
    },
    aiFeedback: {
      overallFeedback: 'Excellent performance! Full marks on backend Express concepts.',
      recommendedTopics: ['Microservice Gateway Pattern'],
      feedbackPerQuestion: [],
    },
  },
  {
    id: 'qr-4',
    quizId: 'quiz-1',
    quizTitle: 'Quiz 1: Express HTTP Status Codes & Middleware',
    studentId: 'u-student-4',
    studentName: 'Sara Imran',
    score: 20,
    totalPoints: 30,
    percentage: 67,
    completedAt: '2026-07-24 10:15',
    userAnswers: {
      q1: 1,
      q2: 1,
      q3: 0,
    },
    aiFeedback: {
      overallFeedback: 'Solid attempt! Review standard Authorization header format (Bearer token).',
      recommendedTopics: ['JWT Bearer Auth Headers'],
      feedbackPerQuestion: [],
    },
  },
];

export const INITIAL_MESSAGES: Message[] = [
  {
    id: 'm-1',
    senderId: 'u-teacher-1',
    senderName: 'Prof. Aisha Khan',
    senderRole: 'teacher',
    senderAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    classId: 'c-101',
    content: 'Welcome students! I uploaded Lecture 04 notes on Wave Equations. Please attempt Assignment 2 by next Tuesday.',
    timestamp: '2026-07-24 10:00',
  },
  {
    id: 'm-2',
    senderId: 'u-student-1',
    senderName: 'Zain Malik',
    senderRole: 'student',
    senderAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    classId: 'c-101',
    content: 'Thank you Professor Aisha! The boundary condition examples in the PDF were very helpful.',
    timestamp: '2026-07-24 10:15',
  },
  {
    id: 'm-3',
    senderId: 'u-entrepreneur-1',
    senderName: 'Hamza Farooq',
    senderRole: 'entrepreneur',
    senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    recipientId: 'u-student-1',
    content: 'Hi Zain! I saw your software architecture profile on Flow AI. Are you interested in freelancing for our startup sprint?',
    timestamp: '2026-07-24 15:00',
  },
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    classId: 'c-101',
    className: 'Advanced Quantum Mechanics & AI Modeling',
    authorName: 'Prof. Aisha Khan',
    title: '📢 Live Q&A Session Scheduled for Friday 5 PM',
    content: 'We will review key quantum state derivation questions and AI simulation tools live on Friday. Bring your questions!',
    createdAt: '2026-07-24 09:00',
  },
];

export const INITIAL_TRANSACTIONS: SubscriptionTransaction[] = [
  {
    id: 'tx-1001',
    teacherId: 'u-teacher-1',
    teacherName: 'Prof. Aisha Khan',
    amountPKR: 300,
    paymentMethod: 'JazzCash',
    status: 'active',
    date: '2026-07-15',
    renewsOn: '2026-08-15',
  },
];

export const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-1',
    userId: 'u-student-1',
    title: 'New Assignment Posted',
    message: 'Prof. Aisha Khan posted Assignment 2 in Advanced Quantum Mechanics.',
    type: 'assignment',
    read: false,
    createdAt: '2026-07-24 10:00',
  },
  {
    id: 'notif-2',
    userId: 'u-teacher-1',
    title: 'Subscription Active (PKR 300/mo)',
    message: 'Your Flow AI Teacher Pro Subscription is active until Aug 15, 2026.',
    type: 'subscription',
    read: true,
    createdAt: '2026-07-15 12:00',
  },
];
