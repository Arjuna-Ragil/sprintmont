"use client";

import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Plus, X, ListTodo, Circle, CheckCircle2, Clock } from "lucide-react";
import { API_BASE_URL } from "@/lib/config";

type Task = {
  id: string;
  title: string;
  desc: string;
  week: string;
  status: string;
  created_at: string;
};

export default function ProgressPage() {
  const { data: session } = useSession();
  const params = useParams();
  const projectId = params.projectid as string;

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    desc: "",
    week: "Week 1",
    status: "To Do",
  });

  const fetchTasks = async () => {
    if (!session?.id_token || !projectId) return;
    try {
      const res = await fetch(`${API_BASE_URL}/protected/api/project/${projectId}/tasks`, {
        headers: { Authorization: `Bearer ${session.id_token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setTasks(data.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [projectId, session]);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.id_token || !projectId) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/protected/api/project/${projectId}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.id_token}`,
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setIsModalOpen(false);
        setFormData({ title: "", desc: "", week: "Week 1", status: "To Do" });
        await fetchTasks();
      } else {
        console.error("Failed to create task");
      }
    } catch (error) {
      console.error("Error creating task:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Done":
        return <CheckCircle2 size={18} className="text-emerald-500" />;
      case "In Progress":
        return <Clock size={18} className="text-orange-500" />;
      default:
        return <Circle size={18} className="text-stone-300" />;
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center p-12">
        <div className="w-10 h-10 border-4 border-stone-200 border-t-teal-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-12 max-w-5xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-stone-800 tracking-tight">Tasks & Progress</h1>
          <p className="text-stone-500 font-medium mt-1">Track your sprint progress and milestones.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-teal-500 hover:bg-teal-600 text-white px-5 py-2.5 rounded-full font-bold flex items-center gap-2 shadow-sm transition-all hover:-translate-y-0.5"
        >
          <Plus size={18} />
          New Task
        </button>
      </div>

      {/* Task List */}
      {tasks.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-stone-200 rounded-3xl p-12 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mb-4 text-stone-400">
            <ListTodo size={28} />
          </div>
          <h3 className="text-xl font-bold text-stone-800 mb-2">No tasks yet</h3>
          <p className="text-stone-500 max-w-sm mb-6">
            Break down your project into actionable tasks to keep your sprint on track.
          </p>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 px-6 py-2.5 rounded-full font-bold shadow-sm transition-colors"
          >
            Create First Task
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {tasks.map((task) => (
            <div key={task.id} className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex flex-col sm:flex-row gap-4 sm:items-center hover:border-teal-200 transition-colors">
              <div className="shrink-0 pt-1 sm:pt-0">
                {getStatusIcon(task.status)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h4 className={`text-lg font-bold ${task.status === 'Done' ? 'text-stone-400 line-through' : 'text-stone-800'}`}>
                    {task.title}
                  </h4>
                  <span className="px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-600 text-xs font-bold border border-stone-200">
                    {task.week}
                  </span>
                </div>
                {task.desc && (
                  <p className="text-stone-500 text-sm">{task.desc}</p>
                )}
              </div>
              <div className="shrink-0 self-start sm:self-auto">
                <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
                  task.status === 'Done' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' :
                  task.status === 'In Progress' ? 'bg-orange-50 border-orange-200 text-orange-700' :
                  'bg-stone-50 border-stone-200 text-stone-600'
                }`}>
                  {task.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-xl shadow-xl border border-stone-200 overflow-hidden my-8">
            <div className="flex justify-between items-center p-6 border-b border-stone-100">
              <h2 className="text-2xl font-bold text-stone-800">Add New Task</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-stone-600 transition-colors bg-stone-50 hover:bg-stone-100 p-2 rounded-full">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreateTask} className="p-6 md:p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-stone-700">Task Title <span className="text-red-500">*</span></label>
                <input 
                  required
                  type="text" 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all bg-stone-50 focus:bg-white text-stone-800"
                  placeholder="e.g. Design Database Schema"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-stone-700">Description</label>
                <textarea 
                  value={formData.desc}
                  onChange={(e) => setFormData({...formData, desc: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all bg-stone-50 focus:bg-white text-stone-800 resize-none h-24"
                  placeholder="Additional details..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-stone-700">Sprint Week</label>
                  <select 
                    value={formData.week}
                    onChange={(e) => setFormData({...formData, week: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all bg-stone-50 focus:bg-white text-stone-800 appearance-none"
                  >
                    <option value="Week 1">Week 1</option>
                    <option value="Week 2">Week 2</option>
                    <option value="Week 3">Week 3</option>
                    <option value="Week 4">Week 4</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-stone-700">Status</label>
                  <select 
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all bg-stone-50 focus:bg-white text-stone-800 appearance-none"
                  >
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Done">Done</option>
                  </select>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-stone-100 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 rounded-full font-bold text-stone-600 hover:bg-stone-100 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-3 rounded-full font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSubmitting ? "Creating..." : "Create Task"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
