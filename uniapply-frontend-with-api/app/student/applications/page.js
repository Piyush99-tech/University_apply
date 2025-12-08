"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getMyApplications } from "@/lib/api";

function statusBadge(status) {
  const base =
    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ";
  switch (status) {
    case "SUBMITTED":
      return base + "bg-blue-100 text-blue-700";
    case "VERIFIED":
      return base + "bg-green-100 text-green-700";
    case "ISSUE_RAISED":
      return base + "bg-yellow-100 text-yellow-700";
    case "REJECTED":
      return base + "bg-red-100 text-red-700";
    default:
      return base + "bg-slate-100 text-slate-700";
  }
}

export default function StudentApplicationsPage() {
  const router = useRouter();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token =
      typeof window !== "undefined"
        ? window.localStorage.getItem("uniapply_token")
        : null;

    if (!token) {
      router.push("/login");
      return;
    }

    async function load() {
      try {
        const data = await getMyApplications();
        setApplications(data.applications || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load applications");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [router]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-blue-600 uppercase tracking-wide">
            My IIT Applications
          </p>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">
            Applications Overview
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Track and manage all your IIT program applications in one place.
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/student/universities"
            className="inline-flex items-center px-4 py-2 rounded-lg bg-blue-600 text-sm font-medium text-white hover:bg-blue-700"
          >
            + New Application
          </Link>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2">
          {error}
        </p>
      )}

      {loading ? (
        <p className="text-sm text-slate-500">Loading applications...</p>
      ) : applications.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-300 rounded-xl p-6 text-center">
          <p className="text-sm text-slate-600">
            You have not started any applications yet.
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Click &quot;New Application&quot; to start applying to IIT
            programs.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {applications.map((app) => (
            <div
              key={app.id}
              className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between gap-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                    {app.university_short_name || "IIT"}
                  </p>
                  <h2 className="text-sm font-semibold text-slate-900 mt-1">
                    {app.program_name || "M.Tech - CSE"}
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Application ID:{" "}
                    <span className="font-mono text-[11px]">{app.id}</span>
                  </p>
                </div>
                <span className={statusBadge(app.status)}>{app.status}</span>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 mt-2">
                <span>
                  Last updated:{" "}
                  {app.updated_at
                    ? new Date(app.updated_at).toLocaleDateString()
                    : new Date(app.created_at).toLocaleDateString()}
                </span>
              </div>

              <div className="mt-3 flex justify-between items-center">
                <Link
                  href={`/student/applications/${app.id}`}
                  className="text-xs font-medium text-blue-600 hover:text-blue-700"
                >
                  {app.status === "DRAFT" ? "Continue Application" : "View"}
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
