import AdminSidebar from "@/components/AdminSidebar";
import TopBar from "@/components/TopBar";

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen flex">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <TopBar role="admin" />
        <main className="p-6 bg-slate-100 flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
