const mongoose = require('mongoose')

const openSchema = mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  type: String,
  round: Number,
  matches: [{
    id: Number,
    joueurs: [{
      joueur: {
        type: String,
        ref: 'Joueurs'
      },
      winner: Boolean,
      round: Number
    }]
  }]
})

module.exports = mongoose.model('Open', openSchema, 'Open')
