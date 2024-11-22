const mongoose = require("mongoose");
const {hashPassword, comparePasswords} = require("../helper/bcryptHelper"); // Import helper functions

// Define the schema for the user
const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true, // The name of the user is required
        },
        phoneNumber: {
            type: String,
            required: true, // Phone number is required
            unique: true, // Ensure the phone number is unique across users
        },
        assignedNumber: {
            type: Number,
            default: null, // The number will be assigned later, set to null initially
        },
        role: {
            type: String,
            enum: ['admin', 'user'], // Define roles: admin or user (can be expanded)
            default: 'user', // Default role is user
        },
        username: {
            type: String,
            unique: true,
            index: true,
        },
        password: {
            type: String,
            required: true, // Password is required
            minlength: [6, "Password must be at least 6 characters long"], // Password length validation
        },
        chosen: {
            type: Boolean,
            default: false // Track whether the user has chosen a number or not
        },
    },
    {timestamps: true} // Automatically manage createdAt and updatedAt timestamps
);

// Pre-save hook to encrypt password
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next(); // Only hash the password if it's new or modified

    try {
        this.password = await hashPassword(this.password); // Hash the password using the helper function
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare passwords for authentication
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await comparePasswords(enteredPassword, this.password); // Compare entered password with the hashed one using the helper function
};

// Create a model from the schema
const User = mongoose.model("User", userSchema);

module.exports = User;
