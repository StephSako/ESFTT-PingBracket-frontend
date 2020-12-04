const express = require('express')
const router = express.Router()
const Gestion = require('../model/Gestion')
const mongoose = require('mongoose')

// ALL TABLEAU
router.route("/").get(function(req, res) {
  Gestion.find().then(tableaux => res.status(200).json(tableaux)).catch(err => res.send(err))
});

// CREATE TABLEAU
router.route("/create").post(function(req, res) {
  const tableau = new Gestion({
    _id: new mongoose.Types.ObjectId(),
    nom: req.body.nom,
    classement: (req.body.classement ? req.body.classement : 0)
  })
  tableau.save().then(result => res.status(200).json({message: result})).catch(err => res.status(500).json({error: err}))
});

// EDIT TABLEAU
router.route("/edit/:id_tableau").put(function(req, res) {
  Gestion.update({_id: req.params.id_tableau}, {$set: req.body}).then(result => res.status(200).json({message: result})).catch(err => res.status(500).json({error: err}))
});

// DELETE TABLEAU
router.route("/delete/:id_tableau").delete(function(req, res) {
  Gestion.remove({ _id: req.params.id_tableau}).then(result => res.status(200).json({message: result})).catch(err => res.status(500).json({error: err}))
});

module.exports = router
