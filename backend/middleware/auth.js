const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  //exportation du middleware auth
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET_TO_REPLACE"); //token devant correspondre à celui du login
    const userId = decodedToken.userId;
    if (req.body.userId && req.body.userId !== userId) {
      //si userId different alors erreur
      throw "Identifiant utilisateur invalide";
    } else {
      req.body.decodedToken = decodedToken;
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error("Invalid request!"),
    });
  }
};
