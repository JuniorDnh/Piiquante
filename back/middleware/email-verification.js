
const regexEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

module.exports = (req, res, next) => {
        if (!regexEmail.test(req.body.email)) { 
            res.status(400).json({ message: "Merci de renseigner un email valide. (format: Abc@example.com)"});
        } else {
            next(); 
        }
};

