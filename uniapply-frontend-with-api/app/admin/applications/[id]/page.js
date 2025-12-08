"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  getAdminApplicationDetail,
  adminVerifyApplication,
  adminRaiseIssue,
  adminRejectApplication,
} from "@/lib/api";

export default function AdminApplicationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;

  const [application, setApplication] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState("");

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
        const data = await getAdminApplicationDetail(id);
        setApplication(data.application);
        setDocuments(data.documents || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load application");
      } finally {
        setLoading(false);
      }
    }
    if (id) load();
  }, [id, router]);

  const handleAction = async (type) => {
    if (!id) return;
    setActionLoading(type);
    try {
      if (type === "verify") await adminVerifyApplication(id);
      if (type === "issue") await adminRaiseIssue(id);
      if (type === "reject") await adminRejectApplication(id);
      const data = await getAdminApplicationDetail(id);
      setApplication(data.application);
      setDocuments(data.documents || []);
    } catch (err) {
      console.error(err);
      setError("Action failed");
    } finally {
      setActionLoading("");
    }
  };

  if (loading) {
    return <p className="text-sm text-slate-500">Loading application...</p>;
  }
  if (error) {
    return (
      <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2">
        {error}
      </p>
    );
  }
  if (!application) {
    return <p className="text-sm text-slate-500">Application not found.</p>;
  }

  // Compute AI info from documents
  const hasDocuments = documents.length > 0;
  const allVerified = hasDocuments && documents.every((d) => d.status === "VERIFIED");
  const hasIssues = hasDocuments && documents.some((d) => d.status === "ISSUE_RAISED");

  let computedStatus = "AI_PENDING";
  if (hasIssues) computedStatus = "AI_FLAGS_PRESENT";
  else if (allVerified) computedStatus = "AI_PASSED";
  else if (hasDocuments) computedStatus = "AI_IN_PROGRESS";

  const aiSummary = {
    overallStatus: computedStatus,
    color:
      computedStatus === "AI_FLAGS_PRESENT"
        ? "bg-yellow-100 text-yellow-700"
        : computedStatus === "AI_PASSED"
          ? "bg-green-100 text-green-700"
          : "bg-slate-100 text-slate-700",
    notes:
      computedStatus === "AI_FLAGS_PRESENT"
        ? "AI found potential issues with one or more documents. Please review."
        : computedStatus === "AI_PASSED"
          ? "All documents passed AI verification."
          : "AI verification pending or no documents uploaded.",
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-orange-600 uppercase tracking-wide">
            Admin Review
          </p>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">
            Application Review
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Application ID: <span className="font-mono">{application.id}</span>
          </p>
        </div>
        <div className="flex flex-col items-start md:items-end gap-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${aiSummary.color}`}
          >
            AI Status: {aiSummary.overallStatus}
          </span>
          <p className="text-xs text-slate-500 max-w-xs text-right">
            {aiSummary.notes}
          </p>
        </div>
      </div>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-semibold text-slate-900">
                Application Details
              </h2>
              <span className="text-xs text-slate-400">
                Basic info from backend application record
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-sm">
              <div>
                <p className="text-slate-500">Program</p>
                <p className="font-medium text-slate-900">
                  {application.program_name || "Program"}
                </p>
              </div>
              <div>
                <p className="text-slate-500">University</p>
                <p className="font-medium text-slate-900">
                  {application.university_short_name || "University"}
                </p>
              </div>
              <div>
                <p className="text-slate-500">Status</p>
                <p className="font-medium text-slate-900">
                  {application.status}
                </p>
              </div>
              <div>
                <p className="text-slate-500">AI Status</p>
                <p className="font-medium text-slate-900">
                  {application.ai_status || "AI_PENDING"}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
            <h2 className="text-sm font-semibold text-slate-900">
              Eligibility Rules (Program Level)
            </h2>
            <ul className="text-xs text-slate-600 list-disc list-inside space-y-1">
              <li>Minimum 75% in 12th or equivalent.</li>
              <li>GATE score above 650 in CS/IT.</li>
              <li>
                Valid government-issued photo ID (Aadhar, Passport, or
                Driver License).
              </li>
            </ul>
            <div className="mt-2 text-xs">
              <span className="font-semibold text-slate-700">
                AI verdict:
              </span>{" "}
              <span className="text-slate-700">
                {aiSummary.notes}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
            <h2 className="text-sm font-semibold text-slate-900">
              Documents
            </h2>
            <div className="space-y-3">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="border border-slate-200 rounded-lg p-3 text-xs space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="font-semibold text-slate-900">
                        {doc.doc_type}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {doc.original_name}
                      </p>
                    </div>
                    <span className="px-2 py-1 rounded-full bg-slate-100 text-slate-700 text-[10px] font-semibold">
                      {doc.status}
                    </span>
                  </div>
                  {doc.ai_result && (
                    <p className="text-[11px] text-orange-700 bg-orange-50 border border-orange-100 rounded-md p-2">
                      AI Flag: {JSON.stringify(doc.ai_result)}
                    </p>
                  )}
                </div>
              ))}
              {documents.length === 0 && (
                <p className="text-xs text-slate-500">
                  No documents uploaded yet.
                </p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
            <h2 className="text-sm font-semibold text-slate-900">
              Admin Actions
            </h2>
            <p className="text-xs text-slate-600">
              Choose an action after reviewing all documents and AI suggestions.
            </p>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => handleAction("verify")}
                disabled={actionLoading === "verify"}
                className="w-full px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 disabled:opacity-60"
              >
                {actionLoading === "verify"
                  ? "Marking as VERIFIED..."
                  : "Accept & Mark as VERIFIED"}
              </button>
              <button
                type="button"
                onClick={() => handleAction("issue")}
                disabled={actionLoading === "issue"}
                className="w-full px-4 py-2 rounded-lg bg-yellow-500 text-white text-sm font-medium hover:bg-yellow-600 disabled:opacity-60"
              >
                {actionLoading === "issue"
                  ? "Raising issue..."
                  : "Raise Issue & Request Clarification"}
              </button>
              <button
                type="button"
                onClick={() => handleAction("reject")}
                disabled={actionLoading === "reject"}
                className="w-full px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 disabled:opacity-60"
              >
                {actionLoading === "reject"
                  ? "Rejecting..."
                  : "Reject Application"}
              </button>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold text-slate-800">
                Comments to Student (coming soon)
              </p>
              <div className="border border-slate-200 rounded-lg p-2 bg-slate-50 text-[11px] text-slate-600">
                Example: "Your 10th marksheet appears to have a spelling
                difference in your name. Please upload a corrected/updated
                document or an affidavit."
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
