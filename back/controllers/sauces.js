const Sauces = require('../models/sauces');

// Créer une sauce
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce ({ 
    ...sauceObject, 
    imageUrl : `${req.protocol}://${req.get('host')}/images/${req.file.filename}` 
  });
  sauce.save() 
    .then(() => res.status(201).json ({message : "Sauce créée!"})) 
    .catch(error => res.status(400).json({error}));
};

// Modifier une sauce
exports.modifySauce = (req, res, next) => {

};

//Supprimer une sauce
exports.deleteSauce = (req, res, next) => {

};

// Selectionner une sauce
exports.getOneSauce = (req, res, next) => {

};

// Selectionner toutes les sauces
exports.getAllSauces = (req, res, next) => {

};

// Like ou Dislike une sauce
exports.LikeDislikeSauce = (req, res, next) => {

};