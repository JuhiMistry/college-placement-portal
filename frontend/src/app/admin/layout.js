"use client";

import { useState } from "react";
import AdminGuard from "@/components/AdminGuard";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AdminGuard>
      <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans relative">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex flex-col min-w-0">
          <Navbar title="Admin Panel" onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
          <main className="flex-1 py-4 sm:py-6 lg:py-8 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </AdminGuard>
  );
}

