const express = require('express'); // Importation d'Express

const app = express();
app.use ((req, res, next) => {
    console.log('Requête reçue !');
    next();
})

app.use((req, res, next) => {
    res.json({message: 'Votre requête a bien été reçue.'});
    next();
});

const mongoose = require('mongoose'); // Importation de Mangoose
// Connection au serveur MongoDB
mongoose.connect('mongodb+srv://DanhoIJ_p6:passwordp6@cluster0.028gc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const Sauces = require('./models/sauces');
app.use('/api/sauces', Sauces)  



module.exports = app;