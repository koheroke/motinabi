import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });
const envs = {
  DATABASE_URL: process.env.DATABASE_URL,
  clientId: process.env.clientID,
  clientSecret: process.env.clientSecret,
  redirectUri: process.env.redirectUri,
  frontEndUri: process.env.frontEndUri,
  geminiApiKey: process.env.geminiApiKey,
};
export default envs;
