const dns = require('node:dns');
dns.setServers(['8.8.8.8', '1.1.1.1']); // Forces Node to use Google/Cloudflare DNS

require("dotenv").config();

const express = require("express");
const connectDB = require("./config/DBConnect");
const registerRoutes = require("./routes/registerRoutes");

const app = express();

// Middleware
app.use(express.json());

// Database
connectDB();

// Routes
app.use("/register", registerRoutes);

// Health check
app.get("/", (req, res) => {
    res.json({
        message: "Registration Service is running"
    });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.log(`Registration Service running on port ${PORT}`);
});