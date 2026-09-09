import { apiFetch } from "./api";

export type FinanceAppointment = {
  id: number;
  date: string;
  time: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "FINISHED";
  price: number;
  duration: number;
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

export type FinanceResponse = {
  metrics: {
    revenueToday: number;
    revenueMonth: number;
    totalRevenue: number;
    averageTicket: number;
    totalAppointments: number;
    cancelledAppointments: number;
  };
  appointments: FinanceAppointment[];
};

export async function getFinance(): Promise<FinanceResponse> {
  return apiFetch<FinanceResponse>("/admin/financeiro");
}
