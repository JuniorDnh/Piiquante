const bcrypt = require("bcrypt"); //Importation : bcrypt pour le cryptage des mdp
const jwt = require("jsonwebtoken"); //Importation : jsonwebtoken pour pouvoir créer et vérifier les tokens d'authentification
const cryptoJs = require("crypto-js"); //Importation : crypto-js pour pouvoir chiffrer les adresses email dans la BDD
const User = require("../models/user"); // Importation : le modèle user

//Enregistrement d'un nouvel utilisateur
exports.signup = (req, res, next) => {
  //Chiffrement de l'email avant de l'envoyer dans la BDD (ici avec le module HmacSHA256 de cryptoJs)
  const emailCryptoJs = cryptoJs
    .HmacSHA256(req.body.email, process.env.CRYPTOJS_EMAIL_KEY)
    .toString();
  bcrypt
    .hash(req.body.password, 10) //bcrypt va hasher le mdp du corps de la requête, en effectuant 10 tours de l'algorithme de hachage
    .then((hash) => {
      // On crée un nouvel utilisateur et enregistre le mdp hashé dans la BDD
      const user = new User({
        email: emailCryptoJs,
        password: hash,
      });
      user
        .save()
        .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

//Connexion d'un utilisateur existant
exports.login = (req, res, next) => {
  const emailCryptoJs = cryptoJs
    .HmacSHA256(req.body.email, process.env.CRYPTOJS_EMAIL_KEY)
    .toString();
  User.findOne({ email: emailCryptoJs }) //On cherche si un utilisateur de la BDD correspond a l'utilisateur entré dans l'appli
    .then((user) => {
      if (!user) {
        //si on n'a pas trouvé d'utilisateur correspondant
        return res.status(401).json({ error: "Utilisateur non trouvé !" }); //code 401 : non autorisé
      }
      bcrypt
        .compare(req.body.password, user.password) //bcrypt compare le hash du mdp associé à l'utilisateur et le hash du mdp entré dans l'appli
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({ error: "Mot de passe incorrect !" });
          }
          res.status(200).json({
            //on renvoie un userId et un token (valable 24h)
            userId: user._id,
            token: jwt.sign(
              { userId: user._id }, //données à encoder dans le token (payload)
              process.env.DB_TOKEN, //clé sercète pour l'encodage
              { expiresIn: "24h" }
            ),
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};
