import { Client } from "pg";
import dotenv from "dotenv";
dotenv.config();

/*
export const serverClient = new Client({
  user: process.env.PG_USER, // Replace with your PostgreSQL username
  password: process.env.PG_PASSWORD, // Replace with your PostgreSQL password
  host: process.env.PG_HOST, // Replace with your PostgreSQL host
  port: parseInt(process.env.PG_PORT || "5432"), // Replace with your PostgreSQL port number
});*/

export const client = new Client({
  /* user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  host: process.env.PG_HOST,
  port: parseInt(process.env.PG_PORT || "5432"),
  database: process.env.PG_DB,*/
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});
