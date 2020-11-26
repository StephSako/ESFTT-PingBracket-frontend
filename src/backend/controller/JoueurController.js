const express = require('express')
const router = express.Router()
const Joueur = require('../model/Joueur')
const mongoose = require('mongoose')

// ALL PLAYERS
router.route("/").get(function(req, res) {
  Joueur.find().then(joueurs => res.status(200).json(joueurs)).catch(err => res.send(err))
});

// CREATE PLAYER
router.route("/create").post(function(req, res) {
  const joueur = new Joueur({
    _id: new mongoose.Types.ObjectId(),
    nom: req.body.nom,
    classement: req.body.classement,
    type: req.body.type
  })
  joueur.save().then(result => res.status(201).json(result)).catch(err => res.status(500).json({error: err}))
});

// EDIT PLAYER
router.route("/edit/:id_player").put(function(req, res) {
  const joueur = {
    nom: req.body.nom,
    classement: req.body.classement,
    type: req.body.type
  }
  Joueur.update({_id: req.params.id_player}, {$set: joueur}).then(joueurs => res.status(200).json(joueurs)).catch(err => res.send(err))
});

// DELETE PLAYER
router.route("/delete/:id_player").delete(function(req, res) {
  Joueur.remove({ _id: req.params.id_player}).then(result => res.status(200).json(result)).catch(err => res.status(500).json({err: err}))
});

module.exports = router
