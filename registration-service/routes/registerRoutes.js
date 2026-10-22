const express = require("express");

const router = express.Router();

const {
    registerUser
} = require("../controllers/registerController");

router.post("/userregister", registerUser);

module.exports = router;