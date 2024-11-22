// models/availableNumber.js
const mongoose = require("mongoose");

const availableNumberSchema = new mongoose.Schema({
    number: {
        type: Number,
        required: true,
        unique: true,
    },
    chosen: { // Add a chosen flag to mark when a number is picked
        type: Boolean,
        default: false,
    },

});

const AvailableNumber = mongoose.model("AvailableNumber", availableNumberSchema);

module.exports = AvailableNumber;
