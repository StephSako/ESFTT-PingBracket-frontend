const mongoose = require('mongoose')

const gestionSchema = mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  nom: String,
  format: String,
  consolante: Boolean
},{ _id : false })

module.exports = mongoose.model('Gestion', gestionSchema, "Gestion")
