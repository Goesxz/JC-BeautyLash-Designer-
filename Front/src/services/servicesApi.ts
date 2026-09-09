import { apiFetch } from "./api";

export type ApiService = {
  id: number;
  name: string;
  category: string | null;
  price: number;
  duration: number;
  active: boolean;
};

export async function getServices(): Promise<ApiService[]> {
  const data = await apiFetch<{ services: ApiService[] }>("/admin/services");
  return data.services;
}
