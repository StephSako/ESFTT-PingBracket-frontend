const mongoose = require('mongoose')

const joueurSchema = mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  classement: Number,
  nom: String,
  tableaux: [{
    tableau: {
      type: mongoose.Types.ObjectId,
      ref: 'Gestion'
    }
  }]
})

module.exports = mongoose.model('Joueurs', joueurSchema, "Joueurs")
