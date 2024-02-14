const mongoose = require('mongoose')

const Schema = mongoose.Schema


const produitModel = Schema({
    nom: String,
    categorie: String,
    materiel: String,
    type: String,
    description: String,
    dimension_1: {
        value: Number,
        price: Number
    },
    dimension_2: {
        value: Number,
        price: Number
    },
    dimension_3: {
        value: Number,
        price: Number
    },
    time_1: Number,
    time_2: Number,
    time_3: Number

})

module.exports = mongoose.model('produit', produitModel)