import { Hono } from "hono";
import { setCookie } from "hono/cookie";
import envs from "./envs.js";
const app = new Hono();
app.get("/login", (c) => {
  const fullUrl = c.req.url;
  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.searchParams.set("client_id", envs.clientId ?? "NONE");
  url.searchParams.set("redirect_uri", envs.redirectUri ?? "NONE");
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "openid email profile");
  url.searchParams.set("access_type", "offline");
  url.searchParams.set("prompt", "consent");
  return c.redirect(url.toString());
});

app.get("/callback/google", async (c) => {
  const code = c.req.query("code");
  if (!code) return c.text("No code provided", 400);

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    body: new URLSearchParams({
      code,
      client_id: envs.clientId || "",
      client_secret: envs.clientSecret || "",
      redirect_uri: envs.redirectUri || "",
      grant_type: "authorization_code",
    }),
  });

  if (!tokenRes.ok) return c.text("Token exchange failed", 500);
  const tokenData = await tokenRes.json();
  const idToken = tokenData.id_token;
  if (!idToken) return c.text("ID token not found", 500);

  const payload = JSON.parse(
    Buffer.from(idToken.split(".")[1], "base64").toString()
  );
  setCookie(c, "userSub", payload.sub, {
    httpOnly: true,
    secure: true,
    sameSite: "Lax",
    path: "/",
    maxAge: 60 * 60 * 24,
  });
  return c.redirect(envs.frontEndUri);
});

export default app;
