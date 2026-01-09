"use client";

import { useEffect, useState } from "react";
import {
  fetchInboxItems,
  InboxItem,
} from "@/services/inbox.service";

export default function InboxPage() {
  const [items, setItems] = useState<InboxItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInbox = async () => {
      try {
        const data = await fetchInboxItems();
        setItems(data.items || []);
      } finally {
        setLoading(false);
      }
    };

    loadInbox();
  }, []);

  if (loading) return <p>Loading inbox...</p>;

  if (items.length === 0) {
    return <p>No items yet</p>;
  }

  return (
    <div>
      <h1>Inbox</h1>

      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <strong>{item.title}</strong>
            <p>Priority: {item.priority}</p>

            {item.reason && (
              <small>Why: {item.reason}</small>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
