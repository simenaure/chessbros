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
  database: process.env.DB_NAME || "chessbros",
  password: process.env.DB_PASSWORD || "gib2",
  port: Number(process.env.DB_PORT) || 5432,
});

// ---------- SIGNUP ----------
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
    const hashedPassword = await bcrypt.hash(password, 10);
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

// ---------- LOGIN ----------
app.post("/api/login", async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).json({ error: "Username and password required" });
    return;
  }
  try {
    const userResult = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );
    if (userResult.rowCount === 0) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }
    const user = userResult.rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
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
        country: user.country,
        phone: user.phone,
        city: user.city,
        address: user.address,
        zip: user.zip,
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Server error during login" });
  }
});

// ---------- UPDATE PROFILE ----------
app.put("/api/profile", async (req: Request, res: Response): Promise<void> => {
  const {
    username,
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
  if (!username) {
    res.status(400).json({ error: "Username is required for update" });
    return;
  }
  try {
    const updateQuery = `
      UPDATE users
      SET 
        email     = COALESCE($1, email),
        firstname = COALESCE($2, firstname),
        lastname  = COALESCE($3, lastname),
        gender    = COALESCE($4, gender),
        country   = COALESCE($5, country),
        phone     = COALESCE($6, phone),
        city      = COALESCE($7, city),
        address   = COALESCE($8, address),
        zip       = COALESCE($9, zip)
      WHERE username = $10
      RETURNING username, email, firstname, lastname, gender, country, phone, city, address, zip;
    `;
    const values = [
      email,
      firstname,
      lastname,
      gender,
      country,
      phone,
      city,
      address,
      zip,
      username,
    ];
    const result = await pool.query(updateQuery, values);
    if (result.rowCount === 0) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.json({ message: "Profile updated", user: result.rows[0] });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ error: "Server error updating profile" });
  }
});

// ---------- CHESS STATS GET ----------
app.get(
  "/api/chess/:username",
  async (req: Request, res: Response): Promise<void> => {
    const { username } = req.params;
    try {
      const result = await pool.query(
        "SELECT * FROM chess WHERE username = $1",
        [username]
      );
      res.json({ chessStats: result.rowCount ? result.rows[0] : null });
    } catch (error) {
      console.error("Error fetching chess stats:", error);
      res.status(500).json({ error: "Server error fetching chess stats" });
    }
  }
);

// ---------- CHESS STATS PUT ----------
app.put("/api/chess", async (req: Request, res: Response): Promise<void> => {
  const { username, elo, wins, losses, draws, favoritetype } = req.body;
  if (!username) {
    res.status(400).json({ error: "Username is required." });
    return;
  }
  try {
    const result = await pool.query(
      `
      INSERT INTO chess (username, elo, wins, losses, draws, favoritetype)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (username)
      DO UPDATE SET 
        elo          = EXCLUDED.elo,
        wins         = EXCLUDED.wins,
        losses       = EXCLUDED.losses,
        draws        = EXCLUDED.draws,
        favoritetype = EXCLUDED.favoritetype
      RETURNING *;
    `,
      [username, elo, wins, losses, draws, favoritetype]
    );
    res.json({ message: "Chess stats saved", chessStats: result.rows[0] });
  } catch (error) {
    console.error("Error updating chess stats:", error);
    res.status(500).json({ error: "Server error updating chess stats" });
  }
});

// ---------- UPDATE USER LOCATION ----------
app.put(
  "/api/users/location",
  async (req: Request, res: Response): Promise<void> => {
    const { username, latitude, longitude } = req.body;
    if (!username || latitude == null || longitude == null) {
      res
        .status(400)
        .json({ error: "username, latitude and longitude are required" });
      return;
    }
    try {
      const result = await pool.query(
        `
      UPDATE users
      SET latitude = $2, longitude = $3
      WHERE username = $1
      RETURNING username, latitude, longitude;
    `,
        [username, latitude, longitude]
      );
      if (result.rowCount === 0) {
        res.status(404).json({ error: "User not found" });
      } else {
        res.json({ message: "Location updated", location: result.rows[0] });
      }
    } catch (err) {
      console.error("Error updating location:", err);
      res.status(500).json({ error: "Server error updating location" });
    }
  }
);

// ---------- GET ALL USER LOCATIONS ----------
app.get(
  "/api/users/locations",
  async (_req: Request, res: Response): Promise<void> => {
    try {
      const result = await pool.query(`
      SELECT 
        u.username, 
        u.latitude, 
        u.longitude,
        c.elo
      FROM users u
      LEFT JOIN chess c ON u.username = c.username
      WHERE u.latitude IS NOT NULL AND u.longitude IS NOT NULL;
    `);
      res.json({ locations: result.rows });
    } catch (err) {
      console.error("Error fetching locations:", err);
      res.status(500).json({ error: "Server error fetching locations" });
    }
  }
);

// ---------- CHESSLOCATION ENDPOINTS ----------

// GET all chess spots
app.get("/api/chesslocations", async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT location_id, longitude, latitude, name, location_type
      FROM chesslocation;
    `);
    res.json({ locations: result.rows });
  } catch (err) {
    console.error("Error fetching chess locations:", err);
    res.status(500).json({ error: "Server error fetching chess locations" });
  }
});

// POST a new chess spot
app.post("/api/chesslocations", async (req: Request, res: Response) => {
  const { name, location_type, latitude, longitude } = req.body;
  if (!name || !location_type || latitude == null || longitude == null) {
    res
      .status(400)
      .json({
        error: "name, location_type, latitude and longitude are required",
      });
    return;
  }
  try {
    const result = await pool.query(
      `
      INSERT INTO chesslocation (name, location_type, latitude, longitude)
      VALUES ($1, $2, $3, $4)
      RETURNING location_id, longitude, latitude, name, location_type;
      `,
      [name, location_type, latitude, longitude]
    );
    res.status(201).json({ location: result.rows[0] });
  } catch (err) {
    console.error("Error inserting chess location:", err);
    res.status(500).json({ error: "Server error inserting chess location" });
  }
});

// Error handler
app.use((err: any, _req: Request, res: Response) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
