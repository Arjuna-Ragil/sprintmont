"use client";

import { useSession } from "next-auth/react";
import { useParams, usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, LayoutTemplate, CheckSquare, Send, Info } from "lucide-react";

export default function ProjectLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();
  const projectId = params.projectid as string;

  const [projectName, setProjectName] = useState<string>("Loading...");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  useEffect(() => {
    const fetchProjectName = async () => {
      if (!session?.id_token || !projectId) return;
      try {
        const res = await fetch(`/backend-api/protected/api/project/${projectId}`, {
          headers: { Authorization: `Bearer ${session.id_token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setProjectName(data.data?.title || "Project Details");
        }
      } catch (e) {
        console.error(e);
        setProjectName("Project");
      }
    };
    fetchProjectName();
  }, [projectId, session]);

  if (status === "loading") {
    return <div className="min-h-screen bg-stone-50 flex items-center justify-center">Loading...</div>;
  }

  const links = [
    { href: `/projects/${projectId}`, label: "Overview", icon: Info },
    { href: `/projects/${projectId}/canvas`, label: "Canvas", icon: LayoutTemplate },
    { href: `/projects/${projectId}/progress`, label: "Tasks & Progress", icon: CheckSquare },
    { href: `/projects/${projectId}/submission`, label: "Submission", icon: Send },
  ];

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-900 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-stone-200 md:min-h-screen p-6 flex flex-col sticky top-0 shrink-0">
        <div className="mb-8">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-stone-500 hover:text-stone-800 font-bold transition-colors text-sm mb-6">
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>
          <h2 className="text-xl font-black text-stone-800 tracking-tight truncate" title={projectName}>
            {projectName}
          </h2>
        </div>

        <nav className="flex-1 space-y-2">
          {links.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-colors ${isActive
                  ? "bg-teal-50 text-teal-700"
                  : "text-stone-600 hover:bg-stone-100"
                  }`}
              >
                <Icon size={20} />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
