const express = require("express");
require("dotenv").config();
const cors = require("cors");
const dns = require("dns");

const dbConnection = require("./config/dbConnection.config");

const linkRoutes = require("./routes/link.routes");
const blogRoutes = require("./routes/blogs.routes");
const userRoutes = require("./routes/user.routes");
const summaryRoutes = require("./routes/summary.routes");

const app = express();

// DNS
dns.setServers(["1.1.1.1", "8.8.8.8"]);

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
dbConnection();

// Routes
app.use("/link", linkRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/auth", userRoutes);
app.use("/api", summaryRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("Blog App Backend is running successfully!");
});

// Start Server
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});