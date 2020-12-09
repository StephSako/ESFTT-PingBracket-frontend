const express = require('express')
const router = express.Router()
const Joueur = require('../model/Joueur')
const mongoose = require('mongoose')

// ALL PLAYERS
router.route("/").get(function(req, res) {
  getAllPlayers().populate({path: 'tableaux', options: { sort: { nom: 1 } }}).then(joueurs => res.status(200).json(joueurs)).catch(err => res.send(err))
});

// OTHER PLAYERS
router.route("/unsubscribed/:tableau").get(function(req, res) {
  getAllPlayers({'tableaux' : {$ne: req.params.tableau}}).populate('tableaux').then(joueurs => res.status(200).json(joueurs)).catch(err => res.send(err))
});

// SPECIFIC TABLEAU'S PLAYERS
router.route("/subscribed/:tableau").get(function(req, res) {
  getAllPlayers({'tableaux' : {$all: [req.params.tableau]}}).populate('tableaux').then(joueurs => res.status(200).json(joueurs)).catch(err => res.send(err))
});

function getAllPlayers(option){
  return Joueur.find(option).sort({nom: 'asc'})
}

// CREATE PLAYER
router.route("/create").post(async function(req, res) {
  let searchedJoueur = await Joueur.findOne({nom: req.body.joueur.nom})
  if (searchedJoueur) {
    Joueur.updateOne(
      {nom: req.body.joueur.nom},
      {$push: {tableaux: req.body.tableaux}}
    ).then(result => res.status(200).json(result)).catch(err => res.send(err))
  } else {
    const joueur = new Joueur({
      _id: new mongoose.Types.ObjectId(),
      nom: req.body.joueur.nom,
      tableaux: req.body.tableaux,
      classement: (req.body.joueur.classement ? req.body.joueur.classement : 0)
    })
    joueur.save().then(result => res.status(200).json(result)).catch(err => res.send(err))
  }
});

// EDIT PLAYER
router.route("/edit/:id_player").put(function(req, res) {
  const joueur = {
    nom: req.body.nom,
    classement: (req.body.classement ? req.body.classement : 0),
    tableaux: req.body.tableaux
  }
  Joueur.updateOne({_id: req.params.id_player}, {$set: joueur}).then(result => res.status(200).json(result)).catch(err => res.send(err))
});

// UNSUBSCRIBE PLAYER
router.route("/unsubscribe/:id_player/tableau/:tableau").delete(async function(req, res) {
  Joueur.updateOne({ _id: req.params.id_player}, {$pull: {tableaux: {$in: [req.params.tableau]}}}).then(result => res.status(200).json(result)).catch(err => res.send(err))
});

// TODO DELETE PLAYER

module.exports = router
