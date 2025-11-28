require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((error) => console.error("❌ Error:", error));

// Import models
const Task = require("./models/Task");
const Session = require("./models/Session");

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "FocusTools API",
    status: "Running",
    endpoints: {
      tasks: "/api/tasks",
      sessions: "/api/sessions",
    },
  });
});

// ----- TASK ROUTES -----

// Create a task
app.post("/api/tasks", async (req, res) => {
  try {
    const task = new Task(req.body);
    const saved = await task.save();
    res.json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all tasks
app.get("/api/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single task by ID
app.get("/api/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    res.json(task);
  } catch (err) {
    res.status(404).json({ error: "Task not found" });
  }
});

// Update task by ID
app.put("/api/tasks/:id", async (req, res) => {
  try {
    const updated = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete task
app.delete("/api/tasks/:id", async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// ----- SESSION ROUTES -----

// Create a session
app.post("/api/sessions", async (req, res) => {
  try {
    const session = new Session(req.body);
    const saved = await session.save();
    res.json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all sessions
app.get("/api/sessions", async (req, res) => {
  try {
    const sessions = await Session.find().populate("taskId");
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
