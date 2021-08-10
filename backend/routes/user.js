const express = require("express");
const router = express.Router();

const userCtrl = require("../controllers/user"); //chemin des controllers

//routes pour user avec rajout des middleware
router.post("/signup", userCtrl.signup);
router.post("/login", userCtrl.login);

module.exports = router;
