import { api } from "./api";

export interface IntegrationStatus {
  provider: "gmail";
  connected: boolean;
  email?: string;
  lastSyncedAt?: string;
}

export const fetchIntegrations = async (): Promise<IntegrationStatus[]> => {
  const res = await api.get("/users/integrations");
  return res.data ? [
    {
      provider: "gmail",
      connected: res.data.gmailConnected,
      lastSyncedAt: res.data.lastSyncedAt
    }
  ] : [];
};

export const connectGmail = async () => {
  // Redirect to backend OAuth endpoint with token
  const token = sessionStorage.getItem("accessToken");
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
  window.location.href = `${API_URL}/oauth/google?token=${token}`;
};
