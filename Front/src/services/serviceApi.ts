import { apiFetch } from "./api";

export type ServiceItem = {
  id: number;
  name: string;
  category: string | null;
  price: number;
  duration: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ServicesResponse = {
  total: number;
  services: ServiceItem[];
};

export type ServicePayload = {
  name: string;
  category: string;
  price: number;
  duration: number;
  active?: boolean;
};

export async function getServices(): Promise<ServicesResponse> {
  return apiFetch<ServicesResponse>("/admin/services");
}

export async function createService(payload: ServicePayload) {
  return apiFetch("/admin/services", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateService(
  id: number,
  payload: Partial<ServicePayload>,
) {
  return apiFetch(`/admin/services/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}
