import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Bell,
  CheckCheck,
  Filter,
  Trash2,
  Calendar,
  FileCheck2,
  Users,
  MessageSquare,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Mail
} from 'lucide-react';
import { IRecruiterNotification } from '../types/index.js';

export const RecruiterNotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<IRecruiterNotification[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | 'APPLICATION' | 'STATUS_CHANGE' | 'INTERVIEW' | 'FEEDBACK' | 'TASK'>('ALL');
  const [emailAlertsEnabled, setEmailAlertsEnabled] = useState(true);
  const [whatsappAlertsEnabled, setWhatsappAlertsEnabled] = useState(false);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const filteredNotifs = notifications.filter((n) => {
    if (selectedCategory === 'ALL') return true;
    return n.category === selectedCategory;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-teal-800 via-teal-900 to-slate-900 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-200 text-xs font-semibold uppercase tracking-wider mb-2 border border-teal-400/20">
              <Bell className="w-3.5 h-3.5" /> Recruitment Activity Feed
            </div>
            <h1 className="text-2xl font-bold">Notifications & Alerts</h1>
            <p className="text-teal-100 text-sm mt-1 max-w-2xl">
              Real-time alerts for incoming clinical applications, interview confirmations, interviewer feedback submissions, and job assignment updates.
            </p>
          </div>
          <div className="flex items-center gap-2 self-start md:self-auto">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl transition cursor-pointer border border-white/20"
              >
                <CheckCheck className="w-4 h-4" /> Mark All as Read
              </button>
            )}
            <button
              onClick={clearAllNotifications}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 text-xs font-semibold rounded-xl transition cursor-pointer border border-rose-400/30"
            >
              <Trash2 className="w-4 h-4" /> Clear
            </button>
          </div>
        </div>
      </div>

      {/* Preferences Pill Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Mail className="w-4 h-4 text-teal-600" />
          <span className="text-xs font-semibold text-slate-700">Dispatch Channels:</span>
          <label className="inline-flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer">
            <input
              type="checkbox"
              checked={emailAlertsEnabled}
              onChange={(e) => setEmailAlertsEnabled(e.target.checked)}
              className="rounded text-teal-600 focus:ring-teal-500"
            />
            Email Digests
          </label>
          <label className="inline-flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer">
            <input
              type="checkbox"
              checked={whatsappAlertsEnabled}
              onChange={(e) => setWhatsappAlertsEnabled(e.target.checked)}
              className="rounded text-teal-600 focus:ring-teal-500"
            />
            WhatsApp Urgent Alerts
          </label>
        </div>

        {/* Category Filter */}
        <div className="flex items-center bg-slate-100 rounded-lg p-1 text-xs overflow-x-auto">
          {(['ALL', 'APPLICATION', 'INTERVIEW', 'FEEDBACK', 'TASK'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-md font-medium transition cursor-pointer whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-white text-teal-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {cat === 'ALL' ? 'All Alerts' : cat.charAt(0) + cat.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs divide-y divide-slate-100 overflow-hidden">
        {filteredNotifs.length === 0 ? (
          <div className="p-12 text-center">
            <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-800">No notifications in this filter</h3>
            <p className="text-xs text-slate-500 mt-1">You are up to date on all recruitment events.</p>
          </div>
        ) : (
          filteredNotifs.map((notif) => (
            <div
              key={notif.id}
              onClick={() => markAsRead(notif.id)}
              className={`p-4 transition flex items-start gap-3.5 cursor-pointer ${
                notif.read ? 'hover:bg-slate-50/50' : 'bg-teal-50/40 hover:bg-teal-50/70 border-l-4 border-l-teal-600'
              }`}
            >
              {/* Category Icon */}
              <div
                className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                  notif.category === 'APPLICATION'
                    ? 'bg-blue-100 text-blue-700'
                    : notif.category === 'INTERVIEW'
                    ? 'bg-amber-100 text-amber-700'
                    : notif.category === 'FEEDBACK'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-purple-100 text-purple-700'
                }`}
              >
                {notif.category === 'APPLICATION' && <Users className="w-4 h-4" />}
                {notif.category === 'INTERVIEW' && <Calendar className="w-4 h-4" />}
                {notif.category === 'FEEDBACK' && <MessageSquare className="w-4 h-4" />}
                {notif.category === 'TASK' && <AlertCircle className="w-4 h-4" />}
              </div>

              {/* Notification Content */}
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h4
                    className={`text-sm ${
                      notif.read ? 'font-medium text-slate-800' : 'font-bold text-slate-900'
                    }`}
                  >
                    {notif.title}
                  </h4>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1 shrink-0">
                    <Clock className="w-3 h-3" /> {notif.timestamp}
                  </span>
                </div>

                <p className="text-xs text-slate-600 mt-1">{notif.message}</p>

                {notif.link && (
                  <Link
                    to={notif.link}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-teal-700 hover:text-teal-900 mt-2 hover:underline"
                  >
                    <span>View Details</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecruiterNotificationsPage;
