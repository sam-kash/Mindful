import { api } from "./api";

export interface InboxItem {
  id: string;
  title: string;
  content?: string;
  priority: number;
  reason?: string;
  isRead: boolean;
  createdAt: string;
}

export interface InboxResponse {
  items: InboxItem[];
  nextCursor?: string;
}

export const fetchInboxItems = async (
  params?: {
    limit?: number;
    cursor?: string;
    unreadOnly?: boolean;
  }
): Promise<InboxResponse> => {
  const res = await api.get("/items", {
    params: {
      limit: params?.limit ?? 20,
      cursor: params?.cursor,
      unreadOnly: params?.unreadOnly,
    },
  });

  return res.data;
};

export const markAsRead = async (itemId: string) => {
  await api.patch(`/items/${itemId}/read`);
};

export const archiveItem = async (itemId: string) => {
  await api.patch(`/items/${itemId}/archive`);
};

