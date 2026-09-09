import { apiFetch } from "./api";

export type SettingsResponse = {
  business: {
    name: string;
    address: string;
    whatsapp: string;
  };
  schedule: {
    workingHours: string[];
    weekDays: string[];
  };
};

export async function getSettings(): Promise<SettingsResponse> {
  return apiFetch<SettingsResponse>("/admin/settings");
}
