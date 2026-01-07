import { Hono } from "hono";
import { getCookie } from "hono/cookie";
import { PrismaClient } from "../generated/client.ts";
import { PrismaPg } from "@prisma/adapter-pg";
import envs from "./envs.js";

const app = new Hono();
const adapter = new PrismaPg({
  connectionString: envs.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

app.post("/send", async (c) => {
  try {
    await save(c);
    return c.json({ message: "保存されました" });
  } catch (error) {
    return c.json({ message: "保存されませんでした:" + error });
  }
});
app.post("/get", async (c) => {
  const userSub = getCookie(c, "userSub");
  // if (!userSub) {
  //   return c.json({ loginBool: false });
  // }
  // const user = await get(c);
  // if (user == null) {
  //   return c.json({ loginBool: true, windowInfo: null });
  // }
  // return c.json({ loginBool: true, windowInfo: user.saveInfo });
  if (!userSub) {
    return c.json({ loginBool: false });
  }
  return c.json({ loginBool: true });
});

async function save(c) {
  const body = await c.req.json();
  const userSub = getCookie(c, "userSub");
  if (!userSub) {
    return;
  }
  await prisma.user.upsert({
    where: { id: userSub },
    update: {
      saveInfo: body,
    },
    create: {
      id: userSub,
      saveInfo: body,
    },
  });
}
async function get(c) {
  const userSub = getCookie(c, "userSub");
  const user = await prisma.user.findUnique({
    where: { id: userSub },
  });
  return user;
}
export default app;
