"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, LogOut, User } from "lucide-react";

type UserData = {
  ID: string;
  CreatedAt: string;
  UpdatedAt: string;
  username: string;
  email: string;
  profile_url: string;
};

export default function Profile() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ username: "", profile_url: "" });
  const [editFile, setEditFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!session?.id_token) return;

      try {
        const userRes = await fetch(`/backend-api/protected/api/me`, {
          headers: {
            Authorization: `Bearer ${session.id_token}`,
          },
        });

        if (userRes.ok) {
          const userDataRes = await userRes.json();
          setUserData(userDataRes.data);
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (session?.id_token) {
      fetchUserData();
    }
  }, [session]);

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.id_token) return;

    setIsSubmitting(true);
    try {
      const payload = new FormData();
      payload.append("username", editForm.username);
      if (editFile) {
        payload.append("profile_picture", editFile);
      }

      const res = await fetch(`/backend-api/protected/api/me`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${session.id_token}`,
        },
        body: payload,
      });

      if (res.ok) {
        setIsEditing(false);
        // Refresh User Data
        const userRes = await fetch(`/backend-api/protected/api/me`, {
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
      setIsSubmitting(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-stone-200 border-t-teal-500 rounded-full animate-spin"></div>
          <p className="text-stone-500 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-900 flex flex-col items-center py-12 px-6">
      <div className="w-full max-w-2xl">
        <div className="mb-8">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-stone-500 hover:text-stone-800 font-bold transition-colors">
            <ArrowLeft size={20} />
            Back to Dashboard
          </Link>
        </div>

        <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
          <div className="h-32 bg-linear-to-r from-teal-500 to-teal-400"></div>

          <div className="px-8 pb-8 relative">
            <div className="absolute -top-16 left-8">
              {userData?.profile_url ? (
                <img
                  src={userData.profile_url}
                  alt={userData.username}
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md bg-white"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-stone-100 flex items-center justify-center border-4 border-white shadow-md">
                  <User size={48} className="text-stone-400" />
                </div>
              )}
            </div>

            <div className="pt-20">
              {isEditing ? (
                <form onSubmit={handleEditSubmit} className="space-y-4 mb-8">
                  <div>
                    <label className="block text-sm font-bold text-stone-700 mb-1">Username <span className="text-red-500">*</span></label>
                    <input
                      required
                      type="text"
                      value={editForm.username}
                      onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all bg-stone-50 focus:bg-white text-stone-800 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-stone-700 mb-1">Profile Picture</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setEditFile(e.target.files[0]);
                        }
                      }}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all bg-stone-50 focus:bg-white text-stone-800 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
                    />
                    {editFile && (
                      <p className="text-xs text-stone-500 mt-1">Selected: {editFile.name}</p>
                    )}
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-6 py-2.5 rounded-full font-bold text-stone-600 hover:bg-stone-100 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || !editForm.username}
                      className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-2.5 rounded-full font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2"
                    >
                      {isSubmitting ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                  <div>
                    <h1 className="text-3xl font-black text-stone-800 mb-1">
                      {userData?.username || "Builder"}
                    </h1>
                    <p className="text-stone-500 text-lg font-medium">
                      {userData?.email || "No email available"}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setEditForm({
                        username: userData?.username || "",
                        profile_url: userData?.profile_url || ""
                      });
                      setIsEditing(true);
                    }}
                    className="bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 px-5 py-2.5 rounded-full font-bold shadow-sm transition-colors text-sm"
                  >
                    Edit Profile
                  </button>
                </div>
              )}

              <div className="border-t border-stone-100 pt-8 mt-8">
                <h3 className="text-lg font-bold text-stone-800 mb-4">Account Settings</h3>

                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-stone-50 rounded-xl border border-stone-100 gap-4">
                    <div>
                      <p className="font-bold text-stone-800">Account Status</p>
                      <p className="text-sm text-stone-500">Connected via Authentik SSO</p>
                    </div>
                    <div className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-xs font-bold self-start sm:self-auto">
                      Active
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-12 flex justify-end">
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 px-6 py-3 rounded-xl font-bold transition-colors w-full sm:w-auto"
                >
                  <LogOut size={20} />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
