import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  CheckCheck, 
  Briefcase, 
  Calendar, 
  MessageSquare, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  Trash2, 
  CheckCircle2,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { Link } from 'react-router-dom';
import professionalService from '../services/professionalService.js';

interface NotificationItem {
  id: string;
  category: 'APPLICATION' | 'INTERVIEW' | 'MESSAGE' | 'VERIFICATION' | 'SYSTEM';
  title: string;
  message: string;
  time: string;
  read: boolean;
  actionUrl: string;
  actionLabel: string;
}

export const ProfessionalNotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'ALL' | 'APPLICATION' | 'INTERVIEW' | 'MESSAGE'>('ALL');

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await professionalService.getNotifications();
      if (res.success && Array.isArray(res.data)) {
        const formatted: NotificationItem[] = res.data.map((n: any) => ({
          id: n.id,
          category: n.type === 'INTERVIEW' ? 'INTERVIEW' : n.type === 'MESSAGE' ? 'MESSAGE' : n.type === 'VERIFICATION' ? 'VERIFICATION' : 'APPLICATION',
          title: n.title || 'Notification Update',
          message: n.message || '',
          time: n.created_at ? new Date(n.created_at).toLocaleString() : 'Recently',
          read: !!n.is_read,
          actionUrl: n.link || '/professional/dashboard',
          actionLabel: n.link?.includes('interview') ? 'View Interview' : n.link?.includes('application') ? 'View Application' : 'View Details'
        }));
        setNotifications(formatted);
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAllAsRead = async () => {
    try {
      await professionalService.markAllNotificationsAsRead();
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.warn('Failed to mark all as read', err);
    }
  };

  const handleNotificationClick = async (item: NotificationItem) => {
    if (!item.read) {
      try {
        await professionalService.markNotificationAsRead(item.id);
        setNotifications(notifications.map(n => n.id === item.id ? { ...n, read: true } : n));
      } catch (err) {
        console.warn('Failed to mark notification as read', err);
      }
    }
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const filtered = notifications.filter(n => {
    if (activeTab === 'ALL') return true;
    return n.category === activeTab;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (category: string) => {
    switch (category) {
      case 'APPLICATION': return <Briefcase className="w-5 h-5 text-[#1B5F85]" />;
      case 'INTERVIEW': return <Calendar className="w-5 h-5 text-blue-600" />;
      case 'MESSAGE': return <MessageSquare className="w-5 h-5 text-purple-600" />;
      case 'VERIFICATION': return <ShieldCheck className="w-5 h-5 text-emerald-600" />;
      default: return <Sparkles className="w-5 h-5 text-amber-500" />;
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#1B5F85] via-[#154E70] to-[#0F394C] text-white p-5 sm:p-7 rounded-2xl sm:rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-teal-200 border border-white/20 flex items-center gap-1.5 backdrop-blur-sm">
              <Bell className="w-3.5 h-3.5 text-teal-300" /> Real-Time Healthcare Telemetry
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight flex items-center gap-2.5">
            <span>Notifications & Updates</span>
            {unreadCount > 0 && (
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-500 text-white font-extrabold shadow-sm">
                {unreadCount} New
              </span>
            )}
          </h1>
          <p className="text-xs sm:text-sm text-teal-100/90 mt-1 max-w-2xl leading-relaxed">
            Instant updates on clinical vacancy applications, upcoming hospital interviews, and verified recruiter direct inquiries.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-stretch md:self-auto">
          <button
            onClick={fetchNotifications}
            disabled={loading}
            className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl transition cursor-pointer"
            title="Refresh notifications"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 border border-white/20 transition flex items-center justify-center gap-1.5 cursor-pointer text-white"
            >
              <CheckCheck className="w-4 h-4 text-teal-300" /> Mark all read
            </button>
          )}
          <button
            onClick={clearAll}
            className="p-2 rounded-xl text-xs font-bold text-teal-200 hover:text-rose-200 hover:bg-rose-500/20 border border-white/10 transition cursor-pointer"
            title="Clear all"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3 text-xs font-bold">
        {[
          { key: 'ALL', label: 'All Alerts' },
          { key: 'APPLICATION', label: 'Applications' },
          { key: 'INTERVIEW', label: 'Interviews' },
          { key: 'MESSAGE', label: 'Messages' }
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key as any)}
            className={`px-4 py-2 rounded-xl transition cursor-pointer ${
              activeTab === t.key
                ? 'bg-[#1B5F85] text-white shadow-2xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3.5">
        {loading ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
            <Loader2 className="w-8 h-8 text-teal-600 animate-spin mx-auto mb-2" />
            <p className="text-xs text-slate-500 font-semibold">Loading notifications...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-teal-50 text-[#1B5F85] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-extrabold text-base text-slate-900">All caught up!</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You have no unread notifications in this category. We will alert you whenever a hospital updates your application status.
            </p>
          </div>
        ) : (
          filtered.map(item => (
            <div
              key={item.id}
              onClick={() => handleNotificationClick(item)}
              className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer ${
                item.read
                  ? 'bg-white border-slate-200/90 hover:border-slate-300'
                  : 'bg-teal-50/30 border-teal-200 shadow-2xs hover:border-[#1B5F85]/40'
              }`}
            >
              <div className="flex items-start gap-3.5 min-w-0">
                <div className="p-2.5 rounded-xl bg-white border border-slate-200 shrink-0 shadow-2xs">
                  {getIcon(item.category)}
                </div>
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-extrabold text-sm sm:text-base text-slate-900 truncate">{item.title}</h4>
                    {!item.read && (
                      <span className="w-2 h-2 rounded-full bg-[#1B5F85] shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">{item.message}</p>
                  <span className="text-[11px] text-slate-400 block pt-0.5">{item.time}</span>
                </div>
              </div>

              <div className="shrink-0 self-end sm:self-center">
                <Link
                  to={item.actionUrl}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-white hover:bg-slate-50 text-[#1B5F85] border border-slate-200 hover:border-[#1B5F85] transition flex items-center gap-1.5 shadow-2xs"
                >
                  <span>{item.actionLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#1B5F85]" />
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProfessionalNotificationsPage;
