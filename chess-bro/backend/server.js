"use strict";
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
var __generator =
  (this && this.__generator) ||
  function (thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: [],
      },
      f,
      y,
      t,
      g = Object.create(
        (typeof Iterator === "function" ? Iterator : Object).prototype
      );
    return (
      (g.next = verb(0)),
      (g["throw"] = verb(1)),
      (g["return"] = verb(2)),
      typeof Symbol === "function" &&
        (g[Symbol.iterator] = function () {
          return this;
        }),
      g
    );
    function verb(n) {
      return function (v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError("Generator is already executing.");
      while ((g && ((g = 0), op[0] && (_ = 0)), _))
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y["return"]
                  : op[0]
                  ? y["throw"] || ((t = y["return"]) && t.call(y), 0)
                  : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var cors_1 = require("cors");
var pg_1 = require("pg");
var dotenv = require("dotenv");
var bcrypt_1 = require("bcrypt");
dotenv.config();
var Pool = pg_1.default.Pool;
var app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
var pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "chessbros",
  password: process.env.DB_PASSWORD || "gib2",
  port: Number(process.env.DB_PORT) || 5432,
});
// POST endpoint for signup
app.post("/api/signup", function (req, res) {
  return __awaiter(void 0, void 0, void 0, function () {
    var _a,
      username,
      firstName,
      lastName,
      email,
      gender,
      password,
      confirmPassword,
      saltRounds,
      hashedPassword,
      insertQuery,
      result,
      error_1;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          (_a = req.body),
            (username = _a.username),
            (firstName = _a.firstName),
            (lastName = _a.lastName),
            (email = _a.email),
            (gender = _a.gender),
            (password = _a.password),
            (confirmPassword = _a.confirmPassword);
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
            return [2 /*return*/];
          }
          if (password !== confirmPassword) {
            res.status(400).json({ error: "Passordene stemmer ikke overens" });
            return [2 /*return*/];
          }
          _b.label = 1;
        case 1:
          _b.trys.push([1, 4, , 5]);
          saltRounds = 10;
          return [4 /*yield*/, bcrypt_1.default.hash(password, saltRounds)];
        case 2:
          hashedPassword = _b.sent();
          insertQuery =
            "\n        INSERT INTO users (username, firstname, lastname, email, gender, password)\n        VALUES ($1, $2, $3, $4, $5, $6)\n        RETURNING username, firstname, lastname, email, gender;\n      ";
          return [
            4 /*yield*/,
            pool.query(insertQuery, [
              username,
              firstName,
              lastName,
              email,
              gender,
              hashedPassword,
            ]),
          ];
        case 3:
          result = _b.sent();
          res
            .status(201)
            .json({ message: "User created", user: result.rows[0] });
          return [3 /*break*/, 5];
        case 4:
          error_1 = _b.sent();
          console.error("Error during sign-up:", error_1);
          res
            .status(500)
            .json({ error: "Internal server error during sign-up" });
          return [3 /*break*/, 5];
        case 5:
          return [2 /*return*/];
      }
    });
  });
});
// POST endpoint for login
app.post("/api/login", function (req, res) {
  return __awaiter(void 0, void 0, void 0, function () {
    var _a,
      email,
      password,
      userQuery,
      userResult,
      user,
      passwordMatch,
      error_2;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          (_a = req.body), (email = _a.email), (password = _a.password);
          if (!email || !password) {
            res.status(400).json({ error: "Email and password required" });
            return [2 /*return*/];
          }
          _b.label = 1;
        case 1:
          _b.trys.push([1, 4, , 5]);
          userQuery = "SELECT * FROM users WHERE LOWER(email) = $1";
          return [
            4 /*yield*/,
            pool.query(userQuery, [email.trim().toLowerCase()]),
          ];
        case 2:
          userResult = _b.sent();
          if (userResult.rowCount === 0) {
            res.status(401).json({ error: "Invalid credentials" });
            return [2 /*return*/];
          }
          user = userResult.rows[0];
          return [
            4 /*yield*/,
            bcrypt_1.default.compare(password, user.password),
          ];
        case 3:
          passwordMatch = _b.sent();
          if (!passwordMatch) {
            res.status(401).json({ error: "Invalid credentials" });
            return [2 /*return*/];
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
          return [3 /*break*/, 5];
        case 4:
          error_2 = _b.sent();
          console.error("Error during login:", error_2);
          res.status(500).json({ error: "Server error during login" });
          return [3 /*break*/, 5];
        case 5:
          return [2 /*return*/];
      }
    });
  });
});
// Error handling middleware (for å returnere JSON i alle tilfeller)
app.use(function (err, res) {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});
var PORT = process.env.PORT || 3001;
app.listen(PORT, function () {
  console.log("Server kj\u00F8rer p\u00E5 port ".concat(PORT));
});
