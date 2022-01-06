const express = require('express'); // Importation : le framework express pour simplifier le développement de notre API
const router = express.Router(); //Création d'un routeur avec express

sauceCtrl = require('../controllers/sauce'); //Implémente les contrôleurs sauce
const auth = require('../middleware/auth'); // Importation : notre middleware d'authentification
const multer = require('../middleware/multer-config'); //Importation : notre middleware de configuration de multer, pour gérer les fichiers envoyés par les utilisateurs

const inputVerification = require('../middleware/input-verif');

router.post('/', auth, multer, inputVerification, sauceCtrl.createSauce); //enregistrer une nouvelle sauce - multer est ajouté après auth, pour que l'authentification reste nécessaire pour ajouter une image
router.put('/:id', auth, multer, inputVerification, sauceCtrl.modifySauce);//modifier une sauce existante
router.delete('/:id', auth, sauceCtrl.deleteSauce);//supprimer une sauce
router.get('/:id', auth, sauceCtrl.getOneSauce);//retrouver une sauce dans la BDD, par son identifiant
router.get('/', auth, sauceCtrl.getAllSauces);//envoyer un tableau de toutes les sauces de la BDD 
router.post('/:id/like', auth, sauceCtrl.likeDislikeSauce); //aimer ou ne pas aimer une sauce


module.exports = router; //on exporte le routeur pour l'importer sur app.js