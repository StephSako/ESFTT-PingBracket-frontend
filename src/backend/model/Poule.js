const mongoose = require('mongoose')

const pouleSchema = mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  nb_person: Number,
  poules: [{
    joueurs: [{
      id: {
        type: mongoose.Types.ObjectId,
        ref: 'Joueurs'
      },
      points: Number
    }],
    id: Number
  }]
})

module.exports = mongoose.model('Poules', pouleSchema, "Poules")
