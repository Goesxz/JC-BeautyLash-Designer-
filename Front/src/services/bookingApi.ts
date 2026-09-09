export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export type NewAppointmentPayload = {
  name: string;
  phone: string;
  service: string;
  date: string;
  time: string;
};

export type CreatedAppointment = {
  id: number;
  date: string;
  time: string;
  status: string;
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
  };
};

export async function createAppointment(
  payload: NewAppointmentPayload,
): Promise<CreatedAppointment> {
  const response = await fetch(`${API_URL}/appointments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Erro ao criar agendamento.");
  }

  return data.appointment;
}
