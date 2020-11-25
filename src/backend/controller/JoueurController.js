const express = require('express')
const router = express.Router()
const Joueur = require('../model/Joueur')

// ALL PLAYERS
router.route("/").get(function(req, res) {
  Joueur.find().exec().then(joueurs => res.status(200).json(joueurs))
    .catch(err => res.send(err))
});

// EDIT PLAYER
router.route("/create").post(function(req, res) {
  Joueur.find().exec().then(joueurs => res.status(200).json(joueurs))
    .catch(err => res.send(err))
});

// EDIT PLAYER
router.route("/edit/:id_player").put(function(req, res) {
  Joueur.find().exec().then(joueurs => res.status(200).json(joueurs))
    .catch(err => res.send(err))
});

module.exports = router
