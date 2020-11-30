const express = require('express')
const router = express.Router()
const Joueur = require('../model/Joueur')
const mongoose = require('mongoose')

// ALL PLAYERS
router.route("/").get(function(req, res) {
  Joueur.find().sort({classement: 'desc', nom: 'asc'}).then(joueurs => res.status(200).json(joueurs)).catch(err => res.send(err))
});

// CREATE PLAYER
router.route("/create").post(async function(req, res) {
  const joueur = new Joueur({
    _id: new mongoose.Types.ObjectId(),
    nom: req.body.nom,
    classement: (req.body.classement ? req.body.classement : 0)
  })
  await joueur.save()
  Joueur.find().sort({classement: 'desc', nom: 'asc'}).then(joueurs => res.status(200).json(joueurs)).catch(err => res.send(err))
});

// EDIT PLAYER
router.route("/edit/:id_player").put(async function(req, res) {
  const joueur = {
    nom: req.body.nom,
    classement: (req.body.classement ? req.body.classement : 0)
  }
  await Joueur.update({_id: req.params.id_player}, {$set: joueur})
  Joueur.find().sort({classement: 'desc', nom: 'asc'}).then(joueurs => res.status(200).json(joueurs)).catch(err => res.send(err))
});

// DELETE PLAYER
router.route("/delete/:id_player").delete(async function(req, res) {
  await Joueur.remove({ _id: req.params.id_player})
  Joueur.find().sort({classement: 'desc', nom: 'asc'}).then(joueurs => res.status(200).json(joueurs)).catch(err => res.send(err))
});

module.exports = router
