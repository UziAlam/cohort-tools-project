// Devs Team - Import the provided files with JSON data of students and cohorts here:

const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const path = require("path");
const mongoose = require("mongoose");

const cohorts = require("./cohorts.json");
const students = require("./students.json");

// INITIALIZE EXPRESS APP
const app = express();

// MONGOOSE CONNECTION
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/cohort-tools-api";
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// MODELS
const Cohort = require("./models/Cohort");
const Student = require("./models/Student");
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

// GET /api/cohorts
app.get("/api/cohorts", (req, res) => {
  res.status(200).json(cohorts);
});

// GET /api/cohorts/:cohortId
app.get("/api/cohorts/:cohortId", (req, res) => {
  const cohortId = Number(req.params.cohortId);
  const foundCohort = cohorts.find((cohort) => cohort._id === cohortId);

  if (!foundCohort) {
    return res.status(404).json({ error: "Cohort not found" });
  }

  res.status(200).json(foundCohort);
});

// POST /api/cohorts
app.post("/api/cohorts", (req, res) => {
  const newCohort = req.body;

  const createdCohort = {
    _id: cohorts.length ? cohorts[cohorts.length - 1]._id + 1 : 1,
    ...newCohort
  };

  cohorts.push(createdCohort);

  res.status(201).json(createdCohort);
});

// PUT /api/cohorts/:cohortId
app.put("/api/cohorts/:cohortId", (req, res) => {
  const cohortId = Number(req.params.cohortId);
  const cohortIndex = cohorts.findIndex((cohort) => cohort._id === cohortId);

  if (cohortIndex === -1) {
    return res.status(404).json({ error: "Cohort not found" });
  }

  cohorts[cohortIndex] = { ...cohorts[cohortIndex], ...req.body };

  res.status(200).json(cohorts[cohortIndex]);
});

// DELETE /api/cohorts/:cohortId
app.delete("/api/cohorts/:cohortId", (req, res) => {
  const cohortId = Number(req.params.cohortId);
  const cohortIndex = cohorts.findIndex((cohort) => cohort._id === cohortId);

  if (cohortIndex === -1) {
    return res.status(404).json({ error: "Cohort not found" });
  }

  const deletedCohort = cohorts.splice(cohortIndex, 1);

  res.status(200).json({
    message: "Cohort deleted successfully",
    deletedCohort: deletedCohort[0]
  });
});

// GET /api/students
app.get("/api/students", (req, res) => {
  res.status(200).json(students);
});

// GET /api/students/:studentId
app.get("/api/students/:studentId", (req, res) => {
  const studentId = Number(req.params.studentId);
  const foundStudent = students.find((student) => student._id === studentId);

  if (!foundStudent) {
    return res.status(404).json({ error: "Student not found" });
  }

  res.status(200).json(foundStudent);
});

// GET /api/students/cohort/:cohortId
app.get("/api/students/cohort/:cohortId", (req, res) => {
  const cohortId = Number(req.params.cohortId);
  const cohortStudents = students.filter((student) => student.cohort === cohortId);

  res.status(200).json(cohortStudents);
});

// POST /api/students
app.post("/api/students", (req, res) => {
  const newStudent = req.body;

  const createdStudent = {
    _id: students.length ? students[students.length - 1]._id + 1 : 1,
    ...newStudent
  };

  students.push(createdStudent);

  res.status(201).json(createdStudent);
});

// PUT /api/students/:studentId
app.put("/api/students/:studentId", (req, res) => {
  const studentId = Number(req.params.studentId);
  const studentIndex = students.findIndex((student) => student._id === studentId);

  if (studentIndex === -1) {
    return res.status(404).json({ error: "Student not found" });
  }

  students[studentIndex] = { ...students[studentIndex], ...req.body };

  res.status(200).json(students[studentIndex]);
});

// DELETE /api/students/:studentId
app.delete("/api/students/:studentId", (req, res) => {
  const studentId = Number(req.params.studentId);
  const studentIndex = students.findIndex((student) => student._id === studentId);

  if (studentIndex === -1) {
    return res.status(404).json({ error: "Student not found" });
  }

  const deletedStudent = students.splice(studentIndex, 1);

  res.status(200).json({
    message: "Student deleted successfully",
    deletedStudent: deletedStudent[0]
  });
});

// ERROR HANDLING MIDDLEWARE
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

// START SERVER
const PORT = 5005;

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});