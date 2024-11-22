const jwt = require("jsonwebtoken");
const User = require("../models/user");
const AvailableNumber = require("../models/availableNumber");
const {comparePasswords} = require("../helper/bcryptHelper");

// Create a new user with no assigned number initially
const createUser = async (req, res) => {
    try {
        const {name, phoneNumber} = req.body;

        // Validate phone number format
        if (!/^[0-9]{10}$/.test(phoneNumber)) {
            return res.status(400).json({message: "Phone number must be 10 digits long"});
        }

        // Check if the phone number already exists
        const existingUser = await User.findOne({phoneNumber});
        if (existingUser) {
            return res.status(400).json({message: "User with that Phone number already exists.Dont add a user twice because it will interfere with number generation"});
        }

        // Create the user with no assigned number (null or 0)
        const newUser = new User({
            name,
            phoneNumber,
            username: phoneNumber, // Set the phone number as the username
            password: phoneNumber, // Set the phone number as the password (encrypted later)
            assignedNumber: null, // No number assigned initially
        });

        // Save the new user to the database
        await newUser.save();

        // After saving, update the available numbers model
        const userCount = await User.countDocuments(); // Get total users after addition

        // Generate a new sequential number for the AvailableNumber model
        const totalUsers = await User.countDocuments();
        const newNumber = new AvailableNumber({
            number: totalUsers, // Assign based on user count
            chosen: false, // Default to not chosen
        });

        // Save the available number
        await newNumber.save();
        res.status(201).json({message: 'User added successfully'});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Error creating user"});
    }
};


// Get all users
const getAllUsers = async (req, res) => {
    try {
        // Fetch users excluding the password field
        const users = await User.find().select('-password'); // '-password' excludes the password field

        res.json(users);
    } catch (error) {
        res.status(500).json({message: "Error fetching users"});
    }
};


// Assign a number to a user
const assignNumberToUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const {number} = req.body;

        // Check if the number exists in the AvailableNumber model
        const availableNumber = await AvailableNumber.findOne({number});

        if (!availableNumber) {
            return res.status(400).json({message: "Number not available"});
        }

        // Assign the number to the user
        const user = await User.findByIdAndUpdate(userId, {assignedNumber: number}, {new: true});

        // Remove the number from the AvailableNumber model (no longer available)
        await AvailableNumber.findByIdAndDelete(availableNumber._id);

        res.json(user); // Return the updated user with the assigned number
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Error assigning number to user"});
    }
};

// User login and JWT generation
// Example loginUser controller
const loginUser = async (req, res) => {

    try {
        const { username, password } = req.body;

        // Find user by username
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }


        // Compare entered password with hashed password
        const isPasswordValid = await comparePasswords(password, user.password);


        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid password" });
        }

        // Create JWT token
        const payload = { userId: user._id };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });

        // Set the token as a cookie
        res.cookie("token", token, {
            expires: new Date(Date.now() + 3600000), // 1 hour expiry
            httpOnly: true, // Ensure it cannot be accessed by JavaScript
            secure: process.env.NODE_ENV === "production",
            path: '/',
        });

        res.status(200).json({
            message: "Login successful",
            token,
            assignedNumber: user.assignedNumber,
            userId:user._id
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error logging in" });
    }
};
const getUserById = async (req, res) => {
    try {
        const userId = req.params.id; // Extract user ID from route parameter

        // Fetch the user from the database
        const user = await User.findById(userId).select('-password'); // Exclude password

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user); // Return the user details
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching user" });
    }
};


module.exports = {
    createUser,
    getAllUsers,
    assignNumberToUser,
    loginUser,
    getUserById
};
