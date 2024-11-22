// controllers/auth.js
const { requireSignin } = require('../middlewares/auth'); // Import the middleware
const User = require('../models/user'); // Import the User model

// Verify route - middleware will validate the JWT
exports.verifyToken = async (req, res) => {
    try {
        // At this point, the middleware `requireSignin` has validated the token
        const userId = req.auth.userId; // The `userId` is added by the middleware
        const user = await User.findById(userId); // Find the user based on the userId from the token

        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Send user data in the response to verify the user is authenticated
        res.status(200).json({ user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error verifying token' });
    }
};
