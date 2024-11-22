const express = require("express");
const {
    getAllUsers,
    assignNumberToUser,
    createUser,
    loginUser,
    getUserById
} = require("../controllers/user");
const { requireSignin, authMiddleware } = require("../middlewares/auth"); // Import the middlewares

const router = express.Router();

// Define routes

// Route to get all users (Requires authentication)
router.get("/", requireSignin, authMiddleware, getAllUsers);

// Route to fetch a user by ID (Requires authentication)
router.get("/:id", requireSignin, authMiddleware, getUserById); // Add this route

// Route to assign a number to a user (Requires authentication)
router.put("/users/:id", requireSignin, authMiddleware, assignNumberToUser);

// Route to create a new user (No authentication required)
router.post("/create", createUser);

// Route to login (No authentication required)
router.post("/login", loginUser);

module.exports = router;
