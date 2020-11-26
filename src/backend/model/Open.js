const mongoose = require('mongoose')

const openSchema = mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  type: String,
  matches: [{
    id: Number,
    joueurs: [{
      joueur: {
        type: mongoose.Types.ObjectId,
        ref: 'Joueurs'
      },
      score: Number,
      winner: Boolean
    }]
  }],
  round: Number
})

module.exports = mongoose.model('Open', openSchema, 'Open')
