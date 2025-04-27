"use strict";
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (
          !desc ||
          ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)
        ) {
          desc = {
            enumerable: true,
            get: function () {
              return m[k];
            },
          };
        }
        Object.defineProperty(o, k2, desc);
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
      }
    : function (o, v) {
        o["default"] = v;
      });
var __importStar =
  (this && this.__importStar) ||
  function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null)
      for (var k in mod)
        if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
          __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
  };
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const pg_1 = __importDefault(require("pg"));
const dotenv = __importStar(require("dotenv"));
const bcrypt_1 = __importDefault(require("bcrypt"));
dotenv.config();
const { Pool } = pg_1.default;
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "ChessBro",
  password: process.env.DB_PASSWORD || "Gib2",
  port: Number(process.env.DB_PORT) || 5432,
});
// ---------- SIGNUP ----------
app.post("/api/signup", (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
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
      const hashedPassword = yield bcrypt_1.default.hash(password, 10);
      const insertQuery = `
      INSERT INTO users (username, firstname, lastname, email, password)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING username, firstname, lastname, email;
    `;
      const result = yield pool.query(insertQuery, [
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
  })
);
// ---------- LOGIN ----------
app.post("/api/login", (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    if (!username || !password) {
      res.status(400).json({ error: "Username and password required" });
      return;
    }
    try {
      const userResult = yield pool.query(
        "SELECT * FROM users WHERE username = $1",
        [username]
      );
      if (userResult.rowCount === 0) {
        res.status(401).json({ error: "Invalid credentials" });
        return;
      }
      const user = userResult.rows[0];
      const match = yield bcrypt_1.default.compare(password, user.password);
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
  })
);
// ---------- UPDATE PROFILE ----------
app.put("/api/profile", (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
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
      const result = yield pool.query(updateQuery, values);
      if (result.rowCount === 0) {
        res.status(404).json({ error: "User not found" });
        return;
      }
      res.json({ message: "Profile updated", user: result.rows[0] });
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ error: "Server error updating profile" });
    }
  })
);
// ---------- CHESS STATS GET ----------
app.get("/api/chess/:username", (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const { username } = req.params;
    try {
      const result = yield pool.query(
        "SELECT * FROM chess WHERE username = $1",
        [username]
      );
      res.json({ chessStats: result.rowCount ? result.rows[0] : null });
    } catch (error) {
      console.error("Error fetching chess stats:", error);
      res.status(500).json({ error: "Server error fetching chess stats" });
    }
  })
);
// ---------- CHESS STATS PUT ----------
app.put("/api/chess", (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const { username, elo, wins, losses, draws, favoritetype } = req.body;
    if (!username) {
      res.status(400).json({ error: "Username is required." });
      return;
    }
    try {
      const result = yield pool.query(
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
  })
);
// ---------- UPDATE USER LOCATION ----------
app.put("/api/users/location", (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const { username, latitude, longitude } = req.body;
    if (!username || latitude == null || longitude == null) {
      res
        .status(400)
        .json({ error: "username, latitude and longitude are required" });
      return;
    }
    try {
      const result = yield pool.query(
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
  })
);
// ---------- GET ALL USER LOCATIONS ----------
app.get("/api/users/locations", (_req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const result = yield pool.query(`
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
  })
);
// ---------- CHESSLOCATION ENDPOINTS ----------
// GET all chess spots
app.get("/api/chesslocations", (_req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const result = yield pool.query(`
      SELECT location_id, longitude, latitude, name, location_type
      FROM chesslocation;
    `);
      res.json({ locations: result.rows });
    } catch (err) {
      console.error("Error fetching chess locations:", err);
      res.status(500).json({ error: "Server error fetching chess locations" });
    }
  })
);
// POST a new chess spot
app.post("/api/chesslocations", (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const { name, location_type, latitude, longitude } = req.body;
    if (!name || !location_type || latitude == null || longitude == null) {
      res.status(400).json({
        error: "name, location_type, latitude and longitude are required",
      });
      return;
    }
    try {
      const result = yield pool.query(
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
  })
);
// ---------- CHALLENGE SEND ----------
app.post("/api/challenges", (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const { fromUser, toUser, format, locationId } = req.body;
    if (!fromUser || !toUser || !format || !locationId) {
      res.status(400).json({ error: "Missing challenge data" });
      return;
    }
    try {
      const insertQuery = `
      INSERT INTO challenges (from_user, to_user, format, location_id, sent_at)
      VALUES ($1, $2, $3, $4, NOW())
      RETURNING *;
    `;
      const result = yield pool.query(insertQuery, [
        fromUser,
        toUser,
        format,
        locationId,
      ]);
      res
        .status(201)
        .json({ message: "Challenge sent", challenge: result.rows[0] });
    } catch (error) {
      console.error("Error sending challenge:", error);
      res.status(500).json({ error: "Server error sending challenge" });
    }
  })
);
// Error handler
/*app.use((err: any, _req: Request, res: Response) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});*/
app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});
// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log("Server listening on port ${PORT}");
});
