const mongoose = require('mongoose')

const openSchema = mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  type: String,
  matches: Array
})

module.exports = mongoose.model('Open', openSchema, 'Open')
