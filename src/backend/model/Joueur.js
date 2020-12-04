const mongoose = require('mongoose')

const joueurSchema = mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  classement: Number,
  nom: String,
  tableaux: [{
      type: mongoose.Types.ObjectId,
      ref: 'Gestion'
  }]
},{ _id : false })

module.exports = mongoose.model('Joueurs', joueurSchema, "Joueurs")
