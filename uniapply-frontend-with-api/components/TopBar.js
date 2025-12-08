"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function TopBar({ role = "student" }) {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const raw = window.localStorage.getItem("uniapply_user");
      if (raw) {
        try {
          setUser(JSON.parse(raw));
        } catch {
          setUser(null);
        }
      }
    }
  }, []);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("uniapply_token");
      window.localStorage.removeItem("uniapply_user");
    }
    router.push("/login");
  };

  return (
    <header className="h-14 border-b border-slate-200 bg-white flex items-center justify-between px-4">
      <div className="flex items-center gap-2 text-sm text-slate-600">
        <i className="fas fa-location-dot text-slate-400" />
        <span>{role === "admin" ? "Admin Panel" : "Student Portal"}</span>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm">
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
            <i className="fas fa-user text-slate-500 text-xs" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-900">
              {user?.name || "Guest"}
            </p>
            <p className="text-[11px] text-slate-500">
              {user?.role || (role === "admin" ? "ADMIN" : "STUDENT")}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center gap-1"
        >
          <i className="fas fa-arrow-right-from-bracket text-slate-500" />
          Logout
        </button>
      </div>
    </header>
  );
}
