"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin", label: "Dashboard", icon: "fa-chart-line" },
  { href: "/admin/applications", label: "Applications", icon: "fa-file-alt" },
  { href: "/admin/doc-config", label: "Doc Config", icon: "fa-cog" },
  { href: "/admin/tickets", label: "Tickets", icon: "fa-ticket-alt" },
  { href: "/admin/refunds", label: "Refunds", icon: "fa-undo" },
  { href: "/admin/settings", label: "Settings", icon: "fa-sliders-h" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-60 bg-white border-r border-slate-200 min-h-screen flex flex-col">
      <div className="px-4 py-4 border-b border-slate-200 flex items-center gap-2">
        <i className="fas fa-user-shield text-orange-500" />
        <span className="font-semibold text-slate-900 text-sm">UniApply Admin</span>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-1">
        {links.map((link) => {
          const active = pathname === link.href || pathname?.startsWith(link.href + "/");
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                active
                  ? "bg-orange-50 text-orange-700 font-semibold"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <i className={`fas ${link.icon} text-xs`} />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
