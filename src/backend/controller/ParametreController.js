const express = require('express')
const router = express.Router()
const Parametre = require('../model/Parametre')
const mongoose = require('mongoose')

// GET FIELDS
router.route("/").get(function(req, res) {
  Parametre.findOne().then(parametres => res.status(200).json(parametres)).catch(err => res.send(err))
});

// EDIT SETTINGS
router.route("/edit/:id_parametres").put(function(req, res) {
  console.log(req.body.parametres)
  Parametre.updateOne({_id: req.params.id_parametres}, {$set: req.body.parametres}).then(() => res.status(200).json({message: 'Paramètres modifiés'})).catch(() => res.status(500).json({error: 'Erreur lors de la modification des paramètres'}))
});

// RESET THE SETTINGS
router.route("/reset").delete(async function(req, res) {
  res.json({message: 'OK'})
});

module.exports = router
