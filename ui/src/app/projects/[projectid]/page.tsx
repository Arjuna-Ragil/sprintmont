"use client";

import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ExternalLink, Code, MonitorPlay, Presentation, Pencil, X } from "lucide-react";

type ProjectData = {
  id: string;
  title: string;
  desc: string;
  active: boolean;
  banner_url: string;
  github: string;
  demo: string;
  pitch_deck: string;
  created_at: string;
};

export default function ProjectDetailsPage() {
  const { data: session } = useSession();
  const params = useParams();
  const projectId = params.projectid as string;

  const [project, setProject] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "", desc: "", active: false, github: "", demo: "", pitch_deck: "", banner_url: ""
  });
  const [bannerFile, setBannerFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      if (!session?.id_token || !projectId) return;
      try {
        const res = await fetch(`/backend-api/protected/api/project/${projectId}`, {
          headers: { Authorization: `Bearer ${session.id_token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setProject(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch project details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId, session]);

  const handleEditOpen = () => {
    if (project) {
      setFormData({
        title: project.title,
        desc: project.desc,
        active: project.active,
        github: project.github,
        demo: project.demo,
        pitch_deck: project.pitch_deck,
        banner_url: project.banner_url,
      });
      setBannerFile(null);
      setIsEditModalOpen(true);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.id_token || !projectId) return;

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

      const res = await fetch(`/backend-api/protected/api/project/${projectId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${session.id_token}`,
        },
        body: payload,
      });

      if (res.ok) {
        const data = await res.json();
        setProject(data.data);
        setIsEditModalOpen(false);
      } else {
        console.error("Failed to update project");
      }
    } catch (error) {
      console.error("Error updating project:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center p-12">
        <div className="w-10 h-10 border-4 border-stone-200 border-t-teal-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="p-12 text-center">
        <h2 className="text-2xl font-bold text-stone-800">Project Not Found</h2>
        <p className="text-stone-500 mt-2">The project you're looking for does not exist or you don't have access.</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-12 max-w-5xl mx-auto w-full">
      {/* Banner */}
      <div className="w-full h-48 md:h-64 bg-stone-100 rounded-3xl overflow-hidden relative mb-8 border border-stone-200 shadow-sm">
        {project.banner_url ? (
          <img src={project.banner_url} alt={project.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-linear-to-br from-teal-500 to-emerald-400"></div>
        )}
        {project.active && (
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-bold text-teal-700 shadow-md border border-teal-100 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
            Active Sprint
          </div>
        )}
      </div>

      {/* Title & Desc */}
      <div className="mb-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
          <h1 className="text-4xl md:text-5xl font-black text-stone-800 tracking-tight">{project.title}</h1>
          <button
            onClick={handleEditOpen}
            className="bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 px-5 py-2.5 rounded-full font-bold shadow-sm transition-colors text-sm flex items-center gap-2"
          >
            <Pencil size={16} /> Edit Project
          </button>
        </div>
        <p className="text-lg text-stone-600 max-w-3xl leading-relaxed whitespace-pre-wrap">
          {project.desc || "No description provided for this project."}
        </p>
        <p className="text-sm font-medium text-stone-400 mt-6">
          Created on {new Date(project.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Links Grid */}
      <h3 className="text-xl font-bold text-stone-800 mb-6">Important Links</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* GitHub */}
        <div className={`p-6 rounded-2xl border ${project.github ? 'bg-white border-stone-200 hover:border-teal-300 hover:shadow-md transition-all' : 'bg-stone-50 border-stone-100 opacity-60'}`}>
          <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center text-stone-700 mb-4">
            <Code size={24} />
          </div>
          <h4 className="text-lg font-bold text-stone-800 mb-1">GitHub Repository</h4>
          {project.github ? (
            <a href={project.github} target="_blank" rel="noopener noreferrer" className="text-teal-600 font-bold hover:underline flex items-center gap-1 mt-2 text-sm">
              View Source <ExternalLink size={14} />
            </a>
          ) : (
            <p className="text-sm text-stone-400 mt-2">Not provided</p>
          )}
        </div>

        {/* Demo */}
        <div className={`p-6 rounded-2xl border ${project.demo ? 'bg-white border-stone-200 hover:border-teal-300 hover:shadow-md transition-all' : 'bg-stone-50 border-stone-100 opacity-60'}`}>
          <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center text-blue-600 mb-4">
            <MonitorPlay size={24} />
          </div>
          <h4 className="text-lg font-bold text-stone-800 mb-1">Live Demo</h4>
          {project.demo ? (
            <a href={project.demo} target="_blank" rel="noopener noreferrer" className="text-blue-600 font-bold hover:underline flex items-center gap-1 mt-2 text-sm">
              Visit App <ExternalLink size={14} />
            </a>
          ) : (
            <p className="text-sm text-stone-400 mt-2">Not provided</p>
          )}
        </div>

        {/* Pitch Deck */}
        <div className={`p-6 rounded-2xl border ${project.pitch_deck ? 'bg-white border-stone-200 hover:border-teal-300 hover:shadow-md transition-all' : 'bg-stone-50 border-stone-100 opacity-60'}`}>
          <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center text-orange-600 mb-4">
            <Presentation size={24} />
          </div>
          <h4 className="text-lg font-bold text-stone-800 mb-1">Pitch Deck</h4>
          {project.pitch_deck ? (
            <a href={project.pitch_deck} target="_blank" rel="noopener noreferrer" className="text-orange-600 font-bold hover:underline flex items-center gap-1 mt-2 text-sm">
              View Slides <ExternalLink size={14} />
            </a>
          ) : (
            <p className="text-sm text-stone-400 mt-2">Not provided</p>
          )}
        </div>
      </div>

      {/* Edit Project Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-xl border border-stone-200 overflow-hidden my-8">
            <div className="flex justify-between items-center p-6 border-b border-stone-100">
              <h2 className="text-2xl font-bold text-stone-800">Edit Project</h2>
              <button onClick={() => setIsEditModalOpen(false)} className="text-stone-400 hover:text-stone-600 transition-colors bg-stone-50 hover:bg-stone-100 p-2 rounded-full">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="p-6 md:p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-stone-700">Project Title <span className="text-red-500">*</span></label>
                <input
                  required
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all bg-stone-50 focus:bg-white text-stone-800"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-stone-700">Description</label>
                <textarea
                  value={formData.desc}
                  onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all bg-stone-50 focus:bg-white text-stone-800 resize-none h-24"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-stone-700">GitHub URL</label>
                  <input
                    type="url"
                    value={formData.github}
                    onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all bg-stone-50 focus:bg-white text-stone-800"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-stone-700">Demo URL</label>
                  <input
                    type="url"
                    value={formData.demo}
                    onChange={(e) => setFormData({ ...formData, demo: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all bg-stone-50 focus:bg-white text-stone-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-stone-700">Pitch Deck URL</label>
                  <input
                    type="url"
                    value={formData.pitch_deck}
                    onChange={(e) => setFormData({ ...formData, pitch_deck: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all bg-stone-50 focus:bg-white text-stone-800"
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
                      id="active-edit"
                      type="checkbox"
                      checked={formData.active}
                      onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                      className="w-5 h-5 text-teal-600 border-stone-300 rounded focus:ring-teal-500/20 cursor-pointer"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="active-edit" className="font-bold text-stone-700 cursor-pointer">Set as Active Sprint</label>
                    <p className="text-stone-500">Make this your primary focus for the current month.</p>
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-stone-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-6 py-3 rounded-full font-bold text-stone-600 hover:bg-stone-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-3 rounded-full font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
