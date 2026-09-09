import { apiFetch } from "./api";

export type AppointmentStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CANCELLED"
  | "FINISHED";

export type AgendaAppointment = {
  id: number;
  date: string;
  time: string;
  status: AppointmentStatus;
  price: number;
  duration: number;
  notes: string | null;
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

export type AgendaResponse = {
  date: string | null;
  workingHours: string[];
  appointments: AgendaAppointment[];
};

export async function getAgenda(date?: string): Promise<AgendaResponse> {
  const path = date ? `/admin/agenda?date=${date}` : "/admin/agenda";
  return apiFetch<AgendaResponse>(path);
}

export async function updateAppointmentStatus(
  id: number,
  status: AppointmentStatus,
) {
  return apiFetch(`/appointments/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export async function updateAppointment(
  id: number,
  data: {
    status?: AppointmentStatus;
    notes?: string;
  },
) {
  return apiFetch(`/appointments/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}
