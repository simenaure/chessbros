import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import pg from "pg";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

dotenv.config();
const { Pool } = pg;
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

// POST endpoint for signup
app.post(
  "/api/signup",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const {
      username,
      firstName,
      lastName,
      email,
      gender,
      password,
      confirmPassword,
    } = req.body;

    if (
      !username ||
      !firstName ||
      !lastName ||
      !email ||
      !gender ||
      !password ||
      !confirmPassword
    ) {
      res.status(400).json({ error: "Alle felt må fylles ut" });
      return;
    }
    if (password !== confirmPassword) {
      res.status(400).json({ error: "Passordene stemmer ikke overens" });
      return;
    }
    try {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const insertQuery = `
        INSERT INTO users (username, firstname, lastname, email, gender, password)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING username, firstname, lastname, email, gender;
      `;
      const result = await pool.query(insertQuery, [
        username,
        firstName,
        lastName,
        email,
        gender,
        hashedPassword,
      ]);
      res.status(201).json({ message: "User created", user: result.rows[0] });
    } catch (error) {
      console.error("Error during sign-up:", error);
      res.status(500).json({ error: "Internal server error during sign-up" });
    }
  }
);

// POST endpoint for login
app.post("/api/login", async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: "Email and password required" });
    return;
  }
  try {
    const userQuery = "SELECT * FROM users WHERE LOWER(email) = $1";
    const userResult = await pool.query(userQuery, [
      email.trim().toLowerCase(),
    ]);
    if (userResult.rowCount === 0) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }
    const user = userResult.rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }
    res.json({
      message: "Logged in successfully",
      user: {
        username: user.username,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        gender: user.gender,
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Server error during login" });
  }
});

// Error handling middleware (for å returnere JSON i alle tilfeller)
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server kjører på port ${PORT}`);
});
