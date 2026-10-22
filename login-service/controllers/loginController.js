const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const loginUser = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        // 1. Validate required fields
        if (!email || !password || !role) {
            return res.status(400).json({
                message: "Email, password and role are required"
            });
        }

        // 2. Validate role
        if (!["user", "admin"].includes(role)) {
            return res.status(400).json({
                message: "Role must be either user or admin"
            });
        }

        // 3. Find user by email
        const user = await User.findOne({
            email: email.toLowerCase().trim()
        });

        // 4. Check if email exists
        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // 5. Check role
        if (user.role !== role) {
            return res.status(403).json({
                message: "Invalid role for this account"
            });
        }

        // 6. Compare password with bcrypt hash
        const passwordMatched = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatched) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // 7. Create JWT
        const token = jwt.sign(
            {
                userId: user._id.toString(),
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN || "1h"
            }
        );

        // 8. Return JWT
        return res.status(200).json({
            message: "Login successful",
            token: token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone
            }
        });

    } catch (error) {
        console.error("Login error:", error);

        return res.status(500).json({
            message: "Server error during login"
        });
    }
};

module.exports = {
    loginUser
};