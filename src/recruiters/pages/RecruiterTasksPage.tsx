import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckSquare,
  Clock,
  AlertTriangle,
  Plus,
  Filter,
  CheckCircle2,
  Calendar,
  User,
  Tag,
  ArrowUpRight,
  Trash2,
  Sparkles,
  Search,
  Bell,
  X
} from 'lucide-react';
import { IRecruiterTask } from '../types/index.js';

export const RecruiterTasksPage: React.FC = () => {
  const [tasks, setTasks] = useState<IRecruiterTask[]>([]);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [filterTab, setFilterTab] = useState<'ALL' | 'PENDING' | 'OVERDUE' | 'COMPLETED'>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<'ALL' | 'Candidate Follow-up' | 'Resume Review' | 'Interview Prep' | 'Feedback Alert'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);

  useEffect(() => {
    const fetchCandidates = async () => {
      const token = localStorage.getItem('meddhatri_token');
      const headers: HeadersInit = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      try {
        const res = await fetch('/api/v1/applications/org', { headers });
        if (res.ok) {
          const json = await res.json();
          const raw = Array.isArray(json.data) ? json.data : [];
          setCandidates(raw.map((a: any) => ({
            id: a.id || a._id,
            name: a.candidate?.user?.name || a.candidate?.name || 'Healthcare Applicant',
            role: a.candidate?.profession || 'Specialist',
            appliedJobTitle: a.job?.title || 'Clinical Vacancy'
          })));
        }
      } catch (e) {
        console.error('Error fetching candidates for tasks:', e);
      }
    };
    fetchCandidates();
  }, []);

  // New task form state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'Candidate Follow-up' | 'Resume Review' | 'Interview Prep' | 'Feedback Alert'>('Candidate Follow-up');
  const [newCandidateId, setNewCandidateId] = useState('');
  const [newDueDate, setNewDueDate] = useState('Today');
  const [newDueTime, setNewDueTime] = useState('04:00 PM');
  const [newPriority, setNewPriority] = useState<'Urgent' | 'High' | 'Normal'>('High');
  const [newNotes, setNewNotes] = useState('');

  const toggleTaskCompletion = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const cand = candidates.find((c) => c.id === newCandidateId);

    const taskObj: IRecruiterTask = {
      id: `task_${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      candidateId: cand?.id,
      candidateName: cand?.name,
      dueDate: newDueDate,
      dueTime: newDueTime,
      priority: newPriority,
      completed: false,
      isOverdue: false,
      notes: newNotes
    };

    setTasks([taskObj, ...tasks]);
    setNewTitle('');
    setNewNotes('');
    setIsNewTaskModalOpen(false);
  };

  const filteredTasks = tasks.filter((t) => {
    if (filterTab === 'PENDING' && t.completed) return false;
    if (filterTab === 'COMPLETED' && !t.completed) return false;
    if (filterTab === 'OVERDUE' && (!t.isOverdue || t.completed)) return false;

    if (categoryFilter !== 'ALL' && t.category !== categoryFilter) return false;

    if (
      searchQuery &&
      !t.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !t.candidateName?.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    return true;
  });

  const counts = {
    all: tasks.length,
    pending: tasks.filter((t) => !t.completed).length,
    overdue: tasks.filter((t) => t.isOverdue && !t.completed).length,
    completed: tasks.filter((t) => t.completed).length
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-800 via-teal-900 to-slate-900 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-200 text-xs font-semibold uppercase tracking-wider mb-2 border border-teal-400/20">
              <CheckSquare className="w-3.5 h-3.5" /> Recruiter Action Queue
            </div>
            <h1 className="text-2xl font-bold">Tasks, Reminders & Follow-ups</h1>
            <p className="text-teal-100 text-sm mt-1 max-w-2xl">
              Organize daily clinical candidate follow-ups, pending interviewer feedback reminders, resume review queues, and offer deadline alerts.
            </p>
          </div>
          <button
            onClick={() => setIsNewTaskModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-teal-800 hover:bg-teal-50 font-semibold text-sm rounded-xl transition shadow cursor-pointer whitespace-nowrap self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            Create Follow-up Task
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="text-xs font-medium text-slate-500">Total Open Tasks</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{counts.pending}</div>
          <div className="text-xs text-slate-400 mt-1">Across all assigned vacancies</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="text-xs font-medium text-slate-500">Overdue Follow-ups</div>
          <div className="text-2xl font-bold text-rose-600 mt-1 flex items-center gap-2">
            {counts.overdue}
            <AlertTriangle className="w-4 h-4 text-rose-500 animate-bounce" />
          </div>
          <div className="text-xs text-rose-500 mt-1">Requires immediate attention</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="text-xs font-medium text-slate-500">Completed This Week</div>
          <div className="text-2xl font-bold text-emerald-600 mt-1">{counts.completed}</div>
          <div className="text-xs text-emerald-600 mt-1">Productive momentum</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="text-xs font-medium text-slate-500">High / Urgent Priority</div>
          <div className="text-2xl font-bold text-amber-600 mt-1">
            {tasks.filter((t) => !t.completed && (t.priority === 'Urgent' || t.priority === 'High')).length}
          </div>
          <div className="text-xs text-slate-400 mt-1">High-impact tasks</div>
        </div>
      </div>

      {/* Control Bar: Filters & Search */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks by title or candidate name..."
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Tabs */}
          <div className="flex items-center bg-slate-100 rounded-lg p-1 text-xs">
            <button
              onClick={() => setFilterTab('ALL')}
              className={`px-3 py-1.5 rounded-md font-medium transition cursor-pointer ${
                filterTab === 'ALL' ? 'bg-white text-teal-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({counts.all})
            </button>
            <button
              onClick={() => setFilterTab('PENDING')}
              className={`px-3 py-1.5 rounded-md font-medium transition cursor-pointer ${
                filterTab === 'PENDING' ? 'bg-white text-teal-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Pending ({counts.pending})
            </button>
            <button
              onClick={() => setFilterTab('OVERDUE')}
              className={`px-3 py-1.5 rounded-md font-medium transition cursor-pointer ${
                filterTab === 'OVERDUE' ? 'bg-white text-rose-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Overdue ({counts.overdue})
            </button>
            <button
              onClick={() => setFilterTab('COMPLETED')}
              className={`px-3 py-1.5 rounded-md font-medium transition cursor-pointer ${
                filterTab === 'COMPLETED' ? 'bg-white text-emerald-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Completed ({counts.completed})
            </button>
          </div>

          {/* Category Dropdown */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as any)}
            className="text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
          >
            <option value="ALL">All Categories</option>
            <option value="Candidate Follow-up">Candidate Follow-up</option>
            <option value="Resume Review">Resume Review</option>
            <option value="Interview Prep">Interview Prep</option>
            <option value="Feedback Alert">Feedback Alert</option>
          </select>
        </div>
      </div>

      {/* Task List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs divide-y divide-slate-100 overflow-hidden">
        {filteredTasks.length === 0 ? (
          <div className="p-12 text-center">
            <CheckCircle2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-800">No tasks in this view</h3>
            <p className="text-xs text-slate-500 mt-1">You're all caught up with your recruitment queue!</p>
          </div>
        ) : (
          filteredTasks.map((t) => (
            <div
              key={t.id}
              className={`p-4 transition flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                t.completed ? 'bg-slate-50/60 opacity-75' : 'hover:bg-slate-50/50'
              }`}
            >
              {/* Checkbox & Task Info */}
              <div className="flex items-start gap-3.5 flex-1">
                <input
                  type="checkbox"
                  checked={t.completed}
                  onChange={() => toggleTaskCompletion(t.id)}
                  className="mt-1 w-4 h-4 rounded text-teal-600 focus:ring-teal-500 border-slate-300 cursor-pointer"
                />

                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`text-sm font-semibold ${
                        t.completed ? 'line-through text-slate-400' : 'text-slate-900'
                      }`}
                    >
                      {t.title}
                    </span>

                    {/* Priority Badge */}
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        t.priority === 'Urgent'
                          ? 'bg-rose-100 text-rose-800'
                          : t.priority === 'High'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {t.priority}
                    </span>

                    {/* Overdue tag */}
                    {t.isOverdue && !t.completed && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200">
                        OVERDUE
                      </span>
                    )}

                    {/* Category */}
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-teal-50 text-teal-700 border border-teal-200">
                      {t.category}
                    </span>
                  </div>

                  {/* Notes / Candidate link */}
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-1.5">
                    {t.candidateName && t.candidateId && (
                      <Link
                        to={`/recruiter/candidates/${t.candidateId}`}
                        className="inline-flex items-center gap-1 text-teal-700 font-medium hover:underline"
                      >
                        <User className="w-3.5 h-3.5" />
                        Candidate: {t.candidateName}
                      </Link>
                    )}

                    {t.notes && <span className="text-slate-600 italic">"{t.notes}"</span>}
                  </div>
                </div>
              </div>

              {/* Due Date & Actions */}
              <div className="flex items-center justify-between md:justify-end gap-4 shrink-0 pl-7 md:pl-0">
                <div className="text-right">
                  <div
                    className={`text-xs font-semibold flex items-center gap-1 ${
                      t.isOverdue && !t.completed ? 'text-rose-600 font-bold' : 'text-slate-700'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{t.dueDate}</span>
                    {t.dueTime && <span className="text-slate-400">({t.dueTime})</span>}
                  </div>
                </div>

                <button
                  onClick={() => deleteTask(t.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                  title="Delete task"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Task Modal */}
      {isNewTaskModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Create Follow-up Task</h3>
              <button
                onClick={() => setIsNewTaskModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Task Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Call candidate to confirm joining date"
                  className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2"
                  >
                    <option value="Candidate Follow-up">Candidate Follow-up</option>
                    <option value="Resume Review">Resume Review</option>
                    <option value="Interview Prep">Interview Prep</option>
                    <option value="Feedback Alert">Feedback Alert</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2"
                  >
                    <option value="Urgent">Urgent</option>
                    <option value="High">High</option>
                    <option value="Normal">Normal</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Link Candidate (Optional)</label>
                <select
                  value={newCandidateId}
                  onChange={(e) => setNewCandidateId(e.target.value)}
                  className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2"
                >
                  <option value="">-- None / General Task --</option>
                  {candidates.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.role} - {c.appliedJobTitle})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Due Date</label>
                  <input
                    type="text"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    placeholder="e.g. Today, Tomorrow, 26 Apr"
                    className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Due Time</label>
                  <input
                    type="text"
                    value={newDueTime}
                    onChange={(e) => setNewDueTime(e.target.value)}
                    placeholder="e.g. 05:00 PM"
                    className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Notes / Instructions</label>
                <textarea
                  rows={2}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Key context or phone extension..."
                  className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewTaskModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg shadow-xs"
                >
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecruiterTasksPage;
