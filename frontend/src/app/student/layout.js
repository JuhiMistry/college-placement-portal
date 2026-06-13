"use client";

import { useState } from "react";
import StudentGuard from "@/components/StudentGuard";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

export default function StudentLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <StudentGuard>
      <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans relative">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex flex-col min-w-0">
          <Navbar title="Student Panel" onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
          <main className="flex-1 py-4 sm:py-6 lg:py-8 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </StudentGuard>
  );
}

