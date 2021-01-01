const express = require('express')
const router = express.Router()
const Parametre = require('../model/Parametre')
const mongoose = require('mongoose')

// GET FIELDS
router.route("/").get(function(req, res) {
  Parametre.find().then(parametres => res.status(200).json(parametres)).catch(err => res.send(err))
});

// EDIT SETTINGS
router.route("/edit").put(function(req, res) {
  Parametre.update({_id: req.params.id_tableau}, {$set: req.body}).then(result => res.status(200).json({message: result})).catch(err => res.status(500).json({error: err}))
});

// RESET THE SETTINGS
router.route("/reset").delete(async function(req, res) {
  res.json({message: 'OK'})
});

module.exports = router
