const mongoose = require('mongoose')

const stockSchema = mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  labek: String,
  stock: Number,
  pendingOrdering: Boolean,
  lastDateOrder: Date
})

module.exports = mongoose.model('Stocks', stockSchema, "Stocks")
