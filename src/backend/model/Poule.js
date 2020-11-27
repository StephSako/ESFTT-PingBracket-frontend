const mongoose = require('mongoose')

const pouleSchema = mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  joueurs: [{
    id: {
      type: mongoose.Types.ObjectId,
      ref: 'Joueurs'
    },
    points: Number
  }],
})

module.exports = mongoose.model('Poules', pouleSchema, "Poules")
