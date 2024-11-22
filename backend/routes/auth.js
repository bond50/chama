// routes/auth.js
const express = require('express');
const { verifyToken } = require('../controllers/auth'); // Import the verifyToken controller
const { requireSignin, authMiddleware} = require('../middlewares/auth'); // Import the requireSignin middleware

const router = express.Router();

// Route to verify the token and return the user data if valid
router.get("/verify", requireSignin, verifyToken);

router.get('/auth/verify-admin', requireSignin, authMiddleware, (req, res) => {
    if (req.profile.role === 'admin') {
        res.status(200).json({ message: 'Admin verified', role: req.profile.role });
    } else {
        res.status(403).json({ error: 'Access denied' });
    }
});


module.exports = router;
