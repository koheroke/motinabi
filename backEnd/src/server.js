import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import jsonRoutes from "./routes/json.js";
import geminiRoutes from "./routes/geminiApi.js";
const app = new Hono();
// ルートをマウント
app.route("/api/auth", authRoutes);
app.route("/api/user", userRoutes);
app.route("/api/json", jsonRoutes);
app.route("/api/gemini", geminiRoutes);

app.use("/assets/*", serveStatic({ root: "/app/frontEnd/dist" }));
app.get("/", serveStatic({ path: "/app/frontEnd/dist/index.html" }));
// app.use(
//   "/assets/*",
//   serveStatic({
//     root: "/Users/azumakoutaira/workspace/motinabi/frontEnd/dist",
//   })
// );

// app.get(
//   "/",
//   serveStatic({
//     path: "/Users/azumakoutaira/workspace/motinabi/frontEnd/dist/index.html",
//   })
// );
const port = 3000;
const api = ["お金", [""]];
console.log(`Server is running on port ${port}`);
serve({ fetch: app.fetch, port });
