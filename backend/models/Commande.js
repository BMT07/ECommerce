const mongoose = require('mongoose')
const Schema = mongoose.Schema

const commandeModel = Schema({
    name:String,
    numCommande: Number,
    dateCommande: Date,
    price: Number,
    nombreArticle:Number,
    produit: [{
        type: Schema.Types.ObjectId,
        ref: "produit"
    }],
    user: [{
        type: Schema.Types.ObjectId,
        ref: "user"
    }],


})

module.exports = mongoose.model('commande', commandeModel)