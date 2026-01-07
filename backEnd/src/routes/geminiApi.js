import { GoogleGenAI } from "@google/genai";
import { Hono } from "hono";
import envs from "./envs.js";
const app = new Hono();
const ai = new GoogleGenAI({ apiKey: envs.geminiApiKey });

async function main(content) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents:
      content +
      "この持ち物リストを見て忘れ物と考えられるものリストをカンマ区切りの箇条書きでその他の文章不要",
  });
  return response;
}

app.post("/itemsCheck", async (c) => {
  const content = await c.req.json();
  const answar = await main(content);
  return c.json(answar.candidates[0].content.parts[0].text);
});
export default app;
