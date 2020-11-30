const mongoose = require('mongoose')

const openSchema = mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  type: String,
  round: Number,
  matches: [{
    id: Number,
    joueurs: [{
      id: {
        type: String,
        ref: 'Joueurs'
      },
      winner: Boolean,
      round: Number
    }]
  }]
},{ _id : false })

module.exports = mongoose.model('Open', openSchema, 'Open')
