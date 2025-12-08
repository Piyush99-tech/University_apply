"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/student", label: "Dashboard", icon: "fa-home" },
  { href: "/student/applications", label: "Applications", icon: "fa-file-alt" },
  { href: "/student/documents", label: "Documents", icon: "fa-folder" },
  { href: "/student/payments", label: "Payments", icon: "fa-credit-card" },
  { href: "/student/support", label: "Support", icon: "fa-headset" },
];

export default function StudentSidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-60 bg-white border-r border-slate-200 min-h-screen flex flex-col">
      <div className="px-4 py-4 border-b border-slate-200 flex items-center gap-2">
        <i className="fas fa-graduation-cap text-blue-600" />
        <span className="font-semibold text-slate-900 text-sm">UniApply Student</span>
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
                  ? "bg-blue-50 text-blue-700 font-semibold"
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
