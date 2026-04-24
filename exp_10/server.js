const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const dotenv = require("dotenv");

// Load env variables
dotenv.config();

const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");
const studentRoutes = require("./routes/studentRoutes");

// Initialize express app
const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Serve static frontend files
app.use(express.static(path.join(__dirname, "public")));

// API Routes
app.use("/api/students", studentRoutes);


// Serve frontend for any non-API route
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Error handler middleware (must be last)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
  console.log(`🌐 Frontend: http://localhost:${PORT}`);
  console.log(`📡 API Base: http://localhost:${PORT}/api/students\n`);
});
