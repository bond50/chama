const express = require('express');
const { getAvailableNumbers, getChosenNumbers, submitPickedNumber } = require("../controllers/availableNumbers");
const { requireSignin, authMiddleware } = require("../middlewares/auth"); // Import the middlewares

const router = express.Router();

// Define routes
router.get("/available",requireSignin, authMiddleware, getAvailableNumbers); // Route to get available numbers
router.get("/chosen", requireSignin, authMiddleware,getChosenNumbers); // Route to get chosen numbers
router.post("/pick",requireSignin, authMiddleware, submitPickedNumber); // Route to submit picked number

module.exports = router;
