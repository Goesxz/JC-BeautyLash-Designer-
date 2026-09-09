import { apiFetch } from "./api";

export type AdminLoginResponse = {
  message: string;
  token: string;
  admin: {
    email: string;
  };
};

export async function adminLogin(email: string, password: string) {
  return apiFetch<AdminLoginResponse>("/admin/login", {
    method: "POST",
    skipAuth: true,
    body: JSON.stringify({ email, password }),
  });
}
