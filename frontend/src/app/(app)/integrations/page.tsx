"use client";

import { useEffect, useState } from "react";
import {
  fetchIntegrations,
  connectGmail,
  IntegrationStatus,
} from "@/services/integrations.service";

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<IntegrationStatus[]>([]);
  const [loading, setLoading] = useState(true);

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

  const handleConnect = async () => {
    await connectGmail();
  };

  if (loading) return <p>Loading integrations...</p>;

  return (
    <div>
      <h1>Integrations</h1>

      <section>
        <h2>Gmail</h2>

        {gmail?.connected ? (
          <div>
            <p> Connected</p>
            {gmail.email && <p>Email: {gmail.email}</p>}
            {gmail.lastSyncedAt && (
              <p>Last synced: {new Date(gmail.lastSyncedAt).toLocaleString()}</p>
            )}
          </div>
        ) : (
          <button onClick={handleConnect}>Connect Gmail</button>
        )}
      </section>
    </div>
  );
}
