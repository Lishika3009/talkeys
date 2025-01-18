const mongoose = require("mongoose");
const { int } = require("three/tsl");

const eventSchema = new mongoose.Schema({
    name: {
    type: String,
    required: true,
    },
    category: {
    type: String,
    required: true,
    },
    mode: {
    type: String,
    enum: ["offline", "online"],
    required: true,
    },
    location: {
    type: String,
    required: function () {
        return this.mode === "offline";
    },
    },
    duration: {
    type: String,
    required: true,
    },
    ticketPrice: {
    type: Number,
    required: true,
    },
    totalSeats: {
    type: Number,
    required: true,
    },
    slots:{
    type :int,
    required: true,
    default: 1,
},
    visibility: {
    type: String,
    enum: ["public", "private"],
    required: true,
    },
    prizes: {
    type: String,
    },
    photographs: {
    type: [String], 
    },
    startDate: {
    type: Date,
    required: true,
    },
    startTime: {
    type: String,
    required: true,
    },
    endRegistrationDate: {
    type: Date,
    required: true,
    },
    eventDescription: {
    type: String,
    },
    });

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
