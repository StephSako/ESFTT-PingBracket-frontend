const mongoose = require('mongoose')

const joueurSchema = mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  classement: Number,
  nom: String,
  tableaux: Array
})

module.exports = mongoose.model('Joueurs', joueurSchema, "Joueurs")
