const mongoose = require('mongoose')

const pouleSchema = mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  type: {
    type: mongoose.Types.ObjectId,
    ref: 'Tableaux'
  },
  locked: Boolean,
  joueurs: [{
      type: mongoose.Types.ObjectId,
      ref: 'Joueurs'
  }],
},{ _id : false })

module.exports = mongoose.model('Poules', pouleSchema, "Poules")
