const mongoose = require('mongoose')

const openSchema = mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  type: String,
  matches: [{
    id: Number,
    status: String,
    round: Number,
    joueurs: [{
      joueur: {
        type: mongoose.Types.ObjectId,
        ref: 'Joueurs'
      },
      score: Number,
      winner: Boolean
    }]
  }]
})

module.exports = mongoose.model('Open', openSchema, 'Open')
