const Sauce = require("../models/sauce"); //Importation : le modèle Sauce
const fs = require("fs"); //Importation : le package file system de node, pour pouvoir modifier le système de fichiers (notamment pour accéder aux fonctions de suppression de fichiers)

// Créer une sauce
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce); //on parse pour pouvoir extraire l'objet JSON de notre sauce
  delete sauceObject._id; //on ôte l'id du champ de la requete avant de copier l'objet (on souhaite avoir l'id généré par mongoDB)
  const sauce = new Sauce({
    //on crée une nouvelle instance de notre modèle Sauce
    ...sauceObject, //opérateur spread = raccourci qui copie les champs du corps de la requete pour éviter de tout réécrire
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`, //on génère dynamiquement l'URL de l'image car le frontend ne la connait pas
  });
  sauce
    .save() // on appelle la méthode save pour enregistrer l'objet dans la BDD
    .then(() => res.status(201).json({ message: "Sauce créée!" })) //code 201 : création de ressource ok
    .catch((error) => res.status(400).json({ error }));
};

// Modifier une sauce
exports.modifySauce = (req, res, next) => {
  if (req.file) {
    //Image est présente dans la requête (donc si elle est modifiée)
    Sauce.findOne({ _id: req.params.id }) //on cherche l'objet pour récupérer l'URL de l'image afin d'en extraire son nom de fichier et pouvoir la supprimer
      .then((sauce) => {
        const filename = sauce.imageUrl.split("/images/")[1]; //on récupère l'élément de l'URL qui vient après /images/ et qui correspond au nom de fichier
        fs.unlink(`images/${filename}`, () => {
          // on appelle la fonction unlink de fs pour supprimer un fichier

          const sauceObject = {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get("host")}/images/${
              req.file.filename
            }`, //on génère l'URL de la nouvelle image
          };
          Sauce.updateOne(
            { _id: req.params.id },
            { ...sauceObject, _id: req.params.id }
          ) //on modifie l'objet dont l'id = l'id envoyé dans les paramètres de la requête
            .then(() => res.status(200).json({ message: "Sauce modifiée!" }))
            .catch((error) => res.status(400).json({ error }));
        });
      })
      .catch((error) => res.status(500).json({ error }));
  } else {
    // Il n'y a pas d'image dans la requête (donc si l'image n'est pas modifiée)
    const sauceObject = { ...req.body };
    Sauce.updateOne(
      { _id: req.params.id },
      { ...sauceObject, _id: req.params.id }
    ) //on modifie l'objet dont l'id = l'id envoyé dans les paramètres de la requête
      .then(() => res.status(200).json({ message: "Sauce modifiée!" }))
      .catch((error) => res.status(400).json({ error }));
  }
};

// Supprimer une sauce
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id }) //avant de supprimer l'objet, on le cherche pour récupérer l'URL de l'image afin d'en extraire le nom du fichier et pouvoir le supprimer
    .then((sauce) => {
      if (sauce.userId !== req.user) {  // on compare l'id de l'auteur de la sauce et l'id de l'auteur de la requête
        res.status(401).json({message: "Action non autorisée"});  // si ce ne sont pas les mêmes id = code 401: unauthorized.
        return sauce;
      }
      const filename = sauce.imageUrl.split("/images/")[1]; //on récupère le nom de fichier
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id }) // Supprime qu'une seule sauce
          .then(() => res.status(200).json({ message: "Sauce supprimée!" }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
};

// Afficher une sauce
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error })); //erreur 404 : objet non trouvé
};

// Afficher toutes les sauces
exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces)) //code 200 : requête ok
    .catch((error) => res.status(400).json({ error }));
};

// Like ou Dislike une sauce
exports.likeDislikeSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      switch (req.body.like) {
        case 1: //utilisateur like une sauce
          Sauce.updateOne(
            { _id: req.params.id },
            { $inc: { likes: +1 }, $push: { usersLiked: req.body.userId } }
          ) // màj sauce: on incrémente de 1 le nombre de likes et on ajoute l'userId au tableau usersLiked
            .then((sauce) => res.status(200).json({ message: "+1 !" }))
            .catch((error) => res.status(400).json({ error }));
          break;

        case 0: //utilisateur annule son like ou son dislike
          if (sauce.usersLiked.includes(req.body.userId)) {
            //si l'userId se trouve déjà dans le tableau usersLiked,
            Sauce.updateOne(
              { _id: req.params.id },
              { $inc: { likes: -1 }, $pull: { usersLiked: req.body.userId } }
            )
              .then((sauce) => {
                res.status(200).json({ message: "Plus de vote !" });
              })
              .catch((error) => res.status(400).json({ error }));
          } else if (sauce.usersDisliked.includes(req.body.userId)) {
            //si l'userId se trouve déjà dans le tableau usersDisliked,
            Sauce.updateOne(
              { _id: req.params.id },
              {
                $inc: { dislikes: -1 },
                $pull: { usersDisliked: req.body.userId },
              }
            )
              .then((sauce) => {
                res.status(200).json({ message: "Plus de vote !" });
              })
              .catch((error) => res.status(400).json({ error }));
          }
          break;

        case -1: //utilisateur dislike une sauce
          Sauce.updateOne(
            { _id: req.params.id },
            {
              $inc: { dislikes: +1 },
              $push: { usersDisliked: req.body.userId },
            }
          )
            .then((sauce) => res.status(200).json({ message: "-1 !" }))
            .catch((error) => res.status(400).json({ error }));
          break;
      }
    })
    .catch((error) => res.status(404).json({ error })); //erreur 404 : objet non trouvé
};
