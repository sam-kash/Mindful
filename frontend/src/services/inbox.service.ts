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
  const page = params?.cursor ? parseInt(params.cursor) : 1;

  const res = await api.get("/items", {
    params: {
      limit: params?.limit ?? 20,
      page,
      unreadOnly: params?.unreadOnly,
    },
  });

  const { items, page: currentPage, pages } = res.data;
  const nextCursor = currentPage < pages ? String(currentPage + 1) : undefined;

  // Map _id to id if necessary
  const mappedItems = items.map((item: any) => ({
    ...item,
    id: item._id || item.id,
  }));

  return {
    items: mappedItems,
    nextCursor,
  };
};

export const markAsRead = async (itemId: string) => {
  await api.patch(`/items/${itemId}/read`);
};

export const archiveItem = async (itemId: string) => {
  await api.patch(`/items/${itemId}/archive`);
};

