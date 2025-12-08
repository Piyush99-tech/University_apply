import StudentSidebar from "@/components/StudentSidebar";
import TopBar from "@/components/TopBar";

export default function StudentLayout({ children }) {
  return (
    <div className="min-h-screen flex">
      <StudentSidebar />
      <div className="flex-1 flex flex-col">
        <TopBar role="student" />
        <main className="p-6 bg-slate-100 flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
