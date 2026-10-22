const bcrypt = require("bcryptjs");
const User = require("../models/User");

const registerUser = async (req, res) => {
    try {
        const { name, email, password, role, phone } = req.body;

        // 1. Validate required fields
        if (!name || !email || !password || !phone) {
            return res.status(400).json({
                message: "Name, email, password and phone are required"
            });
        }

        // 2. Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: "Invalid email format"
            });
        }

        // 3. Validate password length
        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters"
            });
        }

        // 4. Only allow user/admin roles
        const userRole = role || "user";

        if (!["user", "admin"].includes(userRole)) {
            return res.status(400).json({
                message: "Role must be either user or admin"
            });
        }

        // 5. Check if email already exists
        const existingUser = await User.findOne({
            email: email.toLowerCase().trim()
        });

        if (existingUser) {
            return res.status(409).json({
                message: "Email already registered"
            });
        }

        // 6. Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 7. Create new user
        const newUser = new User({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password: hashedPassword,
            role: userRole,
            phone: phone.trim()
        });

        // 8. Save to MongoDB
        const savedUser = await newUser.save();

        // 9. Return success
        return res.status(201).json({
            message: "User registered successfully",
            user: {
                id: savedUser._id,
                name: savedUser.name,
                email: savedUser.email,
                role: savedUser.role,
                phone: savedUser.phone,
                createdAt: savedUser.createdAt,
                updatedAt: savedUser.updatedAt
            }
        });

    } catch (error) {

        // MongoDB duplicate-key protection
        if (error.code === 11000) {
            return res.status(409).json({
                message: "Email already registered"
            });
        }

        console.error("Registration error:", error);

        return res.status(500).json({
            message: "Server error during registration"
        });
    }
};

module.exports = {
    registerUser
};