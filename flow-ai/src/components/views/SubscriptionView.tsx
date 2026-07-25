import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CreditCard, Award, CheckCircle2, ShieldCheck, Sparkles, GraduationCap, DollarSign, Wallet } from 'lucide-react';

export const SubscriptionView: React.FC = () => {
  const { currentUser, transactions, renewTeacherSubscription } = useApp();

  const [selectedMethod, setSelectedMethod] = useState<'JazzCash' | 'EasyPaisa' | 'Credit Card' | 'Bank Transfer'>('JazzCash');
  const [paymentMsg, setPaymentMsg] = useState<string | null>(null);

  const handleSubscribe = () => {
    renewTeacherSubscription(selectedMethod);
    setPaymentMsg(`Subscription renewed successfully for PKR 300 via ${selectedMethod}!`);
    setTimeout(() => setPaymentMsg(null), 4000);
  };

  const isStudent = currentUser.role === 'student';

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-3xl font-serif font-bold text-slate-900 flex items-center gap-2">
          <CreditCard className="w-6 h-6 text-pink-600" />
          Subscription & Platform Access Portal
        </h1>
        <p className="text-xs text-slate-500">
          Students use Flow AI 100% free forever. Teachers can manage their PKR 300/month educator pro plan.
        </p>
      </div>

      {/* Free Student Account Showcase Card */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-700 text-white shadow-xl shadow-emerald-200/60 space-y-4 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-emerald-200" />
            <span className="text-xs font-bold uppercase tracking-widest bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 font-sans">
              Student Access Tier
            </span>
          </div>
          <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-white text-emerald-900 font-sans self-start sm:self-auto shadow-2xs">
            100% Free Forever
          </span>
        </div>

        <div>
          <div className="text-3xl font-serif font-bold">
            Free for All Students
          </div>
          <p className="text-xs text-emerald-100 mt-1">
            Zero subscription fees. Zero hidden charges. Complete access to classrooms, AI study planner, assignment submissions, and interactive quizzes.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 text-xs text-emerald-50">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-200 shrink-0" />
            <span>Join unlimited classrooms with 6-digit codes</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-200 shrink-0" />
            <span>Submit assignments & receive instant Flow AI feedback</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-200 shrink-0" />
            <span>Take timed quizzes & track automated progress reports</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-200 shrink-0" />
            <span>Use AI Study Assistant & download lecture materials</span>
          </div>
        </div>
      </div>

      {/* Teacher Subscription & Educator Section */}
      <div className="pt-2">
        <div className="mb-4">
          <h2 className="text-xl font-serif font-bold text-slate-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-pink-600" />
            Teacher Pro Subscription (PKR 300 / month)
          </h2>
          <p className="text-xs text-slate-500">
            Educators pay PKR 300/month to create classrooms, upload lecture files, use AI auto-grader, and earn course income.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 p-6 md:p-8 rounded-3xl bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white shadow-xl shadow-pink-200/60 space-y-4 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-widest bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 font-sans">
                Flow AI Teacher Pro Plan
              </span>
              <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-emerald-400 text-slate-900 font-sans">
                {currentUser.role === 'teacher' && currentUser.isSubscribedTeacher ? 'Active Subscription' : 'Teacher Plan'}
              </span>
            </div>

            <div>
              <div className="text-4xl font-serif font-bold">
                PKR 300 <span className="text-sm font-sans font-normal text-pink-100">/ month</span>
              </div>
              <p className="text-xs text-pink-100 mt-1">
                Renews automatically every 30 days. Next billing date: {currentUser.subscriptionRenewsAt || '2026-08-15'}.
              </p>
            </div>

            <div className="space-y-2 pt-2 text-xs text-pink-100">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
                <span>Unlimited Digital Classrooms & Student Enrollments</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
                <span>Server-side Gemini AI Auto-Grader for Assignments & Quizzes</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
                <span>Upload Notes, PDFs, DOCX, PPTs & Videos</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
                <span>Direct payouts via JazzCash & EasyPaisa for paid courses</span>
              </div>
            </div>
          </div>

          {/* Payout Summary Widget */}
          <div className="p-6 rounded-3xl bg-white/95 border border-pink-200/60 shadow-2xs flex flex-col justify-between space-y-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Teacher Earnings</span>
              <div className="text-4xl font-serif font-bold text-slate-900 mt-1">PKR 18,400</div>
              <p className="text-[11px] text-emerald-600 font-semibold mt-1">
                Available for instant withdrawal
              </p>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => alert('Withdrawal request initiated to JazzCash account!')}
                className="w-full py-2.5 rounded-2xl bg-emerald-600 text-white font-bold text-xs shadow-2xs hover:bg-emerald-700 transition-all cursor-pointer"
              >
                Withdraw Earnings (JazzCash)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Renewal Form */}
      <div className="p-6 rounded-3xl bg-white border border-pink-100 shadow-xs space-y-4">
        <h2 className="font-bold text-base text-slate-800">Teacher Subscription Renewal & Payment</h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {(['JazzCash', 'EasyPaisa', 'Credit Card', 'Bank Transfer'] as const).map((method) => (
            <button
              key={method}
              onClick={() => setSelectedMethod(method)}
              className={`p-3.5 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                selectedMethod === method
                  ? 'border-pink-500 bg-pink-50 text-pink-700 shadow-2xs ring-2 ring-pink-200'
                  : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-pink-200'
              }`}
            >
              {method}
            </button>
          ))}
        </div>

        <div className="pt-2 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-medium">Amount Due: <strong>PKR 300</strong></span>
          <button
            onClick={handleSubscribe}
            className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-xs shadow-md hover:opacity-90 transition-all cursor-pointer"
          >
            Pay PKR 300 & Activate Teacher Plan
          </button>
        </div>

        {paymentMsg && (
          <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-semibold">
            {paymentMsg}
          </div>
        )}
      </div>

      {/* Transaction History */}
      <div className="p-6 rounded-3xl bg-white border border-pink-100 shadow-xs space-y-4">
        <h2 className="font-bold text-base text-slate-800">Billing & Payment History</h2>

        <div className="space-y-2">
          {transactions.map((tx) => (
            <div
              key={tx.id}
              className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs"
            >
              <div>
                <span className="font-bold text-slate-800 block">Flow AI Teacher Subscription</span>
                <span className="text-[10px] text-slate-400">
                  Method: {tx.paymentMethod} • Date: {tx.date}
                </span>
              </div>

              <div className="text-right">
                <span className="font-bold text-pink-700 block">PKR {tx.amountPKR}</span>
                <span className="text-[10px] text-emerald-600 font-bold uppercase">{tx.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
