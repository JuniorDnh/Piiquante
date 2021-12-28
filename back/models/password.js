const passwordValidator = require('password-validator');

const passwordSchema = new passwordValidator();

passwordSchema //On veut un mot de passe sécurisé, entre 8 et 50 caractères, contenant au moins une majuscule, une minucule, un chiffre.
.is().min(8)                                    
.is().max(50)                                  
.has().uppercase()                              
.has().lowercase()                             
.has().digits()                                
             
module.exports = passwordSchema;