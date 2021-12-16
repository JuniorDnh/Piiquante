const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator')

const userShcema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true},
});

userShcema.plugin(uniqueValidator);

module.exports = mongoose.model ('User', userShcema);