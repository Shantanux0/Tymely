import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

export type PatientStatus = "waiting" | "current" | "done" | "skipped" | "rescheduled";

export type QueuePatient = {
  id: string;
  token: number;
  name: string;
  phone: string;
  age: number;
  gender: "M" | "F";
  reason: string;
  arrivedAt: string;
  waitMins: number;
  status: PatientStatus;
  amount?: number;
  trackingCode?: string;
};

export type PatientRecord = {
  id: string;
  name: string;
  phone: string;
  age: number;
  gender: "M" | "F";
  lastVisit: string;
  totalVisits: number;
  totalPaid: number;
  tags: string[];
};

export type ActivityItem = {
  id: string;
  type: "done" | "added" | "skipped" | "rescheduled" | "payment";
  text: string;
  time: string;
};

export type EarningItem = {
  day: string;
  value: number;
};

export type ClinicContextType = {
  queuePatients: QueuePatient[];
  allPatients: PatientRecord[];
  activityFeed: ActivityItem[];
  earningsChart: EarningItem[];
  addPatientToQueue: (patient: {
    name: string;
    phone: string;
    age: number;
    gender: "M" | "F";
    reason: string;
    fees: number;
  }) => Promise<{ token: number; trackingCode: string }>;
  markPatientDone: (id: string, customAmount?: number) => Promise<void>;
  skipPatient: (id: string) => Promise<void>;
  reschedulePatient: (id: string) => Promise<void>;
  removePatient: (id: string) => Promise<void>;
  resetQueue: () => Promise<void>;
  addManualEarning: (amount: number, tokenText: string) => Promise<void>;
  callNextPatient: (id: string) => Promise<void>;
};

const ClinicContext = createContext<ClinicContextType | undefined>(undefined);

// Helper API Fetcher with automatic JWT Token attaching
const apiFetch = async (path: string, options: RequestInit = {}) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("doxly_auth_token") : null;
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { "Authorization": `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const response = await fetch(`http://localhost:8080${path}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    if (typeof window !== "undefined") {
      localStorage.removeItem("doxly_auth_token");
      localStorage.removeItem("doxly_doctor_name");
      localStorage.removeItem("doxly_clinic_name");
      localStorage.removeItem("doxly_specialty");
      window.location.href = "/login";
    }
    throw new Error("Unauthorized");
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Request failed");
  }

  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return response.json();
  }
  return null;
};

export function ClinicProvider({ children }: { children: React.ReactNode }) {
  const [queuePatients, setQueuePatients] = useState<QueuePatient[]>([]);
  const [allPatients, setAllPatients] = useState<PatientRecord[]>([]);
  const [activityFeed, setActivityFeed] = useState<ActivityItem[]>([]);
  const [earningsChart, setEarningsChart] = useState<EarningItem[]>([
    { day: "Mon", value: 0 },
    { day: "Tue", value: 0 },
    { day: "Wed", value: 0 },
    { day: "Thu", value: 0 },
    { day: "Fri", value: 0 },
    { day: "Sat", value: 0 },
    { day: "Sun", value: 0 },
  ]);

  const refreshData = async () => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("doxly_auth_token") : null;
      if (!token) return;

      const q = await apiFetch("/api/queue");
      const p = await apiFetch("/api/patients");
      const a = await apiFetch("/api/activity");
      const e = await apiFetch("/api/earnings");

      if (q) setQueuePatients(q);
      if (p) setAllPatients(p);
      if (a) setActivityFeed(a);
      if (e && e.earningsChart) setEarningsChart(e.earningsChart);
    } catch (err) {
      console.error("Error refreshing clinic data:", err);
    }
  };

  // Load backend data on mount
  useEffect(() => {
    refreshData();
  }, []);

  const addPatientToQueue = async (patient: {
    name: string;
    phone: string;
    age: number;
    gender: "M" | "F";
    reason: string;
    fees: number;
  }) => {
    try {
      const result = await apiFetch("/api/queue", {
        method: "POST",
        body: JSON.stringify(patient),
      });
      refreshData();
      return result; // returns { token, trackingCode }
    } catch (err: any) {
      toast.error(err.message || "Failed to add patient to queue");
      throw err;
    }
  };

  const markPatientDone = async (id: string, customAmount?: number) => {
    try {
      await apiFetch(`/api/queue/${id}/done`, {
        method: "POST",
        body: JSON.stringify(customAmount !== undefined ? { customAmount } : {}),
      });
      toast.success("Patient marked done!");
      refreshData();
    } catch (err: any) {
      toast.error(err.message || "Failed to mark patient done");
    }
  };

  const skipPatient = async (id: string) => {
    try {
      await apiFetch(`/api/queue/${id}/skip`, { method: "POST" });
      toast.info("Patient skipped");
      refreshData();
    } catch (err: any) {
      toast.error(err.message || "Failed to skip patient");
    }
  };

  const reschedulePatient = async (id: string) => {
    try {
      await apiFetch(`/api/queue/${id}/reschedule`, { method: "POST" });
      toast.info("Patient rescheduled 5 slots ahead");
      refreshData();
    } catch (err: any) {
      toast.error(err.message || "Failed to reschedule patient");
    }
  };

  const removePatient = async (id: string) => {
    try {
      await apiFetch(`/api/queue/${id}/remove`, { method: "POST" });
      toast.error("Patient removed from queue");
      refreshData();
    } catch (err: any) {
      toast.error(err.message || "Failed to remove patient");
    }
  };

  const resetQueue = async () => {
    try {
      await apiFetch("/api/queue/reset", { method: "POST" });
      toast.success("Queue reset successfully");
      refreshData();
    } catch (err: any) {
      toast.error(err.message || "Failed to reset queue");
    }
  };

  const addManualEarning = async (amount: number, tokenText: string) => {
    try {
      await apiFetch("/api/earnings/manual", {
        method: "POST",
        body: JSON.stringify({ amount, tokenText }),
      });
      toast.success(`₹${amount} added successfully`);
      refreshData();
    } catch (err: any) {
      toast.error(err.message || "Failed to add manual earning");
    }
  };

  const callNextPatient = async (id: string) => {
    try {
      await apiFetch(`/api/queue/${id}/call`, { method: "POST" });
      toast.success("Calling next patient");
      refreshData();
    } catch (err: any) {
      toast.error(err.message || "Failed to call next patient");
    }
  };

  return (
    <ClinicContext.Provider
      value={{
        queuePatients,
        allPatients,
        activityFeed,
        earningsChart,
        addPatientToQueue,
        markPatientDone,
        skipPatient,
        reschedulePatient,
        removePatient,
        resetQueue,
        addManualEarning,
        callNextPatient,
      }}
    >
      {children}
    </ClinicContext.Provider>
  );
}

export function useClinic() {
  const context = useContext(ClinicContext);
  if (!context) {
    throw new Error("useClinic must be used within a ClinicProvider");
  }
  return context;
}
