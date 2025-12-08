import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg border border-slate-200 p-10 flex flex-col md:flex-row gap-8">
        <div className="flex-1 space-y-4">
          <h1 className="text-3xl font-bold text-slate-900">
            UniApply – Unified University Application Portal
          </h1>
          <p className="text-sm text-slate-600">
            Apply to multiple universities with one portal. Students upload documents,
            AI verifies them, and admins review applications in a two-level process.
          </p>
          <div className="flex flex-wrap gap-3 mt-4">
            <Link
              href="/login"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2"
            >
              <i className="fas fa-right-to-bracket" />
              Sign in
            </Link>
          </div>
        </div>
        <div className="w-full md:w-64 bg-slate-50 border border-dashed border-slate-300 rounded-xl p-4 text-xs text-slate-600 space-y-2">
          <p className="font-semibold text-slate-900">Demo roles</p>
          <ul className="list-disc list-inside space-y-1">
            <li>
              <span className="font-mono">student@example.com</span> /{" "}
              <span className="font-mono">password123</span>
            </li>
            <li>
              <span className="font-mono">admin@example.com</span> /{" "}
              <span className="font-mono">password123</span>
            </li>
          </ul>
          <p className="text-[11px] text-slate-500">
            Use backend <code>/api/auth/register</code> to create these users first.
          </p>
        </div>
      </div>
    </main>
  );
}
