import React from 'react';
import { NotificationItem } from '../types';
import { Bell, Check, Trash2, X, Sparkles, AlertCircle, Info } from 'lucide-react';

interface NotificationsModalProps {
  notifications: NotificationItem[];
  onMarkAllRead: () => void;
  onClearAll: () => void;
  onClose: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  notifications,
  onMarkAllRead,
  onClearAll,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md text-slate-100 shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Header */}
        <div className="p-4 bg-slate-800/80 border-b border-slate-700/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-emerald-400" />
            <h3 className="font-bold text-sm text-white">Smart Business Reminders</h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-700 hover:bg-slate-600 flex items-center justify-center text-xs font-bold"
          >
            ✕
          </button>
        </div>

        {/* Action Controls */}
        <div className="px-4 py-2 bg-slate-800/30 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <button onClick={onMarkAllRead} className="hover:text-emerald-400 flex items-center gap-1 transition">
            <Check className="w-3.5 h-3.5" /> Mark all read
          </button>
          <button onClick={onClearAll} className="hover:text-rose-400 flex items-center gap-1 transition">
            <Trash2 className="w-3.5 h-3.5" /> Clear all
          </button>
        </div>

        {/* List */}
        <div className="p-4 space-y-3 overflow-y-auto flex-1 custom-scrollbar">
          {notifications.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500">No new notifications or updates.</div>
          ) : (
            notifications.map((item) => (
              <div
                key={item.id}
                className={`p-3.5 rounded-2xl border text-xs transition ${
                  item.read ? 'bg-slate-800/30 border-slate-800/50 text-slate-400' : 'bg-slate-800/80 border-slate-700 text-slate-100 font-medium'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-emerald-400 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> {item.title}
                  </span>
                  <span className="text-[10px] text-slate-500">{item.timestamp}</span>
                </div>
                <p className="leading-relaxed">{item.message}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
