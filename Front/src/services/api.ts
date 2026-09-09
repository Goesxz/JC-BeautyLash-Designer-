import { getAdminToken, logoutAdmin } from "../utils/adminAuth";

export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

type RequestOptions = RequestInit & {
  skipAuth?: boolean;
};

export async function apiFetch<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { skipAuth = false, headers, ...rest } = options;

  const finalHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...(headers as Record<string, string>),
  };

  if (!skipAuth) {
    const token = getAdminToken();

    if (token) {
      finalHeaders.Authorization = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...rest,
    headers: finalHeaders,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (
      response.status === 401 &&
      !skipAuth &&
      window.location.pathname.startsWith("/admin") &&
      window.location.pathname !== "/admin/login"
    ) {
      logoutAdmin();
      window.location.href = "/admin/login";
    }

    throw new Error(data.error || "Erro ao processar a requisição.");
  }

  return data as T;
}
