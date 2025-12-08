"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getAdminApplications } from "@/lib/api";

export default function AdminApplicationsPage() {
  const router = useRouter();
  const [apps, setApps] = useState([]);
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
        const data = await getAdminApplications();
        setApps(data.applications || []);
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Applications</h1>
          <p className="text-slate-500 text-sm">
            Manage and review all student applications.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 flex items-center gap-2">
            <i className="fas fa-filter" /> Filters
          </button>
          <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 flex items-center gap-2">
            <i className="fas fa-download" /> Export
          </button>
        </div>
      </div>

      {loading && <p className="text-sm text-slate-500">Loading...</p>}
      {error && (
        <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2">
          {error}
        </p>
      )}

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="px-4 py-3 w-10">
                <input type="checkbox" className="rounded" />
              </th>
              <th className="px-4 py-3">Application</th>
              <th className="px-4 py-3">Student</th>
              <th className="px-4 py-3">Program</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {apps.map((app) => (
              <tr
                key={app.id}
                className="border-t border-slate-100 hover:bg-slate-50"
              >
                <td className="px-4 py-4">
                  <input type="checkbox" className="rounded" />
                </td>
                <td className="px-4 py-4">
                  <p className="font-medium text-slate-900">{app.id}</p>
                  <p className="text-xs text-slate-500">
                    {app.created_at
                      ? new Date(app.created_at).toLocaleString()
                      : ""}
                  </p>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
                      <i className="fas fa-user text-slate-600 text-xs" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">
                        {app.student_name || "Student"}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <p className="text-sm text-slate-900">
                    {app.university_short_name || "University"}
                  </p>
                  <p className="text-xs text-slate-500">
                    {app.program_name || "Program"}
                  </p>
                </td>
                <td className="px-4 py-4">
                  <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium">
                    {app.status}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/applications/${app.id}`}
                      className="px-3 py-1 bg-orange-600 text-white rounded text-xs hover:bg-orange-700 flex items-center justify-center"
                    >
                      Review
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
            {!loading && apps.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-6 text-center text-sm text-slate-500"
                >
                  No applications found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
