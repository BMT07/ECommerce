const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userModel = Schema({
    nom: String,
    prenom: String,
    email: String,
    adresse: String,
    phone: String,
    naissance: Date

})

module.exports = mongoose.model('user', userModel)