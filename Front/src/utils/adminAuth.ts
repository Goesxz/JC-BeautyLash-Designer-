const ADMIN_TOKEN_KEY = "jcbeauty_admin_token";

export function saveAdminAuth(token: string) {
  localStorage.setItem(ADMIN_TOKEN_KEY, token);
}

export function getAdminToken(): string | null {
  return localStorage.getItem(ADMIN_TOKEN_KEY);
}

export function isAdminAuthenticated(): boolean {
  const token = getAdminToken();

  if (!token) {
    return false;
  }

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return typeof payload.exp === "number" && payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

export function logoutAdmin() {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
}
