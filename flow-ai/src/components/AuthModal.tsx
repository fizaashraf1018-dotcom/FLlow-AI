import React, { useState } from 'react';
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  User as FirebaseUser,
} from 'firebase/auth';
import { auth, googleProvider, db } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useApp } from '../context/AppContext';
import flowAiLogo from '../assets/images/flow_ai_icon_1784979923657.jpg';
import { UserRole } from '../types';
import {
  X,
  LogIn,
  UserPlus,
  LogOut,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Mail,
  User as UserIcon,
  AlertCircle,
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, firebaseUser, setFirebaseUser, setCurrentUser } = useApp();

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await signInWithPopup(auth, googleProvider);
      const user = res.user;

      // Check if user doc exists in Firestore
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        const newUserProfile = {
          id: user.uid,
          name: user.displayName || user.email?.split('@')[0] || 'User',
          email: user.email || '',
          role: selectedRole,
          avatar: user.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
          isSubscribedTeacher: selectedRole === 'teacher',
          subscriptionRenewsAt: selectedRole === 'teacher' ? '2026-08-30' : undefined,
        };
        await setDoc(userRef, newUserProfile);
        setCurrentUser(newUserProfile);
      } else {
        setCurrentUser(userSnap.data() as any);
      }

      setFirebaseUser(user);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Google sign-in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      let user: FirebaseUser;
      if (mode === 'signup') {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        user = res.user;

        const newUserProfile = {
          id: user.uid,
          name: name.trim() || email.split('@')[0],
          email: user.email || '',
          role: selectedRole,
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
          isSubscribedTeacher: selectedRole === 'teacher',
          subscriptionRenewsAt: selectedRole === 'teacher' ? '2026-08-30' : undefined,
        };

        await setDoc(doc(db, 'users', user.uid), newUserProfile);
        setCurrentUser(newUserProfile);
      } else {
        const res = await signInWithEmailAndPassword(auth, email, password);
        user = res.user;

        const userSnap = await getDoc(doc(db, 'users', user.uid));
        if (userSnap.exists()) {
          setCurrentUser(userSnap.data() as any);
        }
      }

      setFirebaseUser(user);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setFirebaseUser(null);
      onClose();
    } catch {
      // Handled
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-pink-100 relative space-y-5">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-400 transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="text-center space-y-2 flex flex-col items-center">
          <img src={flowAiLogo} alt="Flow AI" className="w-12 h-12 rounded-2xl shadow-md border border-pink-200/80 object-cover" referrerPolicy="no-referrer" />
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100 text-pink-700 text-[10px] font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Secure Authentication</span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-slate-900">
            {firebaseUser ? 'Account & Session' : mode === 'login' ? 'Sign In to Flow AI' : 'Create Flow AI Account'}
          </h2>
          <p className="text-xs text-slate-500">
            {firebaseUser
              ? `Signed in as ${firebaseUser.email}`
              : 'Sign in to access your personal study workspace and progress.'}
          </p>
        </div>

        {firebaseUser ? (
          /* Logged In View */
          <div className="space-y-4 pt-2">
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Account Active & Synced</span>
              </div>
              <p className="text-emerald-700">
                User UID: <code className="font-mono bg-white/80 px-1.5 py-0.5 rounded">{firebaseUser.uid}</code>
              </p>
              <p className="text-emerald-700">
                Active Role: <strong className="capitalize">{currentUser.role}</strong>
              </p>
            </div>

            <button
              onClick={handleSignOut}
              className="w-full py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out of Account</span>
            </button>
          </div>
        ) : (
          /* Auth Form View */
          <div className="space-y-4">
            {error && (
              <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{error}</span>
              </div>
            )}

            {/* Google OAuth Button */}
            <button
              type="button"
              disabled={loading}
              onClick={handleGoogleSignIn}
              className="w-full py-2.5 px-4 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-2xs transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="flex items-center gap-2 my-2">
              <div className="flex-1 h-px bg-slate-200"></div>
              <span className="text-[10px] uppercase font-bold text-slate-400">or email</span>
              <div className="flex-1 h-px bg-slate-200"></div>
            </div>

            {/* Email/Password Form */}
            <form onSubmit={handleEmailAuth} className="space-y-3 text-xs">
              {mode === 'signup' && (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Dr. Sarah Jenkins"
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-pink-500 font-medium"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@university.edu"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-pink-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-pink-500 font-medium"
                  />
                </div>
              </div>

              {mode === 'signup' && (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Account Role</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedRole('student')}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        selectedRole === 'student'
                          ? 'bg-purple-50 border-purple-500 text-purple-700'
                          : 'bg-slate-50 border-slate-200 text-slate-600'
                      }`}
                    >
                      🎓 Student
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedRole('teacher')}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        selectedRole === 'teacher'
                          ? 'bg-pink-50 border-pink-500 text-pink-700'
                          : 'bg-slate-50 border-slate-200 text-slate-600'
                      }`}
                    >
                      👨‍🏫 Teacher
                    </button>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white font-bold shadow-md hover:opacity-95 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {mode === 'login' ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                <span>{loading ? 'Processing...' : mode === 'login' ? 'Sign In' : 'Create Account'}</span>
              </button>
            </form>

            {/* Toggle Mode */}
            <div className="text-center pt-2">
              <button
                onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                className="text-xs text-pink-600 hover:text-pink-700 font-bold transition-all cursor-pointer"
              >
                {mode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
