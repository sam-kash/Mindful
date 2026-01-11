"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  fetchInboxItems,
  InboxItem,
} from "@/services/inbox.service";
import { markAsRead, archiveItem } from "@/services/inbox.service";

export default function InboxPage() {
  const [items, setItems] = useState<InboxItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [openExplainId, setOpenExplainId] = useState<string | null>(null);

  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [hasMore, setHasMore] = useState(true);
  const [unreadOnly, setUnreadOnly] = useState(false);

  const loadInbox = async (reset = false) => {
    setLoading(true);
    try {
      const data = await fetchInboxItems({
        cursor: reset ? undefined : cursor,
        unreadOnly,
      });

      setItems((prev) =>
        reset ? data.items : [...prev, ...data.items]
      );
      setCursor(data.nextCursor);
      setHasMore(Boolean(data.nextCursor));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInbox(true);
  }, [unreadOnly]);

  const handleMarkRead = async (id: string) => {
    setActionLoading(id);
    try {
      await markAsRead(id);
      setItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, isRead: true } : item
        )
      );
    } finally {
      setActionLoading(null);
    }
  };

  const handleArchive = async (id: string) => {
    setActionLoading(id);
    try {
      await archiveItem(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
    } finally {
      setActionLoading(null);
    }
  };

  if (loading && items.length === 0) {
    return <p>Loading inbox...</p>;
  }

  if (!loading && items.length === 0) {
    return (
      <div>
        <h1>Inbox</h1>
        <p>No items yet.</p>
        <Link href="/integrations">Connect Gmail</Link>
      </div>
    );
  }

  return (
    <div>
      <h1>Inbox</h1>

      {/* Filters */}
      <div style={{ marginBottom: 12 }}>
        <label>
          <input
            type="checkbox"
            checked={unreadOnly}
            onChange={() => setUnreadOnly((v) => !v)}
          />
          Unread only
        </label>
      </div>

      <ul>
        {items.map((item) => {
          const isOpen = openExplainId === item.id;

          return (
            <li
              key={item.id}
              style={{
                opacity: item.isRead ? 0.6 : 1,
                borderBottom: "1px solid #ddd",
                marginBottom: 12,
                paddingBottom: 12,
              }}
            >
              <strong>{item.title}</strong>
              <p>Priority: {item.priority}</p>

              {item.reason && (
                <div>
                  <button
                    onClick={() =>
                      setOpenExplainId(isOpen ? null : item.id)
                    }
                  >
                    {isOpen ? "Hide why" : "Why this?"}
                  </button>

                  {isOpen && (
                    <div style={{ marginTop: 6 }}>
                      <small>{item.reason}</small>
                    </div>
                  )}
                </div>
              )}

              <div style={{ marginTop: 8 }}>
                {!item.isRead && (
                  <button
                    onClick={() => handleMarkRead(item.id)}
                    disabled={actionLoading === item.id}
                  >
                    Mark read
                  </button>
                )}

                <button
                  onClick={() => handleArchive(item.id)}
                  disabled={actionLoading === item.id}
                >
                  Archive
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      {/* Pagination */}
      {hasMore && (
        <button
          onClick={() => loadInbox()}
          disabled={loading}
        >
          Load more
        </button>
      )}
    </div>
  );
}
