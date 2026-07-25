import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MessageSquare, Send, Users, User, Hash } from 'lucide-react';

export const MessagesView: React.FC = () => {
  const { currentUser, messages, sendMessage, classes, users } = useApp();

  const [activeChannel, setActiveChannel] = useState<{
    type: 'class' | 'direct';
    id: string;
    title: string;
  }>({
    type: 'class',
    id: classes[0]?.id || 'c-101',
    title: classes[0]?.title || 'Class Channel',
  });

  const [text, setText] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    if (activeChannel.type === 'class') {
      sendMessage(text, activeChannel.id, undefined);
    } else {
      sendMessage(text, undefined, activeChannel.id);
    }

    setText('');
  };

  const channelMessages = messages.filter((m) => {
    if (activeChannel.type === 'class') {
      return m.classId === activeChannel.id;
    } else {
      return (
        (m.senderId === currentUser.id && m.recipientId === activeChannel.id) ||
        (m.senderId === activeChannel.id && m.recipientId === currentUser.id)
      );
    }
  });

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col md:flex-row rounded-3xl bg-white border border-pink-100 overflow-hidden shadow-2xs">
      {/* Left Sidebar Channels & Direct Messages */}
      <div className="w-full md:w-64 border-r border-pink-100 bg-slate-50/50 p-4 space-y-4 shrink-0">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-pink-400 mb-2">
            Class Channels
          </h2>
          <div className="space-y-1">
            {classes.map((cls) => {
              const isSelected = activeChannel.type === 'class' && activeChannel.id === cls.id;
              return (
                <button
                  key={cls.id}
                  onClick={() =>
                    setActiveChannel({ type: 'class', id: cls.id, title: cls.title })
                  }
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white text-pink-700 shadow-2xs border border-pink-200'
                      : 'text-slate-600 hover:bg-white/60'
                  }`}
                >
                  <Hash className="w-3.5 h-3.5 text-pink-500" />
                  <span className="truncate">{cls.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-pink-400 mb-2">
            Direct Messages
          </h2>
          <div className="space-y-1">
            {users
              .filter((u) => u.id !== currentUser.id)
              .map((usr) => {
                const isSelected = activeChannel.type === 'direct' && activeChannel.id === usr.id;
                return (
                  <button
                    key={usr.id}
                    onClick={() =>
                      setActiveChannel({ type: 'direct', id: usr.id, title: usr.name })
                    }
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-white text-pink-700 shadow-2xs border border-pink-200'
                        : 'text-slate-600 hover:bg-white/60'
                    }`}
                  >
                    <img
                      src={usr.avatar}
                      alt={usr.name}
                      className="w-5 h-5 rounded-full object-cover"
                    />
                    <span className="truncate">{usr.name}</span>
                  </button>
                );
              })}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col justify-between bg-white p-4 md:p-6">
        {/* Chat Header */}
        <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {activeChannel.type === 'class' ? (
              <Hash className="w-5 h-5 text-pink-600" />
            ) : (
              <User className="w-5 h-5 text-purple-600" />
            )}
            <h3 className="font-bold text-sm text-slate-800">{activeChannel.title}</h3>
          </div>
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-pink-50 text-pink-700">
            Real-time Workspace Chat
          </span>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
          {channelMessages.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              No messages in this chat yet. Start the conversation!
            </div>
          ) : (
            channelMessages.map((msg) => {
              const isMe = msg.senderId === currentUser.id;

              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 ${isMe ? 'flex-row-reverse' : ''}`}
                >
                  <img
                    src={msg.senderAvatar}
                    alt={msg.senderName}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-pink-100 shrink-0"
                  />

                  <div className={`space-y-1 max-w-md ${isMe ? 'text-right' : ''}`}>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400">
                      <span className="font-bold text-slate-700">{msg.senderName}</span>
                      <span>{msg.timestamp}</span>
                    </div>

                    <div
                      className={`p-3 rounded-2xl text-xs leading-relaxed shadow-2xs ${
                        isMe
                          ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-tr-none'
                          : 'bg-slate-100 text-slate-800 rounded-tl-none'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="pt-3 border-t border-slate-100 flex gap-2">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={`Message ${activeChannel.title}...`}
            className="flex-1 text-xs font-medium px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-pink-500"
          />
          <button
            type="submit"
            className="px-5 py-2.5 rounded-2xl bg-pink-600 text-white font-bold text-xs shadow-xs hover:bg-pink-700 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Send className="w-4 h-4" /> Send
          </button>
        </form>
      </div>
    </div>
  );
};
