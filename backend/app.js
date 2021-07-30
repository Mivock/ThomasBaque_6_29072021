const express = require("express");

const app = express();

app.use((req, res, next) => {
  console.log("test reçue");
  next();
});

app.use((req, res, next) => {
  res.status(201);
  next();
});

app.use((req, res, next) => {
  res.json({ message: "test requete reçue" });
  next();
});

app.use((req, res, next) => {
  console.log("test réponse envoyée");
});

module.exports = app;
