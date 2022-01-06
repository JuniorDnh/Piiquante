//routes sauce

const express = require('express'); // on importe le framework express pour simplifier le développement de notre API
const router = express.Router(); //on crée un routeur avec express

saucesCtrl = require('../controllers/sauce'); //on implémente les contrôleurs sauce
const auth = require('../middleware/auth'); // on importe notre middleware d'authentification
const multer = require('../middleware/multer-config'); //on importe notre middleware de configuration de multer, pour gérer les fichiers envoyés par les utilisateurs

const inputVerification = require('../middleware/input-verif');

router.post('/', auth, multer, inputVerification, saucesCtrl.createSauce); //enregistrer une nouvelle sauce - multer est ajouté après auth, pour que l'authentification reste nécessaire pour ajouter une image
router.put('/:id', auth, multer, inputVerification, saucesCtrl.modifySauce);//modifier une sauce existante
router.delete('/:id', auth, saucesCtrl.deleteSauce);//supprimer une sauce
router.get('/:id', auth, saucesCtrl.getOneSauce);//retrouver une sauce dans la BDD, par son identifiant
router.get('/', auth, saucesCtrl.getAllSauces);//envoyer un tableau de toutes les sauces de la BDD 
router.post('/:id/like', auth, saucesCtrl.likeDislikeSauce); //aimer ou ne pas aimer une sauce


module.exports = router; //on exporte le routeur (pour l'importer sur app.js)