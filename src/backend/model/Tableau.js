const mongoose = require('mongoose')

const tableauSchema = mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  type: String,
  tableau: {
    type: mongoose.Types.ObjectId,
    ref: 'Gestion'
  },
  round: Number,
  matches: [{
    id: Number,
    joueurs: [{
      _id: {
        type: mongoose.Types.ObjectId,
        ref: 'Joueurs'
      },
      winner: Boolean
    }]
  }]
},{ _id : false })

module.exports = mongoose.model('Tableaux', tableauSchema, 'Tableaux')
