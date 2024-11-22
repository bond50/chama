// seed.js

const mongoose = require("mongoose");
const connectDB = require("./config/db");
const { AvailableNumber } = require("./models/user");

connectDB(); // Use the connectDB function to establish the connection

const seedAvailableNumbers = async () => {
  try {
    // Check if numbers already exist in the database
    const count = await AvailableNumber.countDocuments();

    if (count === 0) {
      // If there are no numbers, seed the database with numbers 1-10
      const numbers = [];
      for (let i = 1; i <= 10; i++) {
        numbers.push({ number: i });
      }

      await AvailableNumber.insertMany(numbers);
      console.log("Available numbers seeded.");
    } else {
      console.log("Available numbers already seeded.");
    }

    // Close the DB connection after seeding
    mongoose.connection.close();
  } catch (err) {
    console.error("Error seeding available numbers:", err);
    mongoose.connection.close(); // Ensure connection is closed even if there's an error
  }
};

seedAvailableNumbers();
