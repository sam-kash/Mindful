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

export const fetchInboxItems = async () => {
  const res = await api.get("/items", {
    params: {
      limit: 20,
    },
  });
  return res.data; // { items, pagination }
};

export const markAsRead = async (itemId: string) => {
  await api.patch(`/items/${itemId}/read`);
};

export const archiveItem = async (itemId: string) => {
  await api.patch(`/items/${itemId}/archive`);
};
