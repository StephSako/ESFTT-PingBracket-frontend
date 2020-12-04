const mongoose = require('mongoose')

const gestionSchema = mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  nom: String,
  format: String
},{ _id : false })

module.exports = mongoose.model('Gestion', gestionSchema, "Gestion")
