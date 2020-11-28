const mongoose = require('mongoose')

const openSchema = mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  type: String,
  round: Number,
  matches: [{
    id: Number,
    status: String,
    joueurs: [{
      joueur: {
        type: String,
        ref: 'Joueurs'
      },
      score: Number,
      winner: Boolean
    }]
  }]
})

module.exports = mongoose.model('Open', openSchema, 'Open')
