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


  return{
      messages: res.data.messages || [],
      historyId: res.data.historyId
    
  } 
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
  console.log("GMAIL RAW RESPONSE historyId:", res.data.historyId);

  return {
      messages : res.data.messages || [],
      historyId: res.data.historyId
  }; 
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

export const fetchGmailHistory = async (
  accessToken,
  startHistoryId
) => {
  const res = await axios.get(
    "https://gmail.googleapis.com/gmail/v1/users/me/history",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      params: {
        startHistoryId,
        historyTypes: ["messageAdded"]
      }
    }
  );

  return {
    history: res.data.history || [],
    historyId: res.data.historyId
  };
};

export const fetchGmailProfile = async (accessToken) => {
  const res = await axios.get(
    "https://gmail.googleapis.com/gmail/v1/users/me/profile",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  );

  return {
    historyId: res.data.historyId
  };
};
