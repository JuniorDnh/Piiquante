
const regexEmail = /^[a-zA-Z0-9._\-]+@[a-zA-Z0-9._\-]+\.[a-zA-Z]+$/ 

module.exports = (req, res, next) => {
        if (!regexEmail.test(req.body.email)) { 
            res.status(400).json({ message: "Veuillez entrer une adresse email valide. Ex: Mon-adresse123@mail.fr"});
        } else {
            next(); 
        }
};

