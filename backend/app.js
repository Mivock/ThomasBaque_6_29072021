require("dotenv").config({ path: "../.env" });
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const helmet = require("helmet");
const cookieSession = require("cookie-session");

const app = express();
const mongoose = require("mongoose");
mongoose.set("useCreateIndex", true); //pour supprimer message deprecation mongo dans la console

const url = process.env.DB_URL;

mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

app.use(helmet());

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

app.use(
  cookieSession({
    name: "session",
    secret: process.env.COOKIE_SECRET,
    cookie: {
      secure: true,
      httpOnly: true,
      domain: "http://localhost:3000",
    },
  })
);

const Sauce = require("./models/Sauce");
const User = require("./models/User");

app.use(bodyParser.json());
app.use("/images", express.static(path.join(__dirname, "images")));

const sauceRoutes = require("./routes/sauce");
app.use("/api/sauces", sauceRoutes);

const userRoutes = require("./routes/user");
app.use("/api/auth", userRoutes);

module.exports = app;
