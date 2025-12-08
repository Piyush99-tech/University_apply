export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <section className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Admin Dashboard
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Monitor applications, AI verification status, and pending reviews.
          </p>
        </div>
        <div className="flex gap-3">
          <div className="px-4 py-2 bg-slate-50 rounded-lg text-xs text-slate-600 flex items-center gap-2">
            <i className="fas fa-bolt text-yellow-500" />
            AI jobs: <span className="font-semibold">Coming soon</span>
          </div>
        </div>
      </section>
    </div>
  );
}
