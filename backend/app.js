const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const mongoose = require("mongoose");
mongoose.set("useCreateIndex", true); //pour supprimer messag deprecation mongo dans la console

mongoose
  .connect(
    "mongodb+srv://OC-User:OC-Password@cluster0.4fi8p.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

const Sauce = require("./models/Sauce");
const User = require("./models/User");

app.use(bodyParser.json());
app.use("/images", express.static(path.join(__dirname, "images")));

const sauceRoutes = require("./routes/sauce");
app.use("/api/sauces", sauceRoutes);

const userRoutes = require("./routes/user");
app.use("/api/auth", userRoutes);

module.exports = app;
