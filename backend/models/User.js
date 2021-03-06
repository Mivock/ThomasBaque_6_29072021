const mongoose = require("mongoose");
require("mongoose-type-email");
const uniqueValidator = require("mongoose-unique-validator");

//modèle user selon document en ressources, avec l'aide de mongoose-type-email pour verifier le format de l'email
const userSchema = mongoose.Schema({
  email: {
    email: mongoose.SchemaTypes.Email,
    type: String,
    required: [true, "Veuillez entrer votre adresse email !"],
    match: [
      /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
      "Veuillez entrer une adresse email valide !",
    ],
    unique: true,
  },
  password: { type: String, required: true },
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
