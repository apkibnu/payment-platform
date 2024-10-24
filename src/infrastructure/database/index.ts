import { DB_CONFIG } from "@/libs/utils";
import pg from "pg";
const { Client } = pg;
const { db_name, db_password, db_user, db_host } = DB_CONFIG;

export const client = new Client({
  user: db_user,
  password: db_password,
  host: db_host,
  port: parseInt(DB_CONFIG.config.port),
  database: db_name,
});
