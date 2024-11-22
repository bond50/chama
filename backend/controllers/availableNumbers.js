const AvailableNumber = require("../models/availableNumber"); // Import model for available numbers
const User = require("../models/user"); // Assuming you have a User model

const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
    return array;
};

const getAvailableNumbers = async (req, res) => {
    try {
        // Fetch available numbers that are not chosen
        const availableNumbers = await AvailableNumber.find({ chosen: false });

        // Shuffle the available numbers array
        const shuffledNumbers = shuffleArray(availableNumbers);

        res.json(shuffledNumbers); // Return the shuffled numbers
    } catch (error) {
        res.status(500).json({ message: "Error fetching available numbers" });
    }
};

// Controller function to get all chosen numbers
const getChosenNumbers = async (req, res) => {
    try {
        const chosenNumbers = await AvailableNumber.find({ chosen: true });
        res.json(chosenNumbers); // Return the chosen numbers
    } catch (error) {
        res.status(500).json({ message: "Error fetching chosen numbers" });
    }
};

// Controller function to submit the picked number

const submitPickedNumber = async (req, res) => {
    try {
        let { pickedNumber, userId } = req.body;

        // Fetch the user from the database
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Special cases from environment variables
        const specialCases = {
            [process.env.ARNEST_NO]: 12, // Always gets number 12
            [process.env.GALAVU_NO]: 14, // Always gets number 14
            [process.env.ANNE_NO]: 10,   // Always gets number 10
        };

        // Check if user has a special number
        if (specialCases[user.phoneNumber]) {
            const specialNumber = specialCases[user.phoneNumber];
            const isAvailable = await AvailableNumber.findOne({ number: specialNumber, chosen: false });

            if (isAvailable) {
                return await assignNumber(user, specialNumber, res);
            } else {
                return res.status(400).json({ message: `Number ${specialNumber} already picked` });
            }
        }

        // Prevent regular users from picking special numbers
        if ([12, 14, 10].includes(pickedNumber)) {
            pickedNumber = await getAvailableNumberExcluding([12, 14, 10]);
        }

        // Check availability and assign
        const isAvailable = await AvailableNumber.findOne({ number: pickedNumber, chosen: false });
        if (!isAvailable) {
            return res.status(400).json({ message: "Number not available or already chosen" });
        }

        return await assignNumber(user, pickedNumber, res);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error submitting picked number" });
    }
};

// Function to assign a number to a user
const assignNumber = async (user, number, res) => {
    user.assignedNumber = number;
    user.chosen = true;
    await user.save();

    await AvailableNumber.findOneAndUpdate({ number }, { chosen: true });

    res.json({
        message: `Number ${number} successfully assigned to user ${user.name}`,
        user,
    });
};

// Function to get the next available number excluding specific numbers
const getAvailableNumberExcluding = async (excludedNumbers) => {
    const number = await AvailableNumber.findOne({
        number: { $nin: excludedNumbers },
        chosen: false,
    });
    return number ? number.number : null;
};



module.exports = {
    getAvailableNumbers,
    getChosenNumbers,
    submitPickedNumber, // Export the new function
};
