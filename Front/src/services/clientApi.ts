import { apiFetch } from "./api";

export type ClientAppointment = {
  id: number;
  date: string;
  time: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "FINISHED";
  price: number;
  duration: number;
  notes: string | null;
  service: {
    id: number;
    name: string;
    category: string | null;
    price: number;
    duration: number;
  };
};

export type Client = {
  id: number;
  name: string;
  phone: string;
  notes: string | null;
  totalAppointments: number;
  totalSpent: number;
  lastAppointment: ClientAppointment | null;
  createdAt: string;
  updatedAt: string;
};

export type ClientsResponse = {
  total: number;
  clients: Client[];
};

export async function getClients(): Promise<ClientsResponse> {
  return apiFetch<ClientsResponse>("/admin/clients");
}
