import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Task } from '../../types';
import {
  CheckSquare,
  Plus,
  Search,
  Filter,
  Calendar as CalendarIcon,
  Clock,
  Trash2,
  RotateCcw,
  Tag,
  CheckCircle2,
  X,
  Edit,
  Sparkles,
} from 'lucide-react';

export const TasksView: React.FC = () => {
  const { currentUser, tasks, addTask, toggleTaskComplete, deleteTask, updateTask } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'completed'>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Form State
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formDueDate, setFormDueDate] = useState('');
  const [formDueTime, setFormDueTime] = useState('23:59');
  const [formPriority, setFormPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [formCategory, setFormCategory] = useState<'Study' | 'Teaching' | 'Business' | 'Personal' | 'Project'>('Study');

  const openCreateModal = () => {
    setEditingTask(null);
    setFormTitle('');
    setFormDescription('');
    setFormDueDate(new Date().toISOString().split('T')[0]);
    setFormDueTime('18:00');
    setFormPriority('medium');
    setFormCategory(currentUser.role === 'teacher' ? 'Teaching' : currentUser.role === 'entrepreneur' ? 'Business' : 'Study');
    setIsModalOpen(true);
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setFormTitle(task.title);
    setFormDescription(task.description || '');
    setFormDueDate(task.dueDate);
    setFormDueTime(task.dueTime || '23:59');
    setFormPriority(task.priority);
    setFormCategory(task.category);
    setIsModalOpen(true);
  };

  const handleSaveTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    if (editingTask) {
      updateTask(editingTask.id, {
        title: formTitle,
        description: formDescription,
        dueDate: formDueDate,
        dueTime: formDueTime,
        priority: formPriority,
        category: formCategory,
      });
    } else {
      addTask({
        userId: currentUser.id,
        title: formTitle,
        description: formDescription,
        dueDate: formDueDate || new Date().toISOString().split('T')[0],
        dueTime: formDueTime,
        priority: formPriority,
        category: formCategory,
      });
    }

    setIsModalOpen(false);
  };

  // Filter Tasks
  const userTasks = tasks.filter((t) => t.userId === currentUser.id);
  const filteredTasks = userTasks.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      filterStatus === 'all' ? true : filterStatus === 'pending' ? !t.isCompleted : t.isCompleted;

    const matchesCat = filterCategory === 'all' ? true : t.category === filterCategory;
    const matchesPrio = filterPriority === 'all' ? true : t.priority === filterPriority;

    return matchesSearch && matchesStatus && matchesCat && matchesPrio;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-slate-900 flex items-center gap-2">
            <CheckSquare className="w-6 h-6 text-pink-600" />
            Task Manager & Productivity
          </h1>
          <p className="text-xs text-slate-500">
            Organize study deadlines, teaching schedules, and business deliverables with editorial clarity.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white font-bold text-xs shadow-md hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Task</span>
        </button>
      </div>

      {/* Filters & Search Row */}
      <div className="p-4 rounded-3xl bg-white/95 border border-pink-200/60 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks..."
            className="w-full text-xs font-medium pl-9 pr-4 py-2 rounded-2xl bg-slate-50/80 border border-slate-200/80 focus:outline-none focus:border-pink-400 shadow-2xs"
          />
        </div>

        {/* Status Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-100/80 rounded-2xl text-xs font-semibold">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              filterStatus === 'all' ? 'bg-white text-pink-700 shadow-2xs font-serif font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All ({userTasks.length})
          </button>
          <button
            onClick={() => setFilterStatus('pending')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              filterStatus === 'pending' ? 'bg-white text-pink-700 shadow-2xs font-serif font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Pending ({userTasks.filter((t) => !t.isCompleted).length})
          </button>
          <button
            onClick={() => setFilterStatus('completed')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              filterStatus === 'completed' ? 'bg-white text-pink-700 shadow-2xs font-serif font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Completed ({userTasks.filter((t) => t.isCompleted).length})
          </button>
        </div>

        {/* Dropdown Filters */}
        <div className="flex items-center gap-2">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="text-xs font-semibold px-3 py-2 rounded-2xl bg-slate-50/80 border border-slate-200/80 focus:outline-none focus:border-pink-400 text-slate-700 shadow-2xs"
          >
            <option value="all">All Categories</option>
            <option value="Study">Study</option>
            <option value="Teaching">Teaching</option>
            <option value="Business">Business</option>
            <option value="Personal">Personal</option>
            <option value="Project">Project</option>
          </select>

          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="text-xs font-semibold px-3 py-2 rounded-2xl bg-slate-50/80 border border-slate-200/80 focus:outline-none focus:border-pink-400 text-slate-700 shadow-2xs"
          >
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
        </div>
      </div>

      {/* Task Cards List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12 rounded-3xl bg-white border border-pink-100 p-8 space-y-3">
            <CheckCircle2 className="w-12 h-12 text-pink-300 mx-auto" />
            <h3 className="font-bold text-slate-700">No tasks found</h3>
            <p className="text-xs text-slate-400">
              {searchQuery ? 'Try adjusting your search query or filters.' : 'Create your first task to get started!'}
            </p>
            <button
              onClick={openCreateModal}
              className="px-4 py-2 rounded-xl bg-pink-600 text-white font-bold text-xs shadow-xs hover:bg-pink-700 transition-all cursor-pointer"
            >
              Add Task
            </button>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className={`p-4 rounded-2xl border transition-all ${
                task.isCompleted
                  ? 'bg-slate-50/80 border-slate-200 opacity-75'
                  : 'bg-white border-pink-100/90 shadow-2xs hover:shadow-md'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <input
                    type="checkbox"
                    checked={task.isCompleted}
                    onChange={() => toggleTaskComplete(task.id)}
                    className="w-5 h-5 rounded-md accent-pink-600 mt-0.5 cursor-pointer"
                  />

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3
                        className={`font-bold text-sm text-slate-800 ${
                          task.isCompleted ? 'line-through text-slate-400' : ''
                        }`}
                      >
                        {task.title}
                      </h3>

                      {/* Category Badge */}
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-pink-50 text-pink-700 border border-pink-200">
                        {task.category}
                      </span>

                      {/* Priority Badge */}
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          task.priority === 'high'
                            ? 'bg-rose-100 text-rose-700 border border-rose-200'
                            : task.priority === 'medium'
                            ? 'bg-amber-100 text-amber-700 border border-amber-200'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}
                      >
                        {task.priority.toUpperCase()}
                      </span>
                    </div>

                    {task.description && (
                      <p className="text-xs text-slate-500 leading-relaxed">{task.description}</p>
                    )}

                    <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-1">
                      <span className="flex items-center gap-1 font-medium">
                        <CalendarIcon className="w-3.5 h-3.5 text-pink-500" /> Due {task.dueDate} {task.dueTime}
                      </span>
                      {task.isCompleted && task.completedAt && (
                        <span className="text-emerald-600 font-semibold">✓ Completed at {task.completedAt}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions: Undo, Edit, Delete */}
                <div className="flex items-center gap-1 shrink-0">
                  {task.isCompleted && (
                    <button
                      onClick={() => toggleTaskComplete(task.id)}
                      className="p-1.5 rounded-xl text-slate-500 hover:text-pink-600 hover:bg-pink-50 transition-all cursor-pointer"
                      title="Undo Complete"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => openEditModal(task)}
                    className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
                    title="Edit Task"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
                    title="Delete Task"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-pink-100 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-400 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-bold text-slate-800 mb-1">
              {editingTask ? 'Edit Task' : 'Create New Task'}
            </h2>
            <p className="text-xs text-slate-400 mb-4">Set clear objectives, priorities, and deadlines.</p>

            <form onSubmit={handleSaveTask} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Task Title *</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Prepare Quantum Mechanics Lecture Slides"
                  className="w-full font-medium px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description (Optional)</label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Additional context or notes..."
                  className="w-full font-medium px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Due Date *</label>
                  <input
                    type="date"
                    required
                    value={formDueDate}
                    onChange={(e) => setFormDueDate(e.target.value)}
                    className="w-full font-medium px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-pink-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Due Time</label>
                  <input
                    type="time"
                    value={formDueTime}
                    onChange={(e) => setFormDueTime(e.target.value)}
                    className="w-full font-medium px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-pink-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e: any) => setFormCategory(e.target.value)}
                    className="w-full font-medium px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-pink-500"
                  >
                    <option value="Study">Study</option>
                    <option value="Teaching">Teaching</option>
                    <option value="Business">Business</option>
                    <option value="Personal">Personal</option>
                    <option value="Project">Project</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Priority</label>
                  <select
                    value={formPriority}
                    onChange={(e: any) => setFormPriority(e.target.value)}
                    className="w-full font-medium px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-pink-500"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold shadow-xs hover:opacity-90 transition-all cursor-pointer"
                >
                  {editingTask ? 'Update Task' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
