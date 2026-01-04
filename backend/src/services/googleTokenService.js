import axios from "axios";

export const refreshGoogleAccessToken = async (refreshToken) => {
  const res = await axios.post("https://oauth2.googleapis.com/token", {
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    refresh_token: refreshToken,
    grant_type: "refresh_token"
  });

  return {
    accessToken: res.data.access_token,
    expiresIn: res.data.expires_in
  };
};
