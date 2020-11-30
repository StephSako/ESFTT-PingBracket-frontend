const mongoose = require('mongoose')

const tableauSchema = mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  type: String,
  tableau: String,
  round: Number,
  matches: [{
    id: Number,
    joueurs: [{
      id: {
        type: String,
        ref: 'Joueurs'
      },
      winner: Boolean
    }]
  }]
},{ _id : false })

module.exports = mongoose.model('Tableaux', tableauSchema, 'Tableaux')
