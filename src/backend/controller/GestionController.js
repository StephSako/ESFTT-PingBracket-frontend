const express = require('express')
const router = express.Router()
const Gestion = require('../model/Gestion')
const mongoose = require('mongoose')

// ALL TABLEAU
router.route("/").get(function(req, res) {
  Gestion.find().then(tableaux => res.status(200).json(tableaux)).catch(err => res.send(err))
});

// CREATE TABLEAU
router.route("/create").post(async function(req, res) {
  const joueur = new Joueur({
    _id: new mongoose.Types.ObjectId(),
    nom: req.body.nom,
    classement: (req.body.classement ? req.body.classement : 0)
  })
  await joueur.save()
  Gestion.find().sort({classement: 'desc', nom: 'asc'}).then(joueurs => res.status(200).json(joueurs)).catch(err => res.send(err))
});

// EDIT TABLEAU
router.route("/edit/:id_player").put(async function(req, res) {
  const joueur = {
    nom: req.body.nom,
    classement: (req.body.classement ? req.body.classement : 0)
  }
  await Joueur.update({_id: req.params.id_player}, {$set: joueur})
  Gestion.find().sort({classement: 'desc', nom: 'asc'}).then(joueurs => res.status(200).json(joueurs)).catch(err => res.send(err))
});

// DELETE TABLEAU
router.route("/delete/:id_player").delete(async function(req, res) {
  await Joueur.remove({ _id: req.params.id_player})
  Gestion.find().sort({classement: 'desc', nom: 'asc'}).then(joueurs => res.status(200).json(joueurs)).catch(err => res.send(err))
});

module.exports = router
