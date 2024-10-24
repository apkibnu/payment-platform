import dotenv from "dotenv";
import fs from "fs";

dotenv.config({
  path: `${__dirname}/../../.env`,
  override: true,
});
let configPath = `./.env`;
try {
  fs.readFileSync(configPath);
} catch (e) {
  configPath = `./../../.env`;
}
dotenv.config({ override: true, path: configPath });
export const NODE_ENV = process.env.NODE_ENV || "local";
export const APP_HOST = process.env.APP_HOST || "0.0.0.0";
export const APP_PORT = process.env.APP_PORT || "3000";
export const APP_URL_PREFIX = process.env.APP_URL_PREFIX || "/api/";
export const JWT_SECRET = process.env["JWT_SECRET"] || "secret";
export const APP_URL = process.env.APP_URL || "http://localhost:3000/";
export const DB_CONFIG = {
  db_name: process.env["DB_NAME"] || "db_local",
  db_user: process.env["DB_USER"] || "root",
  db_password: process.env["DB_PASSWORD"] || "root",
  config: {
    dialect: process.env["DB_DIALECT"] || "mysql",
    port: process.env["DB_PORT"] || "3306",
  },
  db_host: process.env["DB_HOST"] || "0.0.0.0",
};
if (JWT_SECRET == "secret") {
  console.log("No JWT secret string. Set JWT_SECRET environment variable.");
  process.exit(1);
}
