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

//import axios from "axios";

export const fetchGmailMessageIds = async (accessToken) => {
  const res = await axios.get(
    "https://gmail.googleapis.com/gmail/v1/users/me/messages",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      params: {
        maxResults: 20
      }
    }
  );

  return res.data.messages || [];
};
export const fetchGmailMessage = async (accessToken, messageId) => {
  const res = await axios.get(
    `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      params: {
        format: "metadata",
        metadataHeaders: ["Subject", "From"]
      }
    }
  );

  const headers = res.data.payload.headers;
  const subject =
    headers.find((h) => h.name === "Subject")?.value || "No Subject";

  return {
    title: subject,
    content: subject,
    source: "gmail",
    externalId: res.data.id,
    category: "email"
  };
};
