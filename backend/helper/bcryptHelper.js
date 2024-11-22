const bcrypt = require("bcrypt");

// Helper function to hash the password
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10); // Generate a salt with 10 rounds
  return await bcrypt.hash(password, salt); // Return the hashed password
};

// Helper function to compare entered password with hashed password
const comparePasswords = async (enteredPassword, storedPassword) => {
  return await bcrypt.compare(enteredPassword, storedPassword); // Compare the entered password with the hashed one
};

module.exports = { hashPassword, comparePasswords };
