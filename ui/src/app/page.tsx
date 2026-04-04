"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Image from "next/image";

interface BackendUser {
  id: string;
  username: string;
  email: string;
}

export default function Home() {
  const { data: session, status } = useSession();
  const [backendUser, setBackendUser] = useState<BackendUser | null>(null);

  useEffect(() => {
    if (session?.id_token) {
      fetch("http://localhost:8080/protected/api/me", {
        headers: {
          "Authorization": `Bearer ${session.id_token}`
        }
      })
        .then(res => res.json())
        .then(data => {
          if (data?.data) {
            setBackendUser(data.data);
          }
        })
        .catch(console.error);
    }
  }, [session?.id_token]);

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans min-h-screen">
      <main className="flex w-full max-w-lg flex-col items-center justify-center py-16 px-10 bg-white shadow-xl rounded-2xl sm:items-center">
        
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 mb-2">
            SprintMont
          </h1>
          <p className="text-zinc-500">Collaborative Board & Dashboard</p>
        </div>

        {status === "loading" ? (
          <div className="animate-pulse flex flex-col items-center gap-4">
            <div className="h-4 w-32 bg-zinc-200 rounded"></div>
            <div className="h-10 w-full bg-zinc-200 rounded-full"></div>
          </div>
        ) : session ? (
          <div className="flex flex-col items-center gap-6 w-full text-center">
            <div className="flex flex-col items-center gap-2">
              <span className="text-lg font-medium text-zinc-800">
                Welcome, {backendUser?.username || session.user?.name || session.user?.email}
              </span>
              <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full font-semibold">
                Authenticated via SSO
              </span>
              {backendUser ? (
                <span className="text-xs text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full font-semibold mt-1">
                  Connected to Go Backend Database ✅
                </span>
              ) : (
                <span className="text-xs text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full font-semibold mt-1">
                  Connecting to Backend...
                </span>
              )}
            </div>
            
            <div className="flex flex-col gap-3 w-full">
              <button
                className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-indigo-600 px-5 text-white transition-colors hover:bg-indigo-700 font-medium shadow-md shadow-indigo-600/20"
                onClick={() => {
                   window.location.href = '/projects/new';
                }}
              >
                Go to Dashboard
              </button>
              
              <button
                className="flex h-12 w-full items-center justify-center rounded-full border border-zinc-200 px-5 text-zinc-600 transition-colors hover:bg-zinc-50 font-medium"
                onClick={() => signOut()}
              >
                Sign Out
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 w-full">
            <p className="text-sm text-zinc-600 mb-2 text-center">
              Please sign in to access your projects and collaborative canvas.
            </p>
            
            <button
              className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-black px-5 text-white transition-colors hover:bg-[#383838] font-medium"
              onClick={() => signIn("authentik")}
            >
              Sign In with Authentik SSO
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
