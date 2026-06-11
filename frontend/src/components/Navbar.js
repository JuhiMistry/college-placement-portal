"use client";

import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useNotifications } from "@/context/NotificationContext";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

export default function Navbar({ title }) {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const formatTime = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString([], { month: "short", day: "numeric" }) + " at " + d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <header className="relative z-20 flex h-16 items-center justify-between border-b border-slate-900 bg-slate-950/40 px-6 backdrop-blur-md sticky top-0">
      {/* Left section: Home Link & Title */}
      <div className="flex items-center gap-4">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 px-3.5 py-2 text-xs font-semibold text-slate-300 hover:text-slate-100 transition-all active:scale-[0.98] outline-none"
        >
          <svg className="h-4.5 w-4.5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11V9a2 2 0 00-2-2M9 21V12h6v9m-6 0h6" />
          </svg>
          <span>Home</span>
        </Link>
        <div className="h-4 w-px bg-slate-800" />
        <h2 className="text-lg font-semibold tracking-tight text-slate-100 capitalize">
          {title || "Overview"}
        </h2>
      </div>

      {/* Theme Toggle, Notifications & User Info */}
      <div className="flex items-center gap-4">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle dark/light theme"
          title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-slate-100 transition-all active:scale-[0.98] outline-none cursor-pointer"
        >
          {theme === "dark" ? (
            <svg className="h-4.5 w-4.5 text-amber-400 transition-all hover:scale-110 duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 9h-1m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707-.707M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          ) : (
            <svg className="h-4.5 w-4.5 text-indigo-400 transition-all hover:scale-110 duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>

        {/* Notifications Bell */}
        {user && (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-slate-100 transition-all active:scale-[0.98] outline-none cursor-pointer"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-3 w-80 rounded-2xl border border-slate-800 bg-slate-900/95 p-4 shadow-2xl backdrop-blur-xl z-50 flex flex-col overflow-hidden animate-fadeIn">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 mb-2.5">
                  <h3 className="text-xs font-bold text-slate-200">Recent Notifications</h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-[10px] font-semibold text-blue-400 hover:text-blue-300 cursor-pointer transition-all"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-64 overflow-y-auto divide-y divide-slate-800/60 scrollbar-thin">
                  {notifications.length === 0 ? (
                    <div className="py-8 text-center flex flex-col items-center justify-center">
                      <svg className="h-8 w-8 text-slate-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 01-2 2H6a2 2 0 01-2-2m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5" />
                      </svg>
                      <p className="text-xs font-semibold text-slate-400">All caught up!</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">No new notifications</p>
                    </div>
                  ) : (
                    notifications.map((item) => (
                      <div
                        key={item._id}
                        onClick={() => !item.read && markAsRead(item._id)}
                        className={`py-3 px-2 transition-all cursor-pointer rounded-lg flex gap-2.5 ${
                          !item.read ? "bg-blue-500/5 hover:bg-blue-500/10" : "hover:bg-slate-800/30"
                        }`}
                      >
                        <div className="pt-1.5 shrink-0">
                          <span className={`flex h-1.5 w-1.5 rounded-full ${!item.read ? "bg-blue-400" : "bg-slate-600"}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-2xs truncate ${!item.read ? "font-bold text-slate-200" : "font-medium text-slate-400"}`}>
                            {item.title}
                          </p>
                          <p className="text-[11px] text-slate-400 mt-0.5 leading-normal break-words">
                            {item.message}
                          </p>
                          <p className="text-[9px] text-slate-500 mt-1">
                            {formatTime(item.createdAt)}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* User Info */}
        {user && (
          <div className="flex items-center gap-3">
            <span className={`rounded-full px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${
              user.role === "admin"
                ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                : "bg-blue-500/10 text-blue-400 border-blue-500/20"
            }`}>
              {user.role}
            </span>
            <div className="hidden sm:block text-right">
              <p className="text-xs font-semibold text-slate-200 leading-tight">{user.name}</p>
              <p className="text-3xs text-slate-500 truncate max-w-[120px]">{user.email}</p>
            </div>
            <div className="h-8 w-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-300">
              {user.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
