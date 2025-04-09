import express, { Request, Response } from "express";
import cors from "cors";
import pg from "pg";
import * as dotenv from "dotenv";
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
app.post("/api/signup", async (req: Request, res: Response): Promise<void> => {
  const { username, firstName, lastName, email, password, confirmPassword } =
    req.body;

  if (
    !username ||
    !firstName ||
    !lastName ||
    !email ||
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
        INSERT INTO users (username, firstname, lastname, email, password)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING username, firstname, lastname, email;
      `;
    const result = await pool.query(insertQuery, [
      username,
      firstName,
      lastName,
      email,
      hashedPassword,
    ]);
    res.status(201).json({ message: "User created", user: result.rows[0] });
  } catch (error) {
    console.error("Error during sign-up:", error);
    res.status(500).json({ error: "Internal server error during sign-up" });
  }
});

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

// PUT endpoint for å oppdatere profilinformasjon
app.put("/api/profile", async (req: Request, res: Response): Promise<void> => {
  const {
    username, // PRIMARY KEY, skal ikke endres
    email,
    firstname,
    lastname,
    gender,
    country,
    phone,
    city,
    address,
    zip,
  } = req.body;

  // Sjekk at vi har den nødvendige identifikatoren (username)
  if (!username) {
    res
      .status(400)
      .json({ error: "Username (primary key) er påkrevd for oppdatering" });
    return;
  }

  try {
    // Siden username ikke endres, bruker vi den i WHERE-delen.
    // Oppdater de øvrige feltene med nye verdier (hvis de sendes med) eller behold gamle verdier.
    const updateQuery = `
      UPDATE users
      SET 
        email = COALESCE($1, email),
        firstname = COALESCE($2, firstname),
        lastname = COALESCE($3, lastname),
        gender = COALESCE($4, gender),
        country = COALESCE($5, country),
        phone = COALESCE($6, phone),
        city = COALESCE($7, city),
        address = COALESCE($8, address),
        zip = COALESCE($9, zip)
      WHERE username = $10
      RETURNING username, email, firstname, lastname, gender, country, phone, city, address, zip;
    `;
    const values = [
      email, // $1
      firstname, // $2
      lastname, // $3
      gender, // $4
      country, // $5
      phone, // $6
      city, // $7
      address, // $8
      zip, // $9
      username, // $10 (WHERE clause)
    ];

    const result = await pool.query(updateQuery, values);
    if (result.rowCount === 0) {
      res.status(404).json({ error: "Bruker ikke funnet" });
      return;
    }
    res.json({ message: "Profil oppdatert", user: result.rows[0] });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ error: "Intern serverfeil" });
  }
});

// Error handling middleware (for å returnere JSON i alle tilfeller)
app.use((err: any, res: Response) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server kjører på port ${PORT}`);
});
