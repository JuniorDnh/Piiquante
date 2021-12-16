const express = require('express'); // Importation d'Express
const mongoose = require('mongoose'); // Importation de Mangoose
const Sauces = require('./models/sauces');
const userRoutes = require('./routes/user');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();


app.use ((req, res, next) => {
    console.log('Requête reçue !');
    next();
})
app.use((req, res, next) => {
    res.json({message: 'Votre requête a bien été reçue.'});
    next();
});
app.use('/api/sauces', Sauces);
app.use('/api/auth', userRoutes);
app.use(bodyParser.json());



// Connection au serveur MongoDB
mongoose.connect('mongodb+srv://DanhoIJ_p6:passwordp6@cluster0.028gc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


 



module.exports = app;