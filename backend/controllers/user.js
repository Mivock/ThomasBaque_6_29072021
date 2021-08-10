const User = require("../models/User"); //import modèle user
const bcrypt = require("bcrypt"); //bcrypt pour hashage du mdp
const jwt = require("jsonwebtoken"); //jsonwebtoken afin de créer un token unique

//inscription
exports.signup = (req, res, next) => {
  bcrypt //hashage mdp qui sera utilisé pour la création du nouvel user
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        email: req.body.email,
        password: hash,
      });
      user
        .save()
        .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

//connection
exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email }) //recherche d'un user via l'email
    .then((user) => {
      if (!user) {
        //si user pas trouvé alors erreur
        return res.status(401).json({ error: "Utilisateur non trouvé !" });
      }
      bcrypt
        .compare(req.body.password, user.password) //comparaison des deux hash
        .then((valid) => {
          if (!valid) {
            //si il ne correspondent pas alors erreur
            return res.status(401).json({ error: "Mot de passe incorrect !" });
          }
          res.status(200).json({
            //si ils correspondent alors jwt intervient et permet de se connecter
            userId: user._id,
            token: jwt.sign(
              { userId: user._id },
              "RANDOM_TOKEN_SECRET_TO_REPLACE", //à remplacer pour déployement final
              {
                expiresIn: "24h",
              }
            ),
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};
