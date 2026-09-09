import { apiFetch } from "./api";

export type AdminAppointment = {
  id: number;
  date: string;
  time: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "FINISHED";
  price: number;
  duration: number;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  client: {
    id: number;
    name: string;
    phone: string;
  };
  service: {
    id: number;
    name: string;
    category: string | null;
    price: number;
    duration: number;
  };
};

export type AdminDashboard = {
  metrics: {
    totalAppointments: number;
    todayAppointments: number;
    upcomingAppointments: number;
    totalClients: number;
    activeServices: number;
    revenueToday: number;
    revenueMonth: number;
    totalRevenue: number;
    cancelledAppointments: number;
  };
  todayAppointments: AdminAppointment[];
  upcomingAppointments: AdminAppointment[];
  recentAppointments: AdminAppointment[];
};

export async function getAdminDashboard(): Promise<AdminDashboard> {
  return apiFetch<AdminDashboard>("/admin/dashboard");
}
