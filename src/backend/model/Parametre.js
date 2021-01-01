const mongoose = require('mongoose')

const parametreSchema = mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  date: Date,
  texte_debut: String,
  texte_fin: String
})

module.exports = mongoose.model('Parametres', parametreSchema, "Parametres")
