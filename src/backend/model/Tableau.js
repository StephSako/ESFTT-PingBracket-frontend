const mongoose = require('mongoose')

const tableauSchema = mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  type: String,
  objectRef: String,
  tableau: {
    type: mongoose.Types.ObjectId,
    ref: 'Gestion'
  },
  round: Number,
  matches: [{
    id: Number,
    round: Number,
    joueurs: [{
      _id: {
        type: mongoose.Types.ObjectId,
        refPath: 'objectRef'
      },
      winner: Boolean
    }]
  }]
},{ _id : false })

module.exports = mongoose.model('Tableaux', tableauSchema, 'Tableaux')
