const mongoose = require('mongoose')

const gestionSchema = mongoose.Schema({
  tableaux: [{
    nom: String
  }]
},{ _id : false })

module.exports = mongoose.model('Gestion', gestionSchema, "Gestion")
