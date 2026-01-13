"use client";

import { useEffect, useState } from "react";
import {
  fetchIntegrations,
  connectGmail,
  IntegrationStatus,
} from "@/services/integrations.service";
import { useRouter } from "next/navigation";

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<IntegrationStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchIntegrations();
        setIntegrations(data);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const gmail = integrations.find((i) => i.provider === "gmail");

  // ✅ Auto-redirect to inbox once connected
  useEffect(() => {
    if (gmail?.connected) {
      router.push("/inbox");
    }
  }, [gmail, router]);

  const handleConnect = async () => {
    try {
      setConnecting(true);
      await connectGmail(); // ⬅️ redirect happens here
    } catch (err) {
      console.error("Failed to start Gmail OAuth", err);
      setConnecting(false);
    }
  };

  if (loading) return <p>Loading integrations...</p>;

  return (
    <div>
      <h1>Integrations</h1>

      <section>
        <h2>Gmail</h2>

        {gmail?.connected ? (
          <div>
            <p>✅ Connected</p>
            {gmail.lastSyncedAt && (
              <p>
                Last synced:{" "}
                {new Date(gmail.lastSyncedAt).toLocaleString()}
              </p>
            )}
            <p>Redirecting to inbox…</p>
          </div>
        ) : (
          <button onClick={handleConnect} disabled={connecting}>
            {connecting ? "Connecting…" : "Connect Gmail"}
          </button>
        )}
      </section>
    </div>
  );
}
