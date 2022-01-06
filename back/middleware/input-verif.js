const regexInput = /^[a-zA-ZÀàÉé0-9]+[a-zA-ZÀàÉéèêôï0-9.\-\+\ \,\!\?\'\/]+$/ 
//ici on accepte les lettres min ou maj, les chiffres, les ., - et espaces

module.exports = (req, res, next) => {
        if (!regexInput.test(req.body.name)) { 
            res.status(400).json({ message: "Merci de donner un nom à votre sauce (n'utilisez pas de caractères spéciaux)."}); 
        } else if (!regexInput.test(req.body.manufacturer)) {
            res.status(400).json({ message: "Merci d'indiquer le fabricant de cette sauce (n'utilisez pas de caractères spéciaux)."});
        } else if (!regexInput.test(req.body.description)) {
            res.status(400).json({ message: "Merci de décrire cette sauce (n'utilisez pas de caractères spéciaux)."});
        } else if (!regexInput.test(req.body.mainPepper)) {
            res.status(400).json({ message: "Veuillez indiquer le principal ingrédient piquant de votre sauce (n'utilisez pas de caractères spéciaux)."}); 
        } else {
            next(); 
        }
};

