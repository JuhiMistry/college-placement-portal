"use client";

import AdminGuard from "@/components/AdminGuard";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

export default function AdminLayout({ children }) {
  return (
    <AdminGuard>
      <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Navbar title="Admin Panel" />
          <main className="flex-1 p-8 overflow-y-auto max-w-6xl w-full mx-auto">
            {children}
          </main>
        </div>
      </div>
    </AdminGuard>
  );
}
