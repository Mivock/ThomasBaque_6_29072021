const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

const sauceCtrl = require("../controllers/sauce"); //chemin des controllers

//routes pour les sauces avec rajout des middleware (l'ordre a son importance)
router.post("/", auth, multer, sauceCtrl.createSauce);
router.get("/", auth, sauceCtrl.getAllSauces);
router.get("/:id", auth, sauceCtrl.getOneSauce);
router.put("/:id", auth, multer, sauceCtrl.modifySauce);
router.delete("/:id", auth, sauceCtrl.deleteSauce);
router.post("/:id/like", auth, sauceCtrl.setLikes);

module.exports = router;
