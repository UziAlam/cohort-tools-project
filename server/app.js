// Devs Team - Import the provided files with JSON data of students and cohorts here:

const express = require("express");
const mongoose = require("mongoose");

// Conexión a MongoDB
mongoose.connect("mongodb://localhost:27017/cohort-tools-api")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const path = require("path");

const PORT = 5005;

// const cohorts = require("./cohorts.json"); // day 2 update
// const students = require("./students.json"); // day 2 update


// MONGOOSE MODELS
const cohortSchema = new mongoose.Schema({
  name: String,
  startDate: Date,
  endDate: Date,
  isPrivate: Boolean,
  isAnon: Boolean,
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
});

const studentSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  cohort: { type: mongoose.Schema.Types.ObjectId, ref: "Cohort" },
  github: String,
  linkedin: String,
  portfolio: String,
  image: String,
});

const Cohort = mongoose.model("Cohort", cohortSchema);
const Student = mongoose.model("Student", studentSchema);


// INITIALIZE EXPRESS APP - https://expressjs.com/en/4x/api.html#express
const app = express();


// MIDDLEWARE
// Research Team - Set up CORS middleware here:
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


// ROUTES - https://expressjs.com/en/starter/basic-routing.html
// Devs Team - Start working on the routes here:

// GET /docs - Serves API documentation HTML
app.get("/docs", (req, res) => {
  res.sendFile(__dirname + "/views/docs.html");
});

// GET /api/cohorts - Returns all cohorts from MongoDB
app.get("/api/cohorts", async (req, res) => {
  try {
    const cohorts = await Cohort.find();
    res.json(cohorts);
  } catch (err) {
    res.status(500).json({ error: "Error fetching cohorts" });
  }
});

// POST /api/cohorts - Creates a new cohort
app.post("/api/cohorts", async (req, res) => {
  try {
    const createdCohort = await Cohort.create(req.body);
    res.status(201).json(createdCohort);
  } catch (err) {
    res.status(400).json({ error: "Error creating cohort" });
  }
});

// GET /api/cohorts/:cohortId - Returns a specific cohort by id
app.get("/api/cohorts/:cohortId", async (req, res) => {
  try {
    const cohort = await Cohort.findById(req.params.cohortId);
    res.json(cohort);
  } catch (err) {
    res.status(500).json({ error: "Error fetching cohort" });
  }
});

// PUT /api/cohorts/:cohortId - Updates a specific cohort by id
app.put("/api/cohorts/:cohortId", async (req, res) => {
  try {
    const updatedCohort = await Cohort.findByIdAndUpdate(
      req.params.cohortId,
      req.body,
      { new: true }
    );
    res.json(updatedCohort);
  } catch (err) {
    res.status(400).json({ error: "Error updating cohort" });
  }
});

// DELETE /api/cohorts/:cohortId - Deletes a specific cohort by id
app.delete("/api/cohorts/:cohortId", async (req, res) => {
  try {
    await Cohort.findByIdAndDelete(req.params.cohortId);
    res.json({ message: "Cohort deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error deleting cohort" });
  }
});

// GET /api/students - Returns all students from MongoDB
app.get("/api/students", async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: "Error fetching students" });
  }
});

// POST /api/students - Creates a new student
app.post("/api/students", async (req, res) => {
  try {
    const createdStudent = await Student.create(req.body);
    res.status(201).json(createdStudent);
  } catch (err) {
    res.status(400).json({ error: "Error creating student" });
  }
});

// GET /api/students/:studentId - Returns a specific student by id
app.get("/api/students/:studentId", async (req, res) => {
  try {
    const student = await Student.findById(req.params.studentId);
    res.json(student);
  } catch (err) {
    res.status(500).json({ error: "Error fetching student" });
  }
});


// START SERVER
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});