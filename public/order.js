const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    user: {
        email: String,
        username: String
    },
    polygon: {
        coordinates: [[{ lat: Number, lng: Number }]],
        area: String,
        perimeter: String
    },
    searchType: String,
    turnaroundTime: String,
    additionalOptions: {
        vodafone: Boolean,
        virginMedia: Boolean,
        councils: Boolean
    },
    status: {
        type: String,
        enum: ["Pending", "Processing", "Completed"], // ✅ Ensures only these values are stored
        default: "Pending"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Order", OrderSchema);
