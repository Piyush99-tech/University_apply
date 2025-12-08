"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  getApplicationDetail,
  uploadApplicationDocument,
  submitApplication,
} from "@/lib/api";

const DOC_CONFIG = [
  {
    key: "AADHAR",
    label: "Aadhar Card",
    required: true,
    helper: "Required for identity verification",
  },
  {
    key: "DL",
    label: "Driver License (Optional)",
    required: false,
    helper: "Optional secondary ID proof",
  },
  {
    key: "MARKSHEET_10",
    label: "10th Marksheet",
    required: true,
    helper: "Used to validate secondary education details",
  },
  {
    key: "MARKSHEET_12",
    label: "12th Marksheet",
    required: true,
    helper: "Used to validate higher secondary qualification",
  },
];

export default function StudentApplicationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id; // dynamic route param

  const [application, setApplication] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitMsg, setSubmitMsg] = useState("");

  useEffect(
    function () {
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
          const data = await getApplicationDetail(id);
          setApplication(data.application);
          setDocuments(data.documents || []);
        } catch (err) {
          console.error(err);
          setError("Failed to load application");
        } finally {
          setLoading(false);
        }
      }

      if (id) {
        load();
      }
    },
    [id, router]
  );

  async function reload() {
    try {
      const data = await getApplicationDetail(id);
      setApplication(data.application);
      setDocuments(data.documents || []);
    } catch (err) {
      console.error(err);
      setError("Failed to refresh application");
    }
  }

  async function handleFileChange(docType, e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setError("");
    setSubmitMsg("");
    setUploading(function (prev) {
      return { ...prev, [docType]: true };
    });
    try {
      await uploadApplicationDocument(id, file, docType);
      await reload();
    } catch (err) {
      console.error(err);
      setError("Upload failed");
    } finally {
      setUploading(function (prev) {
        return { ...prev, [docType]: false };
      });
    }
  }

  async function handleSubmitApplication() {
    setError("");
    setSubmitMsg("");
    setSubmitting(true);
    try {
      const res = await submitApplication(id);
      setApplication(res.application);
      setSubmitMsg("Application submitted for verification.");
    } catch (err) {
      console.error(err);
      setError("Failed to submit application");
    } finally {
      setSubmitting(false);
    }
  }

  function statusBadge(status) {
    const base = "px-3 py-1 rounded-full text-xs font-semibold ";
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

  function docStatusInfo(docType) {
    const doc = documents.find(function (d) {
      return d.doc_type === docType;
    });
    if (!doc) {
      return {
        label: "Not Uploaded",
        className: "bg-slate-100 text-slate-600",
      };
    }
    switch (doc.status) {
      case "PROCESSING":
        return {
          label: "Processing (AI Check)",
          className: "bg-yellow-100 text-yellow-700",
        };
      case "VERIFIED":
        return {
          label: "Verified",
          className: "bg-green-100 text-green-700",
        };
      case "ISSUE_RAISED":
        return {
          label: "Issue Raised",
          className: "bg-orange-100 text-orange-700",
        };
      case "REJECTED":
        return {
          label: "Rejected",
          className: "bg-red-100 text-red-700",
        };
      default:
        return {
          label: "Uploaded",
          className: "bg-green-100 text-green-700",
        };
    }
  }

  if (loading) {
    return <p className="text-sm text-slate-500">Loading application...</p>;
  }

  if (!application) {
    return <p className="text-sm text-slate-500">Application not found.</p>;
  }

  const isAlreadySubmittedOrBeyond =
    application.status === "SUBMITTED" ||
    application.status === "VERIFIED" ||
    application.status === "ISSUE_RAISED" ||
    application.status === "REJECTED";

  return (
    <div className="space-y-6">
      {/* non-blocking error */}
      {error && (
        <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2">
          {error}
        </p>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-blue-600 uppercase tracking-wide">
            IIT Application
          </p>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">
            Application Overview
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Application ID: <span className="font-mono">{application.id}</span>
          </p>
        </div>
        <div className="flex flex-col items-start md:items-end gap-2">
          <span className={statusBadge(application.status)}>
            {application.status}
          </span>
          <p className="text-xs text-slate-500 max-w-xs text-right">
            AI status: {application.ai_status || "AI_PENDING"}
          </p>
        </div>
      </div>

      {/* Application summary */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5 lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-semibold text-slate-900">
              Application Details
            </h2>
            <span className="text-xs text-slate-400">
              Some fields are from backend form_data (JSON)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-sm">
            <div>
              <p className="text-slate-500">Program</p>
              <p className="font-medium text-slate-900">
                {application.program_name ||
                  "M.Tech - Computer Science & Engineering"}
              </p>
            </div>
            <div>
              <p className="text-slate-500">University</p>
              <p className="font-medium text-slate-900">
                {application.university_short_name || "IIT Delhi"}
              </p>
            </div>
            <div>
              <p className="text-slate-500">Student Name</p>
              <p className="font-medium text-slate-900">
                {application.form_data?.fullName || "Rahul Sharma"}
              </p>
            </div>
            <div>
              <p className="text-slate-500">Email</p>
              <p className="font-medium text-slate-900">
                {application.form_data?.email || "rahul.sharma@example.com"}
              </p>
            </div>
            <div>
              <p className="text-slate-500">Category</p>
              <p className="font-medium text-slate-900">
                {application.form_data?.category || "General"}
              </p>
            </div>
            <div>
              <p className="text-slate-500">GATE Score</p>
              <p className="font-medium text-slate-900">
                {application.form_data?.gateScore || "712 (CS)"}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col gap-3">
          <h2 className="text-sm font-semibold text-slate-900">
            IIT Specific Requirements
          </h2>
          <div className="space-y-2 text-xs text-slate-600">
            <p>✔ Minimum 75% in 12th (or equivalent)</p>
            <p>✔ Valid GATE scorecard for CS/IT</p>
            <p>✔ Government-issued photo ID</p>
          </div>
          <div className="mt-2 rounded-lg bg-blue-50 border border-blue-100 p-3">
            <p className="text-xs text-blue-700">
              Once all required documents are uploaded and submitted, IIT will
              review your application for final shortlisting.
            </p>
          </div>
        </div>
      </section>

      {/* Document upload wizard */}
      <section className="bg-white rounded-xl border border-slate-200">
        <div className="p-5 border-b border-slate-200 flex justify-between items-center">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              Document Upload Wizard
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Upload all mandatory documents for IIT M.Tech - CSE application.
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500">Uploaded documents</p>
            <p className="text-sm font-semibold text-slate-900">
              {documents.length} / {DOC_CONFIG.length}
            </p>
          </div>
        </div>

        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          {DOC_CONFIG.map(function (doc) {
            const statusInfo = docStatusInfo(doc.key);
            return (
              <div
                key={doc.key}
                className="border border-slate-200 rounded-lg p-4 flex flex-col gap-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {doc.label}
                      {doc.required && (
                        <span className="ml-2 text-[10px] uppercase tracking-wide text-red-500">
                          Required
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {doc.helper}
                    </p>
                  </div>
                  <span
                    className={
                      "px-2 py-1 rounded-full text-[10px] font-semibold " +
                      statusInfo.className
                    }
                  >
                    {statusInfo.label}
                  </span>
                </div>

                <div className="border border-dashed border-slate-300 rounded-lg p-3 text-xs text-slate-500 bg-slate-50">
                  <p className="font-medium text-slate-700 mb-1">
                    Drag &amp; drop file here
                  </p>
                  <p>Supported formats: PDF, JPG, PNG (max 5MB)</p>
                </div>

                <div className="flex items-center justify-between gap-3 text-xs">
                  <label className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer">
                    {uploading[doc.key] ? "Uploading..." : "Choose File"}
                    <input
                      type="file"
                      className="hidden"
                      onChange={function (e) {
                        handleFileChange(doc.key, e);
                      }}
                      accept=".pdf,.jpg,.jpeg,.png"
                      disabled={isAlreadySubmittedOrBeyond}
                    />
                  </label>
                  <p className="text-[11px] text-slate-400 text-right">
                    Files are sent securely to the backend for AI verification.
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="px-5 pb-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3 border-t border-slate-100 pt-4">
          <div className="space-y-1">
            <p className="text-xs text-slate-500 max-w-md">
              By submitting, you confirm that all details and documents are
              accurate. False information may lead to rejection.
            </p>
            {submitMsg && (
              <p className="text-xs text-green-600 bg-green-50 border border-green-100 rounded-md px-3 py-2">
                {submitMsg}
              </p>
            )}
            {error && (
              <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2">
                {error}
              </p>
            )}
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              className="px-4 py-2 rounded-lg border border-slate-200 text-sm text-slate-700 hover:bg-slate-50"
            >
              Save as Draft
            </button>
            <button
              type="button"
              onClick={handleSubmitApplication}
              disabled={submitting || isAlreadySubmittedOrBeyond}
              className="px-4 py-2 rounded-lg bg-blue-600 text-sm text-white font-medium hover:bg-blue-700 disabled:opacity-60"
            >
              {submitting
                ? "Submitting..."
                : isAlreadySubmittedOrBeyond
                ? "Already Submitted"
                : "Submit for Verification"}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
