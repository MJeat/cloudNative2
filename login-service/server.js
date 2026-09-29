const dns = require('node:dns');
dns.setServers(['8.8.8.8', '1.1.1.1']); // Forces Node to use Google/Cloudflare DNS

require("dotenv").config();

const express = require("express");
const connectDB = require("./config/DBConnect");
const loginRoutes = require("./routes/loginRoutes");

const app = express();

app.use(express.json());

connectDB();

app.use("/auth", loginRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "Login Service is running"
    });
});

const PORT = process.env.PORT || 5002;

app.listen(PORT, () => {
    console.log(`Login Service running on port ${PORT}`);
});