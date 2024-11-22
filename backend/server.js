// server.js

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');

require("dotenv").config(); // Load environment variables
const connectDB = require("./config/db");
const userRoutes = require("./routes/user");
const numberRoutes = require("./routes/availableNumber");
const authRoutes = require("./routes/auth");
const {join} = require("node:path");

const app = express();


// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true, // Allow cookies to be sent
}));
app.use(bodyParser.json());
app.use(cookieParser());

// Connect to MongoDB
connectDB();
// Serve static files from the React app
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(join(__dirname, '../frontend/build')));
}


app.get('*', (req, res) => {
    res.sendFile(join(__dirname, '../frontend/build/index.html'));
});
// Use the routes
app.use("/api/users", userRoutes);
app.use("/api/numbers", numberRoutes);
app.use("/api/auth", authRoutes);

// Start the server
const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
