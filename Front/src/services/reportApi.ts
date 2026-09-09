import { apiFetch } from "./api";

export type ServiceRankingItem = {
  service: string;
  total: number;
  revenue: number;
};

export type ReportsResponse = {
  metrics: {
    totalAppointments: number;
    validAppointments: number;
    cancelledAppointments: number;
    revenue: number;
  };
  servicesRanking: ServiceRankingItem[];
};

export async function getReports(): Promise<ReportsResponse> {
  return apiFetch<ReportsResponse>("/admin/reports");
}
