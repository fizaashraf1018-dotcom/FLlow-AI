import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { User } from '../../types';
import { User as UserIcon, UserCheck, Shield, Mail, Building, Sparkles, Check } from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { currentUser, setCurrentUser, users } = useApp();

  const [name, setName] = useState(currentUser.name);
  const [bio, setBio] = useState(currentUser.bio || '');
  const [institution, setInstitution] = useState(currentUser.institutionOrCompany || '');
  const [savedMsg, setSavedMsg] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: User = {
      ...currentUser,
      name,
      bio,
      institutionOrCompany: institution,
    };
    setCurrentUser(updated);
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 2500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
          <UserIcon className="w-6 h-6 text-pink-600" />
          Profile & Account Settings
        </h1>
        <p className="text-xs text-slate-500">
          Manage your personal identity, verified teacher badge status, and platform credentials.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Profile Avatar Card */}
        <div className="p-6 rounded-3xl bg-white border border-pink-100 shadow-xs flex flex-col items-center text-center space-y-4">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-24 h-24 rounded-3xl object-cover ring-4 ring-pink-200 shadow-md"
          />

          <div>
            <h2 className="text-lg font-bold text-slate-800 flex items-center justify-center gap-1.5">
              <span>{currentUser.name}</span>
              {currentUser.isVerifiedTeacher && (
                <UserCheck className="w-4 h-4 text-pink-600" title="Verified Teacher" />
              )}
            </h2>
            <span className="text-xs font-bold text-pink-600 uppercase tracking-wider block mt-0.5">
              Role: {currentUser.role}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-pink-50/70 border border-pink-100/80 text-xs text-slate-600 text-left w-full space-y-2">
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-pink-500" />
              <span>{currentUser.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Building className="w-3.5 h-3.5 text-pink-500" />
              <span>{currentUser.institutionOrCompany || 'FAST NUCES / Flow AI'}</span>
            </div>
          </div>
        </div>

        {/* Right Form Editor */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white border border-pink-100 shadow-xs space-y-4">
          <h2 className="font-bold text-base text-slate-800">Edit Personal Profile</h2>

          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full font-medium px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-pink-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Institution or Company</label>
              <input
                type="text"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                placeholder="e.g. FAST NUCES / National Science Academy"
                className="w-full font-medium px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-pink-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Bio / Profile Headline</label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Short background summary..."
                className="w-full font-medium px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-pink-500"
              />
            </div>

            <div className="pt-2 flex items-center justify-between">
              {savedMsg && (
                <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                  <Check className="w-4 h-4" /> Profile updated!
                </span>
              )}
              <button
                type="submit"
                className="ml-auto px-6 py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-xs shadow-md hover:opacity-90 transition-all cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
