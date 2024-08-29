const mongoose = require("mongoose");
const connect = mongoose.connect("mongodb+srv://efeborasaglam:Efe05St_Gallen@restfullapi.tex7t7x.mongodb.net/");

// check db connection

connect.then(() => {
    console.log("Database connected Successfully");
})

.catch(() => {
    console.log("Database cannot be connected");
})

// Create a schmea
const LoginSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

// collection Part

const collection = new mongoose.model("users", LoginSchema);

module.exports = collection;