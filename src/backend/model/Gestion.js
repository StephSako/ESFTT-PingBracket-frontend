const mongoose = require('mongoose')

const gestionSchema = mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  nom: String,
  format: String
})

module.exports = mongoose.model('Gestion', gestionSchema, "Gestion")
