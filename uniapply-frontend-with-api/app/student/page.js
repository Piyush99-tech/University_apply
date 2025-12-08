import Link from "next/link";

export default function StudentDashboardPage() {
  return (
    <div className="space-y-6">
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome back! 👋</h1>
        <p className="text-blue-100 mb-4">
          Track your applications and manage your documents all in one place.
        </p>
        <Link
          href="/student/universities"
          className="inline-flex bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 items-center gap-2 text-sm"
        >
          <i className="fas fa-plus" /> New Application
        </Link>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Applications", value: "4", icon: "fa-file-alt" },
          { label: "Under Review", value: "2", icon: "fa-clock" },
          { label: "Documents Pending", value: "1", icon: "fa-exclamation-circle" },
          { label: "Approved", value: "1", icon: "fa-check-circle" },
        ].map((card) => (
          <div
            key={card.label}
            className="bg-white rounded-xl p-5 border border-slate-200"
          >
            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center mb-3">
              <i className={`fas ${card.icon} text-slate-600`} />
            </div>
            <p className="text-2xl font-bold text-slate-900">{card.value}</p>
            <p className="text-sm text-slate-500">{card.label}</p>
          </div>
        ))}
      </section>

      <section className="bg-white rounded-xl border border-slate-200">
        <div className="p-5 border-b border-slate-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-slate-900">
            Recent Applications
          </h2>
          <Link
            href="/student/applications"
            className="text-blue-600 text-sm font-medium hover:text-blue-700"
          >
            View All →
          </Link>
        </div>
        <div className="p-5 text-sm text-slate-500">
          This section will show your latest applications fetched from the backend.
        </div>
      </section>
    </div>
  );
}
