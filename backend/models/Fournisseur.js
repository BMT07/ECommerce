const mongoose = require('mongoose')


const fournisseurModel = mongoose.Schema({
    nom: String,
    prenom: String,
    email: String,
    adresse: String,
    phone: String,
    naissance: Date

})

module.exports = mongoose.model('fournisseur', fournisseurModel)