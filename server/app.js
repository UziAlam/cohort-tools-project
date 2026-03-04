// Devs Team - Import the provided files with JSON data of students and cohorts here:

const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const path = require("path");

const cohorts = require("./cohorts.json");
const students = require("./students.json");

// INITIALIZE EXPRESS APP
const app = express();

// MIDDLEWARE
// Research Team - Set up CORS middleware here (later):
const cors = require("cors");
app.use(cors());

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// ROUTES

// GET /docs - Serves API documentation HTML
app.get("/docs", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "docs.html"));
});

// GET /api/cohorts - Returns all cohorts (mock JSON)
app.get("/api/cohorts", (req, res) => {
  res.status(200).json(cohorts);
});

// GET /api/students - Returns all students (mock JSON)
app.get("/api/students", (req, res) => {
  res.status(200).json(students);
});

// START SERVER
const PORT = 5005;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});