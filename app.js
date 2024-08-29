const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const collection = require("./config");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const session = require("express-session");
const app = express();
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
}));

mongoose.connect("mongodb+srv://efeborasaglam:Efe05St_Gallen@restfullapi.tex7t7x.mongodb.net/")
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err));

const itemSchema = {
    name: String,
    description: String,
    completed: { type: Boolean, default: false }
};

const Item = mongoose.model("Item", itemSchema);

// Middleware zum Überprüfen der Authentifizierung vor dem Zugriff auf "/"
app.use(function (req, res, next) {
    if (!req.session.user && req.originalUrl !== '/login' && req.originalUrl !== '/signup') {
        return res.redirect("/login");
    }
    next();
});

app.post("/update-status", function (req, res) {
    const itemId = req.body.itemId;
    const completed = req.body.completed === 'true';
    Item.findByIdAndUpdate(itemId, { completed: completed })
        .then(() => {
            console.log("Successfully updated status");
            res.redirect("/");
        })
        .catch(err => {
            console.error("Error updating status:", err);
            res.status(500).send("Internal Server Error");
        });
});

// Post-Methode zum Aktualisieren eines Elements
app.post("/", function (req, res) {
    const itemName = req.body.n;
    const itemDescription = req.body.description; // Beschreibung vom Formular holen
    const newItem = new Item({ name: itemName, description: itemDescription });
    newItem.save()
        .then(() => {
            res.redirect("/");
        })
        .catch(err => {
            console.error("Error saving item:", err);
            res.status(500).send("Internal Server Error");
        });
});

app.post("/update", function (req, res) {
    const itemId = req.body.itemId;
    const updatedName = req.body.updatedName;
    const updatedDescription = req.body.updatedDescription; // Beschreibung vom Formular holen
    Item.findByIdAndUpdate(itemId, { name: updatedName, description: updatedDescription })
        .then(() => {
            console.log("Successfully updated");
            res.redirect("/");
        })
        .catch(err => {
            console.error("Error updating item:", err);
            res.status(500).send("Internal Server Error");
        });
});

// Route zum Löschen einer Aufgabe
app.post("/delete", function (req, res) {
    const itemId = req.body.checkbox;
    Item.findByIdAndDelete(itemId)
        .then(() => {
            console.log("Successfully deleted");
            res.redirect("/");
        })
        .catch(err => {
            console.error("Error deleting item:", err);
            res.status(500).send("Internal Server Error");
        });
});

app.get("/", function (req, res) {
    Item.find({})
        .then(data => {
            res.render("list", { newListItem: data });
        })
        .catch(err => {
            console.error("Error:", err);
            res.status(500).send("Internal Server Error");
        });
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.post("/login", async (req, res) => {
    try {
        const check = await collection.findOne({ name: req.body.username });
        if (!check) {
            return res.send("User name cannot be found");
        }
        const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
        if (isPasswordMatch) {
            req.session.user = req.body.username;
            return res.redirect("/");
        } else {
            return res.send("Wrong password");
        }
    } catch {
        return res.send("Wrong details");
    }
});

app.get("/signup", (req, res) => {
    res.render("signup");
});

app.post("/signup", async (req, res) => {
    const data = {
        name: req.body.username,
        password: req.body.password
    }
    const existingUser = await collection.findOne({ name: data.name });
    if (existingUser) {
        return res.send("User already exists. Please choose a different username.")
    } else {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(data.password, saltRounds);
        data.password = hashedPassword;
        const userdata = await collection.insertMany(data);
        console.log(userdata);
        return res.redirect("/login");
    }
});

app.listen(3000, function () {
    console.log("listening on port 3000.");
});
