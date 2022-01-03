const jwt = require('jsonwebtoken'); //Importation : jsonwebtoken pour pouvoir créer et vérifier les tokens d'authentification

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]; //Token récupéré
    const decodedToken = jwt.verify(token, process.env.DB_TOKEN); //Token décodé
    const userId = decodedToken.userId; //userId décodé
    if (req.body.userId && req.body.userId !== userId) {
      throw 'User ID invalide!'; //erreur si l'userId de la requête est différent de l'userId récupéré
    } else {
      req.token = token;  
      req.user = userId;
      next();
    }
  } catch {
    res.status(401).json({error: error | 'Requête non authentifiée!' });
  }
};