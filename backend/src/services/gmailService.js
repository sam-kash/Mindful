import axios from "axios";

export const fetchGmailMessages = async (accessToken) => {
  const res = await axios.get(
    "https://gmail.googleapis.com/gmail/v1/users/me/messages",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      params: { maxResults: 20 }
    }
  );

  return res.data.messages || [];
};
