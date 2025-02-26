// server.ts
import express, { Request, Response } from "express";
import cors from "cors";
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "ChessBro",
  password: process.env.DB_PASSWORD || "Gib2",
  port: Number(process.env.DB_PORT) || 5432,
});

// API-endepunkt for å hente brukere
app.get("/api/users", async (_req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT * FROM users");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Noe gikk galt ved henting av brukere");
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server kjører på port ${PORT}`);
});
