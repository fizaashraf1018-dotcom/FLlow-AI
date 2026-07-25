import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { collection, doc, onSnapshot, setDoc, deleteDoc, updateDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import {
  User,
  UserRole,
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
import {
  INITIAL_USERS,
  INITIAL_CLASSES,
  INITIAL_NOTES,
  INITIAL_TASKS,
  INITIAL_ASSIGNMENTS,
  INITIAL_SUBMISSIONS,
  INITIAL_QUIZZES,
  INITIAL_QUIZ_RESULTS,
  INITIAL_MESSAGES,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_TRANSACTIONS,
  INITIAL_NOTIFICATIONS,
} from '../data/initialData';

interface AppContextType {
  currentView: string;
  setCurrentView: (view: string) => void;

  currentUser: User;
  setCurrentUser: (user: User) => void;
  switchRole: (role: UserRole) => void;
  users: User[];

  firebaseUser: any;
  setFirebaseUser: (user: any) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  
  classes: ClassRoom[];
  addClass: (newClass: Omit<ClassRoom, 'id' | 'createdAt' | 'studentCount' | 'code'>) => ClassRoom;
  joinClassByCode: (code: string) => boolean;

  notes: NoteFile[];
  addNote: (note: Omit<NoteFile, 'id' | 'createdAt' | 'downloadsCount'>) => NoteFile;

  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'isCompleted'>) => void;
  toggleTaskComplete: (taskId: string) => void;
  deleteTask: (taskId: string) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;

  assignments: Assignment[];
  addAssignment: (assignment: Omit<Assignment, 'id' | 'createdAt' | 'submissionCount'>) => Assignment;

  submissions: Submission[];
  addSubmission: (submission: Omit<Submission, 'id' | 'submittedAt' | 'status'>) => Submission;
  updateSubmissionGrade: (submissionId: string, score: number, feedback: string, aiEvaluation?: any) => void;

  quizzes: Quiz[];
  addQuiz: (quiz: Omit<Quiz, 'id' | 'createdAt' | 'attemptsCount'>) => Quiz;

  quizResults: QuizResult[];
  addQuizResult: (result: Omit<QuizResult, 'id' | 'completedAt'>) => QuizResult;

  messages: Message[];
  sendMessage: (content: string, classId?: string, recipientId?: string) => void;

  notifications: Notification[];
  markNotificationRead: (notifId: string) => void;

  announcements: Announcement[];
  addAnnouncement: (ann: Omit<Announcement, 'id' | 'createdAt'>) => void;
  deleteAnnouncement: (annId: string) => void;

  transactions: SubscriptionTransaction[];
  renewTeacherSubscription: (paymentMethod: 'JazzCash' | 'EasyPaisa' | 'Credit Card' | 'Bank Transfer') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<string>('dashboard');

  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('flowai_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem('flowai_current_user');
    return saved ? JSON.parse(saved) : INITIAL_USERS[0]; // Default teacher
  });

  const [classes, setClasses] = useState<ClassRoom[]>(() => {
    const saved = localStorage.getItem('flowai_classes');
    return saved ? JSON.parse(saved) : INITIAL_CLASSES;
  });

  const [notes, setNotes] = useState<NoteFile[]>(() => {
    const saved = localStorage.getItem('flowai_notes');
    return saved ? JSON.parse(saved) : INITIAL_NOTES;
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('flowai_tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [assignments, setAssignments] = useState<Assignment[]>(() => {
    const saved = localStorage.getItem('flowai_assignments');
    return saved ? JSON.parse(saved) : INITIAL_ASSIGNMENTS;
  });

  const [submissions, setSubmissions] = useState<Submission[]>(() => {
    const saved = localStorage.getItem('flowai_submissions');
    return saved ? JSON.parse(saved) : INITIAL_SUBMISSIONS;
  });

  const [quizzes, setQuizzes] = useState<Quiz[]>(() => {
    const saved = localStorage.getItem('flowai_quizzes');
    return saved ? JSON.parse(saved) : INITIAL_QUIZZES;
  });

  const [quizResults, setQuizResults] = useState<QuizResult[]>(() => {
    const saved = localStorage.getItem('flowai_quiz_results');
    return saved ? JSON.parse(saved) : INITIAL_QUIZ_RESULTS;
  });

  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('flowai_messages');
    return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
  });

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('flowai_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    const saved = localStorage.getItem('flowai_announcements');
    return saved ? JSON.parse(saved) : INITIAL_ANNOUNCEMENTS;
  });

  const [transactions, setTransactions] = useState<SubscriptionTransaction[]>(() => {
    const saved = localStorage.getItem('flowai_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('flowai_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('flowai_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('flowai_classes', JSON.stringify(classes));
  }, [classes]);

  useEffect(() => {
    localStorage.setItem('flowai_notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('flowai_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('flowai_assignments', JSON.stringify(assignments));
  }, [assignments]);

  useEffect(() => {
    localStorage.setItem('flowai_submissions', JSON.stringify(submissions));
  }, [submissions]);

  useEffect(() => {
    localStorage.setItem('flowai_quizzes', JSON.stringify(quizzes));
  }, [quizzes]);

  useEffect(() => {
    localStorage.setItem('flowai_quiz_results', JSON.stringify(quizResults));
  }, [quizResults]);

  useEffect(() => {
    localStorage.setItem('flowai_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('flowai_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('flowai_announcements', JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem('flowai_transactions', JSON.stringify(transactions));
  }, [transactions]);

  // Firebase Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setFirebaseUser(user);
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setCurrentUser(userDoc.data() as User);
          }
        } catch {
          // Ignored
        }
      } else {
        setFirebaseUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // Real-time Firestore Sync for Tasks
  useEffect(() => {
    try {
      const unsubTasks = onSnapshot(collection(db, 'tasks'), (snapshot) => {
        if (!snapshot.empty) {
          const loadedTasks: Task[] = snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...docSnap.data(),
          })) as Task[];
          setTasks(loadedTasks);
        }
      }, () => {});
      return () => unsubTasks();
    } catch (e) {
      // Ignored
    }
  }, []);

  // Real-time Firestore Sync for Announcements
  useEffect(() => {
    try {
      const unsubAnn = onSnapshot(collection(db, 'announcements'), (snapshot) => {
        if (!snapshot.empty) {
          const loadedAnn: Announcement[] = snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...docSnap.data(),
          })) as Announcement[];
          setAnnouncements(loadedAnn);
        }
      }, () => {});
      return () => unsubAnn();
    } catch (e) {
      // Ignored
    }
  }, []);

  // Real-time Firestore Sync for Classes
  useEffect(() => {
    try {
      const unsubClasses = onSnapshot(collection(db, 'classes'), (snapshot) => {
        if (!snapshot.empty) {
          const loadedClasses: ClassRoom[] = snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...docSnap.data(),
          })) as ClassRoom[];
          setClasses(loadedClasses);
        }
      }, () => {});
      return () => unsubClasses();
    } catch (e) {
      // Ignored
    }
  }, []);

  // Real-time Firestore Sync for Notes
  useEffect(() => {
    try {
      const unsubNotes = onSnapshot(collection(db, 'notes'), (snapshot) => {
        if (!snapshot.empty) {
          const loadedNotes: NoteFile[] = snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...docSnap.data(),
          })) as NoteFile[];
          setNotes(loadedNotes);
        }
      }, () => {});
      return () => unsubNotes();
    } catch (e) {
      // Ignored
    }
  }, []);

  // Real-time Firestore Sync for Assignments
  useEffect(() => {
    try {
      const unsubAssignments = onSnapshot(collection(db, 'assignments'), (snapshot) => {
        if (!snapshot.empty) {
          const loadedAssignments: Assignment[] = snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...docSnap.data(),
          })) as Assignment[];
          setAssignments(loadedAssignments);
        }
      }, () => {});
      return () => unsubAssignments();
    } catch (e) {
      // Ignored
    }
  }, []);

  // Real-time Firestore Sync for Quizzes
  useEffect(() => {
    try {
      const unsubQuizzes = onSnapshot(collection(db, 'quizzes'), (snapshot) => {
        if (!snapshot.empty) {
          const loadedQuizzes: Quiz[] = snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...docSnap.data(),
          })) as Quiz[];
          setQuizzes(loadedQuizzes);
        }
      }, () => {});
      return () => unsubQuizzes();
    } catch (e) {
      // Ignored
    }
  }, []);

  // Actions
  const switchRole = (role: UserRole) => {
    const found = users.find((u) => u.role === role);
    if (found) {
      setCurrentUser(found);
    } else {
      const newUser: User = {
        id: `u-${role}-${Date.now()}`,
        name: `${role.charAt(0).toUpperCase() + role.slice(1)} User`,
        email: `${role}@flowai.io`,
        role,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        isVerifiedTeacher: role === 'teacher',
        isSubscribedTeacher: role === 'teacher',
      };
      setUsers((prev) => [...prev, newUser]);
      setCurrentUser(newUser);
    }
  };

  const addClass = (newClass: Omit<ClassRoom, 'id' | 'createdAt' | 'studentCount' | 'code'>): ClassRoom => {
    const randomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const created: ClassRoom = {
      ...newClass,
      id: `c-${Date.now()}`,
      code: randomCode,
      createdAt: new Date().toISOString().split('T')[0],
      studentCount: 1,
    };
    setClasses((prev) => [created, ...prev]);

    setDoc(doc(db, 'classes', created.id), created).catch(() => {});

    // Add notification
    const notif: Notification = {
      id: `n-${Date.now()}`,
      userId: currentUser.id,
      title: 'Classroom Created',
      message: `You created classroom "${created.title}" (Code: ${created.code}).`,
      type: 'system',
      read: false,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    setNotifications((prev) => [notif, ...prev]);

    return created;
  };

  const joinClassByCode = (code: string): boolean => {
    const target = classes.find((c) => c.code.toUpperCase() === code.trim().toUpperCase());
    if (target) {
      setClasses((prev) =>
        prev.map((c) => (c.id === target.id ? { ...c, studentCount: c.studentCount + 1 } : c))
      );
      const notif: Notification = {
        id: `n-${Date.now()}`,
        userId: currentUser.id,
        title: 'Joined Classroom',
        message: `Successfully joined "${target.title}".`,
        type: 'system',
        read: false,
        createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      };
      setNotifications((prev) => [notif, ...prev]);
      return true;
    }
    return false;
  };

  const addNote = (note: Omit<NoteFile, 'id' | 'createdAt' | 'downloadsCount'>): NoteFile => {
    const created: NoteFile = {
      ...note,
      id: `note-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      downloadsCount: 0,
    };
    setNotes((prev) => [created, ...prev]);

    setDoc(doc(db, 'notes', created.id), created).catch(() => {});

    return created;
  };

  const addTask = (task: Omit<Task, 'id' | 'createdAt' | 'isCompleted'>) => {
    const created: Task = {
      ...task,
      id: `t-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      isCompleted: false,
    };
    setTasks((prev) => [created, ...prev]);

    // Firestore async sync
    setDoc(doc(db, 'tasks', created.id), created).catch(() => {});
  };

  const toggleTaskComplete = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const nextState = !t.isCompleted;
          const updated = {
            ...t,
            isCompleted: nextState,
            completedAt: nextState ? new Date().toISOString().replace('T', ' ').substring(0, 16) : undefined,
          };
          setDoc(doc(db, 'tasks', taskId), updated).catch(() => {});
          return updated;
        }
        return t;
      })
    );
  };

  const deleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    deleteDoc(doc(db, 'tasks', taskId)).catch(() => {});
  };

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const updated = { ...t, ...updates };
          setDoc(doc(db, 'tasks', taskId), updated).catch(() => {});
          return updated;
        }
        return t;
      })
    );
  };

  const addAssignment = (assignment: Omit<Assignment, 'id' | 'createdAt' | 'submissionCount'>): Assignment => {
    const created: Assignment = {
      ...assignment,
      id: `a-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      submissionCount: 0,
    };
    setAssignments((prev) => [created, ...prev]);

    setDoc(doc(db, 'assignments', created.id), created).catch(() => {});

    return created;
  };

  const addSubmission = (submission: Omit<Submission, 'id' | 'submittedAt' | 'status'>): Submission => {
    const created: Submission = {
      ...submission,
      id: `sub-${Date.now()}`,
      submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'pending',
    };
    setSubmissions((prev) => [created, ...prev]);

    // Update assignment submission count
    setAssignments((prev) =>
      prev.map((a) => (a.id === submission.assignmentId ? { ...a, submissionCount: a.submissionCount + 1 } : a))
    );

    return created;
  };

  const updateSubmissionGrade = (submissionId: string, score: number, feedback: string, aiEvaluation?: any) => {
    setSubmissions((prev) =>
      prev.map((s) => {
        if (s.id === submissionId) {
          return {
            ...s,
            score,
            grade: score >= 90 ? 'A+' : score >= 80 ? 'A' : score >= 70 ? 'B' : score >= 60 ? 'C' : 'F',
            status: 'graded',
            teacherFeedback: feedback,
            aiEvaluation: aiEvaluation || s.aiEvaluation,
          };
        }
        return s;
      })
    );
  };

  const addQuiz = (quiz: Omit<Quiz, 'id' | 'createdAt' | 'attemptsCount'>): Quiz => {
    const created: Quiz = {
      ...quiz,
      id: `quiz-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      attemptsCount: 0,
    };
    setQuizzes((prev) => [created, ...prev]);

    setDoc(doc(db, 'quizzes', created.id), created).catch(() => {});

    return created;
  };

  const addQuizResult = (result: Omit<QuizResult, 'id' | 'completedAt'>): QuizResult => {
    const created: QuizResult = {
      ...result,
      id: `qr-${Date.now()}`,
      completedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    setQuizResults((prev) => [created, ...prev]);

    // Update quiz attempts count
    setQuizzes((prev) =>
      prev.map((q) => (q.id === result.quizId ? { ...q, attemptsCount: q.attemptsCount + 1 } : q))
    );

    return created;
  };

  const sendMessage = (content: string, classId?: string, recipientId?: string) => {
    const msg: Message = {
      id: `m-${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: currentUser.role,
      senderAvatar: currentUser.avatar,
      classId,
      recipientId,
      content,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    setMessages((prev) => [...prev, msg]);
  };

  const markNotificationRead = (notifId: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === notifId ? { ...n, read: true } : n)));
  };

  const addAnnouncement = (ann: Omit<Announcement, 'id' | 'createdAt'>) => {
    const created: Announcement = {
      ...ann,
      id: `ann-${Date.now()}`,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    setAnnouncements((prev) => [created, ...prev]);

    setDoc(doc(db, 'announcements', created.id), created).catch(() => {});
  };

  const deleteAnnouncement = (annId: string) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== annId));
    deleteDoc(doc(db, 'announcements', annId)).catch(() => {});
  };

  const renewTeacherSubscription = (paymentMethod: 'JazzCash' | 'EasyPaisa' | 'Credit Card' | 'Bank Transfer') => {
    const tx: SubscriptionTransaction = {
      id: `tx-${Date.now()}`,
      teacherId: currentUser.id,
      teacherName: currentUser.name,
      amountPKR: 300,
      paymentMethod,
      status: 'active',
      date: new Date().toISOString().split('T')[0],
      renewsOn: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    };
    setTransactions((prev) => [tx, ...prev]);

    // Update current user
    const updatedUser: User = {
      ...currentUser,
      isVerifiedTeacher: true,
      isSubscribedTeacher: true,
      subscriptionRenewsAt: tx.renewsOn,
    };
    setCurrentUser(updatedUser);
    setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updatedUser : u)));

    // Notification
    const notif: Notification = {
      id: `n-${Date.now()}`,
      userId: currentUser.id,
      title: 'Subscription Renewed (PKR 300)',
      message: `Your Flow AI Teacher Pro subscription is active until ${tx.renewsOn}. Paid via ${paymentMethod}.`,
      type: 'subscription',
      read: false,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        currentUser,
        setCurrentUser,
        switchRole,
        users,
        firebaseUser,
        setFirebaseUser,
        isAuthModalOpen,
        setIsAuthModalOpen,
        classes,
        addClass,
        joinClassByCode,
        notes,
        addNote,
        tasks,
        addTask,
        toggleTaskComplete,
        deleteTask,
        updateTask,
        assignments,
        addAssignment,
        submissions,
        addSubmission,
        updateSubmissionGrade,
        quizzes,
        addQuiz,
        quizResults,
        addQuizResult,
        messages,
        sendMessage,
        notifications,
        markNotificationRead,
        announcements,
        addAnnouncement,
        deleteAnnouncement,
        transactions,
        renewTeacherSubscription,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
