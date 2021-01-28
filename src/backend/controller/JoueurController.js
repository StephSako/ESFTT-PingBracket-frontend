const express = require('express')
const router = express.Router()
const Joueur = require('../model/Joueur')
const Poule = require('../model/Poule')
const Binome = require('../model/Binome')
const Bracket = require('../model/Bracket')
const mongoose = require('mongoose')
const _ = require('lodash');

function getPlayers(option){
  return Joueur.find(option).sort({nom: 'asc'})
}

// SPECIFIC PLAYER
router.route("/:id_joueur").get(function(req, res) {
  Joueur.findById(req.params.id_joueur).populate({path: 'tableaux', options: { sort: { nom: 1 } }}).then(joueur => res.status(200).json(joueur)).catch(() => res.status(500).send('Impossible de récupérer le joueur demandé'))
});

// ALL PLAYERS
router.route("/").get(function(req, res) {
  getPlayers().populate({path: 'tableaux', options: { sort: { nom: 1 } }}).then(joueurs => res.status(200).json(joueurs)).catch(() => res.status(500).send('Impossible de récupérer tous les joueurs'))
});

// OTHER PLAYERS
router.route("/unsubscribed/:tableau").get(function(req, res) {
  getPlayers({'tableaux' : {$ne: req.params.tableau}}).then(joueurs => res.status(200).json(joueurs)).catch(() => res.status(500).send('Impossible de récupérer les joueurs non inscrits au tableau'))
});

// SPECIFIC TABLEAU'S PLAYERS
router.route("/subscribed/:tableau").get(function(req, res) {
  getPlayers({'tableaux' : {$all: [req.params.tableau]}}).then(joueurs => res.status(200).json(joueurs)).catch(() => res.status(500).send('Impossible de récupérer les joueurs inscrits au tableau'))
});

// (BINOME) SUBSCRIBED BUT UNASSIGNED PLAYERS FOR A SPECIFIC TABLEAU
router.route("/unassigned/:tableau").get(async function(req, res) {
  let assignedPlayers = await Binome.find({tableau: req.params.tableau}).populate('joueurs')
  let assignedPlayersIds = assignedPlayers.map(poule => poule.joueurs).flat()
  let subscribedPlayersIds = await getPlayers({'tableaux' : {$all: [req.params.tableau]}})

  try {
    let subscribedUnassignedPlayers = _.differenceWith(subscribedPlayersIds, assignedPlayersIds,  (subscribed, assigned) => { return subscribed.equals(assigned) })
    res.status(200).json(subscribedUnassignedPlayers)
  } catch (e) {
    res.status(500).send('Impossible de récupérer les joueurs inscrits non assignés au tableau')
  }
});

// SUBSCRIBE PLAYER
router.route("/create").post(async function(req, res) {
  let searchedJoueur = await Joueur.findOne({nom: req.body.joueur.nom})
  if (searchedJoueur) {
    await Joueur.updateOne(
      {nom: req.body.joueur.nom},
      {$push: {tableaux: req.body.tableaux.map(tableau => tableau._id)}}
    )
  } else {
    const joueur = new Joueur({
      _id: new mongoose.Types.ObjectId(),
      nom: req.body.joueur.nom,
      age: req.body.joueur.age,
      tableaux: req.body.tableaux.map(tableau => tableau._id),
      classement: (req.body.joueur.classement ? req.body.joueur.classement : 0)
    })
    await joueur.save()
  }

  try {
    // Un créé un binôme s'il n'y en a pas assez pour chaque tableau en format double où le joueur s'est inscrit
    for (let i = 0; i < req.body.tableaux.length; i++) {
      if (req.body.tableaux[i].format === 'double'){
        let nbJoueursInscrits = await Joueur.countDocuments({tableaux : {$all: [req.body.tableaux[i]]}})

        if (nbJoueursInscrits % 2 !== 0){
          let binome = new Binome({
            _id: new mongoose.Types.ObjectId(),
            tableau: req.body.tableaux[i]._id,
            joueurs: []
          })
          await binome.save()
        }
      }
    }
    res.status(200).json({message: 'OK'})
  } catch (err) {
    res.status(500).send('Impossible d\'inscrire le joueur au tableau')
  }
});

// EDIT PLAYER
router.route("/edit/:id_player").put(function(req, res) {
  const joueur = {
    nom: req.body.nom,
    age: req.body.age,
    classement: (req.body.classement ? req.body.classement : 0)
  }
  Joueur.updateOne({_id: req.params.id_player}, {$set: joueur}).then(result => res.status(200).json(result)).catch(() => res.status(500).send('Impossible de modifier le joueur'))
});

// UNSUBSCRIBE PLAYER
router.route("/unsubscribe/:id_player/:tableau").put(async function(req, res) {
  try {
    // On supprime le tableau du joueur
    await Joueur.updateOne({ _id: req.params.id_player}, {$pull: {tableaux: {$in: [req.params.tableau]}}})

    if (req.body.format === 'double'){
      // On supprime le joueur du binôme auquel il est assigné
      await Binome.updateMany({tableau: req.params.tableau}, {$pull: {joueurs: {$in: [req.params.id_player]}}})

      // On supprime le premier binôme vide en trop
      let nbMinBinomesNecessaires = await Joueur.countDocuments({tableaux : {$all: [req.params.tableau]}})
      let nbBinomes = await Binome.countDocuments({tableau : req.params.tableau})
      if (nbMinBinomesNecessaires % 2 !== 0) nbMinBinomesNecessaires++
      nbMinBinomesNecessaires /= 2
      if (nbBinomes > nbMinBinomesNecessaires) await Binome.deleteOne({ joueurs: { $exists: true, $size: 0 } })
    }
    res.status(200).json({message: 'No error'})
  } catch (e) {
    res.status(500).send('Impossible de désinscrire le joueur du tableau')
  }
});

// DELETE PLAYER
router.route("/delete/:id_player").delete(async function(req, res) {
  // On le supprime des tableaux existants
  await Bracket.updateMany({objectRef: 'Joueurs'}, {$pull: {'matches.0.joueurs': {_id: req.params.id_player}}})

  // On le supprime des poules existantes
  await Poule.updateMany({}, {$pull: {joueurs: {$in: [req.params.id_player]}}})

  // On le supprime des binômes existants
  await Binome.updateMany({}, {$pull: {joueurs: {$in: [req.params.id_player]}}})

  // On le supprime définitivement
  Joueur.deleteOne({ _id: req.params.id_player}).then(result => res.status(200).json(result)).catch(() => res.status(500).send('Impossible de supprimer le joueur'))
});

// MOVE ALL SUBSCRIBED PLAYERS IN ANOTHER TABLEAU
router.route("/move").put(async function(req, res) {
  try {
    await Joueur.updateMany({ tableaux: {
      $all : [req.body.previousTableauId],
      $nin: [ req.body.newTableauId ] }
      }, {$push: {tableaux: req.body.newTableauId}})
    await Joueur.updateMany({ tableaux: { $all : [req.body.previousTableauId]} }, {$pull: {tableaux: {$in: [req.body.previousTableauId]}}})
    res.status(200).json({message: 'Les joueurs ont été déplacés vers un autre tableau'})
  } catch (e) {
    res.status(500).send('Impossible de basculer les joueurs vers un autre tableau')
}
});

module.exports = router
