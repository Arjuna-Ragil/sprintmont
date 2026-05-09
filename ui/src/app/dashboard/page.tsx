"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, LayoutDashboard, Rocket, Settings, LogOut, ArrowRight, FolderPlus, X } from "lucide-react";
import { API_BASE_URL } from "@/lib/config";

type Project = {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  desc: string;
  active: boolean;
  banner_url: string;
  github: string;
  demo: string;
  pitch_deck: string;
};

type UserData = {
  ID: string;
  CreatedAt: string;
  UpdatedAt: string;
  username: string;
  email: string;
  profile_url: string;
};

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [projects, setProjects] = useState<Project[]>([]);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  // Welcome Modal State
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [welcomeForm, setWelcomeForm] = useState({ username: "", profile_url: "" });
  const [welcomeFile, setWelcomeFile] = useState<File | null>(null);
  const [isWelcomeSubmitting, setIsWelcomeSubmitting] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    desc: "",
    active: false,
    banner_url: "",
    github: "",
    demo: "",
    pitch_deck: "",
  });
  const [bannerFile, setBannerFile] = useState<File | null>(null);

  const fetchProjects = async () => {
    if (!session?.id_token) return;
    try {
      const projectRes = await fetch(`${API_BASE_URL}/protected/api/project`, {
        headers: {
          Authorization: `Bearer ${session.id_token}`,
        },
      });
      if (projectRes.ok) {
        const projectData = await projectRes.json();
        setProjects(projectData.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.id_token) return;
    
    setIsSubmitting(true);
    try {
      const payload = new FormData();
      payload.append("title", formData.title);
      payload.append("desc", formData.desc);
      payload.append("active", formData.active.toString());
      payload.append("github", formData.github);
      payload.append("demo", formData.demo);
      payload.append("pitch_deck", formData.pitch_deck);
      if (bannerFile) {
        payload.append("banner_image", bannerFile);
      }

      const res = await fetch(`${API_BASE_URL}/protected/api/project`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.id_token}`,
        },
        body: payload,
      });

      if (res.ok) {
        setIsModalOpen(false);
        setFormData({
          title: "",
          desc: "",
          active: false,
          banner_url: "",
          github: "",
          demo: "",
          pitch_deck: "",
        });
        setBannerFile(null);
        await fetchProjects();
      } else {
        console.error("Failed to create project");
      }
    } catch (error) {
      console.error("Error creating project:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWelcomeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.id_token) return;

    setIsWelcomeSubmitting(true);
    try {
      const payload = new FormData();
      payload.append("username", welcomeForm.username);
      if (welcomeFile) {
        payload.append("profile_picture", welcomeFile);
      }

      const res = await fetch(`${API_BASE_URL}/protected/api/me`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${session.id_token}`,
        },
        body: payload,
      });

      if (res.ok) {
        setShowWelcomeModal(false);
        // Refresh User Data
        const userRes = await fetch(`${API_BASE_URL}/protected/api/me`, {
          headers: { Authorization: `Bearer ${session.id_token}` },
        });
        if (userRes.ok) {
          const userDataRes = await userRes.json();
          setUserData(userDataRes.data);
        }
      } else {
        console.error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsWelcomeSubmitting(false);
    }
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  useEffect(() => {
    const fetchData = async () => {
      if (!session?.id_token) return;

      try {
        // Fetch User Data
        const userRes = await fetch(`${API_BASE_URL}/protected/api/me`, {
          headers: {
            Authorization: `Bearer ${session.id_token}`,
          },
        });
        
        if (userRes.ok) {
          const userDataRes = await userRes.json();
          setUserData(userDataRes.data);
          if (!userDataRes.data.username) {
            setShowWelcomeModal(true);
          }
        }

        // Fetch Projects
        const projectRes = await fetch(`${API_BASE_URL}/protected/api/project`, {
          headers: {
            Authorization: `Bearer ${session.id_token}`,
          },
        });

        if (projectRes.ok) {
          const projectData = await projectRes.json();
          setProjects(projectData.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (session?.id_token) {
      fetchData();
    }
  }, [session]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-stone-200 border-t-teal-500 rounded-full animate-spin"></div>
          <p className="text-stone-500 font-medium">Loading workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-900 flex flex-col">
      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto w-full max-w-6xl mx-auto mt-4 md:mt-8">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-stone-800 tracking-tight mb-2">
              Welcome back, <span className="text-teal-600">{userData?.username || "Builder"}</span>
            </h1>
            <p className="text-stone-500 font-medium text-lg">Ready to ship something today?</p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 mt-4 md:mt-0 w-full sm:w-auto">
            <Link href="/profile" className="bg-white hover:bg-stone-100 text-stone-700 px-6 py-3 rounded-full font-bold flex items-center gap-2 shadow-sm border border-stone-200 transition-colors w-full sm:w-auto justify-center">
              <Settings size={20} />
              Profile
            </Link>
            <button onClick={() => setIsModalOpen(true)} className="bg-stone-900 hover:bg-stone-800 text-white px-6 py-3 rounded-full font-bold flex items-center gap-2 transition-transform hover:scale-105 shadow-md shrink-0 w-full sm:w-auto justify-center">
              <Plus size={20} />
              New Project
            </button>
          </div>
        </header>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
            <p className="text-stone-500 font-medium mb-1">Total Projects</p>
            <h3 className="text-4xl font-black text-stone-800">{projects.length}</h3>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-teal-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
            <p className="text-stone-500 font-medium mb-1 relative z-10">Active Sprint</p>
            <h3 className="text-2xl font-bold text-stone-800 relative z-10 mt-2">Week 2: Code</h3>
            <div className="w-full bg-stone-100 rounded-full h-2 mt-4 relative z-10">
              <div className="bg-teal-500 h-2 rounded-full" style={{ width: '45%' }}></div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
            <p className="text-stone-500 font-medium mb-1">Days Streak</p>
            <div className="flex items-end gap-2">
              <h3 className="text-4xl font-black text-orange-500">14</h3>
              <span className="text-stone-500 font-medium mb-1 pb-0.5">days</span>
            </div>
          </div>
        </div>

        {/* Projects Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-stone-800">Your Projects</h2>
          </div>

          {projects.length === 0 ? (
            <div className="bg-white border-2 border-dashed border-stone-200 rounded-3xl p-12 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mb-6 text-stone-400">
                <FolderPlus size={32} />
              </div>
              <h3 className="text-2xl font-bold text-stone-800 mb-2">No projects yet</h3>
              <p className="text-stone-500 max-w-md mb-8">
                You haven't created any projects yet. Start your first sprint by creating a new project canvas.
              </p>
              <button onClick={() => setIsModalOpen(true)} className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-3.5 rounded-full font-bold shadow-[0_8px_0_0_#0f766e] hover:translate-y-1 hover:shadow-[0_4px_0_0_#0f766e] transition-all">
                Create First Project
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <Link href={`/projects/${project.id}`} key={project.id} className="group flex flex-col bg-white rounded-3xl border border-stone-200 overflow-hidden hover:shadow-lg hover:border-teal-200 transition-all duration-300">
                  <div className="h-32 bg-stone-100 relative overflow-hidden">
                    {project.banner_url ? (
                      <img src={project.banner_url} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full bg-linear-to-br from-stone-100 to-stone-200 group-hover:scale-105 transition-transform duration-500"></div>
                    )}
                    {project.active && (
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-teal-700 shadow-sm border border-teal-100 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse"></span>
                        Active
                      </div>
                    )}
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-xl font-bold text-stone-800 mb-2 group-hover:text-teal-600 transition-colors line-clamp-1">{project.title}</h3>
                    <p className="text-stone-500 text-sm line-clamp-2 mb-6 flex-1">{project.desc || "No description provided."}</p>
                    
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-stone-100">
                      <span className="text-xs font-medium text-stone-400">
                        {new Date(project.created_at).toLocaleDateString()}
                      </span>
                      <div className="w-8 h-8 rounded-full bg-stone-50 flex items-center justify-center text-stone-400 group-hover:bg-teal-50 group-hover:text-teal-600 transition-colors">
                        <ArrowRight size={16} />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Create Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-xl border border-stone-200 overflow-hidden my-8">
            <div className="flex justify-between items-center p-6 border-b border-stone-100">
              <h2 className="text-2xl font-bold text-stone-800">Create New Project</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-stone-600 transition-colors bg-stone-50 hover:bg-stone-100 p-2 rounded-full">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreateProject} className="p-6 md:p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-stone-700">Project Title <span className="text-red-500">*</span></label>
                <input 
                  required
                  type="text" 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all bg-stone-50 focus:bg-white text-stone-800"
                  placeholder="e.g. Acme Web App"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-stone-700">Description</label>
                <textarea 
                  value={formData.desc}
                  onChange={(e) => setFormData({...formData, desc: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all bg-stone-50 focus:bg-white text-stone-800 resize-none h-24"
                  placeholder="Briefly describe what you're building..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-stone-700">GitHub URL</label>
                  <input 
                    type="url" 
                    value={formData.github}
                    onChange={(e) => setFormData({...formData, github: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all bg-stone-50 focus:bg-white text-stone-800"
                    placeholder="https://github.com/..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-stone-700">Demo URL</label>
                  <input 
                    type="url" 
                    value={formData.demo}
                    onChange={(e) => setFormData({...formData, demo: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all bg-stone-50 focus:bg-white text-stone-800"
                    placeholder="https://your-demo.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-stone-700">Pitch Deck URL</label>
                  <input 
                    type="url" 
                    value={formData.pitch_deck}
                    onChange={(e) => setFormData({...formData, pitch_deck: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all bg-stone-50 focus:bg-white text-stone-800"
                    placeholder="https://pitch.com/..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-stone-700">Banner Image</label>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setBannerFile(e.target.files[0]);
                      }
                    }}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all bg-stone-50 focus:bg-white text-stone-800 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
                  />
                  {bannerFile && (
                    <p className="text-xs text-stone-500 mt-1">Selected: {bannerFile.name}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <div className="relative flex items-start">
                  <div className="flex items-center h-6">
                    <input
                      id="active"
                      type="checkbox"
                      checked={formData.active}
                      onChange={(e) => setFormData({...formData, active: e.target.checked})}
                      className="w-5 h-5 text-teal-600 border-stone-300 rounded focus:ring-teal-500/20 cursor-pointer"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="active" className="font-bold text-stone-700 cursor-pointer">Set as Active Sprint</label>
                    <p className="text-stone-500">Make this your primary focus for the current month.</p>
                  </div>
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
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Creating...
                    </>
                  ) : (
                    "Create Project"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Welcome Modal */}
      {showWelcomeModal && (
        <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-xl border border-stone-200 overflow-hidden my-8">
            <div className="bg-teal-500 p-8 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-full -mr-8 -mt-8"></div>
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                <Rocket size={32} className="text-white" />
              </div>
              <h2 className="text-3xl font-black text-white mb-2 relative z-10">Welcome to Sprintmont!</h2>
              <p className="text-teal-50 font-medium relative z-10">Let's get your profile set up so you can start building.</p>
            </div>
            <form onSubmit={handleWelcomeSubmit} className="p-6 md:p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-stone-700">Username <span className="text-red-500">*</span></label>
                <input 
                  required
                  type="text" 
                  value={welcomeForm.username}
                  onChange={(e) => setWelcomeForm({...welcomeForm, username: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all bg-stone-50 focus:bg-white text-stone-800"
                  placeholder="e.g. janesmith"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-stone-700">Profile Picture <span className="text-stone-400 font-normal">(Optional)</span></label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setWelcomeFile(e.target.files[0]);
                    }
                  }}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all bg-stone-50 focus:bg-white text-stone-800 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
                />
                {welcomeFile && (
                  <p className="text-xs text-stone-500 mt-1">Selected: {welcomeFile.name}</p>
                )}
              </div>

              <div className="pt-4 flex justify-end">
                <button 
                  type="submit" 
                  disabled={isWelcomeSubmitting || !welcomeForm.username}
                  className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-3 rounded-full font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 w-full justify-center"
                >
                  {isWelcomeSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Saving...
                    </>
                  ) : (
                    "Get Started"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
