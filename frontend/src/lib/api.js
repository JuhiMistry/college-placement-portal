import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to inject JWT token automatically on every request
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const apiService = {
  // Auth
  auth: {
    login: async (email, password) => {
      const response = await api.post("/auth/login", { email, password });
      return response.data;
    },
    register: async (payload) => {
      const response = await api.post("/auth/register", payload);
      return response.data;
    },
  },

  // Student Profile & Resume
  profile: {
    get: async () => {
      const response = await api.get("/profile");
      return response.data;
    },
    update: async (payload) => {
      const response = await api.put("/profile", payload);
      return response.data;
    },
  },
  
  resume: {
    upload: async (file) => {
      const formData = new FormData();
      formData.append("resume", file);
      
      const response = await api.post("/resume/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
  },

  // Companies (Admin CRUD & Student View)
  companies: {
    getAll: async () => {
      const response = await api.get("/company");
      return response.data;
    },
    create: async (payload) => {
      const response = await api.post("/company", payload);
      return response.data;
    },
    update: async (id, payload) => {
      const response = await api.put(`/company/${id}`, payload);
      return response.data;
    },
    delete: async (id) => {
      const response = await api.delete(`/company/${id}`);
      return response.data;
    },
  },

  // Jobs (Admin CRUD & Student View)
  jobs: {
    getAll: async () => {
      const response = await api.get("/job");
      return response.data;
    },
    create: async (payload) => {
      const response = await api.post("/job", payload);
      return response.data;
    },
    update: async (id, payload) => {
      const response = await api.put(`/job/${id}`, payload);
      return response.data;
    },
    delete: async (id) => {
      const response = await api.delete(`/job/${id}`);
      return response.data;
    },
  },

  // Applications (Admin & Student)
  applications: {
    apply: async (jobId) => {
      const response = await api.post("/application", { job: jobId });
      return response.data;
    },
    getMy: async () => {
      const response = await api.get("/application/my");
      return response.data;
    },
    getAll: async () => {
      const response = await api.get("/application");
      return response.data;
    },
    updateStatus: async (id, status) => {
      const response = await api.put(`/application/${id}`, { status });
      return response.data;
    },
  },

  // Notifications
  notifications: {
    getAll: async () => {
      const response = await api.get("/notifications");
      return response.data;
    },
    markRead: async (id) => {
      const response = await api.put(`/notifications/${id}/read`);
      return response.data;
    },
  },

  // Interviews
  interviews: {
    getAll: async () => {
      const response = await api.get("/interview/all");
      return response.data;
    },
    getMy: async () => {
      const response = await api.get("/interview/my");
      return response.data;
    },
    schedule: async (payload) => {
      const response = await api.post("/interview", payload);
      return response.data;
    },
    update: async (id, payload) => {
      const response = await api.put(`/interview/${id}`, payload);
      return response.data;
    },
    delete: async (id) => {
      const response = await api.delete(`/interview/${id}`);
      return response.data;
    },
  },

  // Offer Letters
  offerLetters: {
    getAll: async () => {
      const response = await api.get("/offer-letter");
      return response.data;
    },
    getMy: async () => {
      const response = await api.get("/offer-letter/my");
      return response.data;
    },
    upload: async (formData) => {
      const response = await api.post("/offer-letter", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
    updateStatus: async (id, status) => {
      const response = await api.put(`/offer-letter/${id}/status`, { status });
      return response.data;
    },
    delete: async (id) => {
      const response = await api.delete(`/offer-letter/${id}`);
      return response.data;
    },
  },

  // Admin specific student lists
  admin: {
    getStudents: async () => {
      const response = await api.get("/admin/students");
      return response.data;
    },
  },

  // Admin Analytics
  analytics: {
    get: async () => {
      const response = await api.get("/admin/analytics");
      return response.data;
    },
  },

  // Public (No authentication required)
  public: {
    getStats: async () => {
      const response = await api.get("/public/stats");
      return response.data;
    },
    getLatestJobs: async () => {
      const response = await api.get("/public/jobs");
      return response.data;
    },
  },
};

export default api;
