"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { apiService } from "@/lib/api";
import { useAuth } from "./AuthContext";

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = useCallback(async () => {
    if (!user) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }
    setLoading(true);
    try {
      const data = await apiService.notifications.getAll();
      setNotifications(data);
      const unread = data.filter((n) => !n.read).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Mark a single notification as read
  const markAsRead = async (id) => {
    try {
      await apiService.notifications.markRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  // Mark all unread notifications as read
  const markAllAsRead = async () => {
    const unreadList = notifications.filter((n) => !n.read);
    try {
      await Promise.all(unreadList.map((n) => apiService.notifications.markRead(n._id)));
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  };

  // Fetch notifications automatically when user changes (logins/logouts)
  useEffect(() => {
    fetchNotifications();
  }, [user, fetchNotifications]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
}
