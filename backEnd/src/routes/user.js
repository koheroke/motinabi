import { Hono } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import envs from "./envs.js";
const app = new Hono();

app.get("/me", (c) => {
  const userSub = getCookie(c, "userSub");
  if (!userSub) return c.json({ error: "Not logged in" }, 401);
  return c.json({ sub: userSub });
});

app.get("/logout", (c) => {
  setCookie(c, "userSub", "", {
    path: "/",
    httpOnly: true,
    expires: new Date(0),
  });
  return c.redirect(envs.frontEndUri);
});

export default app;
