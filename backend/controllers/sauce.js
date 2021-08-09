const Sauce = require("../models/Sauce");
const fs = require("fs");

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });
  sauce
    .save()
    .then(() => res.status(201).json({ message: "Sauce enregistrée !" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
};

exports.modifySauce = (req, res, next) => {
  //find one sauce / if sauce.users id == decodeduser id token
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };
  Sauce.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then(() => res.status(200).json({ message: "Sauce modifiée !" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      const filename = sauce.imageUrl.split("/images")[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: "Sauce supprimée !" }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.setLikes = (req, res, next) => {
  if (req.body.like === -1) {
    //dans le cas d'un dislike
    Sauce.findOne({ _id: req.params.id }).then((sauce) => {
      if (sauce.usersDisliked.indexOf(req.body.userId) === -1) {
        Sauce.updateOne(
          { _id: req.params.id },
          {
            $push: { usersDisliked: req.body.userId },
            $inc: { dislikes: 1 },

            _id: req.params.id,
          }
        )
          .then(() => res.status(201).json({ message: "Sauce dislikée" }))
          .catch((error) => res.status(400).json({ error }));
      } else {
        res.status(400).json({ error: "Sauce déjà dislikée" });
      }
    });
  } else if (req.body.like === 1) {
    //dans le cas d'un like
    Sauce.findOne({ _id: req.params.id }).then((sauce) => {
      if (sauce.usersLiked.indexOf(req.body.userId) === -1) {
        Sauce.updateOne(
          { _id: req.params.id },
          {
            $push: { usersLiked: req.body.userId },
            $inc: { likes: 1 },

            _id: req.params.id,
          }
        )
          .then(() => res.status(201).json({ message: "Sauce likée" }))
          .catch((error) => res.status(400).json({ error }));
      } else {
        res.status(400).json({ error: "Sauce déjà likée" });
      }
    });
  } else {
    Sauce.findOne({ _id: req.params.id })
      .then((sauce) => {
        if (sauce.usersDisliked.indexOf(req.body.userId) !== -1) {
          Sauce.updateOne(
            { _id: req.params.id },
            {
              $pull: { usersDisliked: req.body.userId },
              $inc: { dislikes: -1 },

              _id: req.params.id,
            }
          )
            .then(() => res.status(201).json({ message: "Retour au neutre" }))
            .catch((error) => res.status(400).json({ error }));
        } else if (sauce.usersDisliked.indexOf(req.body.userId) !== 1) {
          Sauce.updateOne(
            { _id: req.params.id },
            {
              $pull: { usersLiked: req.body.userId },
              $inc: { likes: -1 },

              _id: req.params.id,
            }
          )
            .then(() => res.status(201).json({ message: "Retour au neutre" }))
            .catch((error) => res.status(400).json({ error }));
        }
      })
      .catch((error) => res.status(404).json({ error }));
  }
};
