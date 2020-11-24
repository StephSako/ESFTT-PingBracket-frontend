const mongoose = require('mongoose')

const joueurSchema = mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  type: String,
  classement: Number,
  nom: String
})

module.exports = mongoose.model('Joueurs', joueurSchema, "Joueurs")
