const express = require('express')
const router = express.Router()
const Stock = require('../model/Stock')
const mongoose = require('mongoose')

// GET ALL STOCK
router.route("/").get(function(req, res) {
  Stock.find().then(stocks => res.status(200).json(stocks)).catch(() => res.status(500).send('Impossible de récupérer le stock'))
});

// CREATE NEW STOCK
router.route("/create").post(function(req, res) {
  const stock = new Stock({
    _id: new mongoose.Types.ObjectId(),
    label: req.body.stock.label,
    stock: req.body.stock.stock
  })
  stock.save().then(() => res.status(200).json({message: 'Nouveau matériel ajouté'})).catch(() => res.status(500).send('Impossible de créer le nouveau matériel'))
});

// DELETE SPECIFIC STOCK
router.route("/delete/:stock_id").delete(function(req, res) {
  Stock.deleteOne({_id: req.params.stock_id}).then(() => res.status(200).json({message: 'Matériel supprimé'})).catch(() => res.status(500).send('Impossible de supprimer le matériel demandé'))
});

module.exports = router
