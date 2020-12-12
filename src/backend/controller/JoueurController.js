const express = require('express')
const router = express.Router()
const Joueur = require('../model/Joueur')
const Poule = require('../model/Poule')
const Tableau = require('../model/Tableau')
const mongoose = require('mongoose')
const _ = require('lodash');

// SPECIFIC PLAYER
router.route("/:id_joueur").get(function(req, res) {
  Joueur.findById(req.params.id_joueur).populate({path: 'tableaux', options: { sort: { nom: 1 } }}).then(joueur => res.status(200).json(joueur)).catch(err => res.send(err))
});

// ALL PLAYERS
router.route("/").get(function(req, res) {
  getPlayers().populate({path: 'tableaux', options: { sort: { nom: 1 } }}).then(joueurs => res.status(200).json(joueurs)).catch(err => res.send(err))
});

// OTHER PLAYERS
router.route("/unsubscribed/:tableau").get(function(req, res) {
  getPlayers({'tableaux' : {$ne: req.params.tableau}}).then(joueurs => res.status(200).json(joueurs)).catch(err => res.send(err))
});

// SPECIFIC TABLEAU'S PLAYERS
router.route("/subscribed/:tableau").get(function(req, res) {
  getPlayers({'tableaux' : {$all: [req.params.tableau]}}).then(joueurs => res.status(200).json(joueurs)).catch(err => res.send(err))
});

// (DOUBLE) GETSUBSCRIBED UNASSIGNED PLAYERS IN ANY BINOME OF SPECIFIC TABLEAU
router.route("/unassigned/:tableau").get(async function(req, res) {
  let assignedPlayers = await Poule.find({type: req.params.tableau}).populate('joueurs').catch(err => res.status(500).send(err))
  let assignedPlayersIds = assignedPlayers.map(poule => poule.joueurs).flat()
  let subscribedPlayersIds = await getPlayers({'tableaux' : {$all: [req.params.tableau]}}).catch(err => res.status(500).send(err))

  try {
    let subscribedUnassignedPlayers = _.differenceWith(subscribedPlayersIds, assignedPlayersIds,  (subscribed, assigned) => {return subscribed.equals(assigned)})
    res.status(200).json(subscribedUnassignedPlayers)
  } catch (e) {
    res.status(500).json(e)
  }
});

function getPlayers(option){
  return Joueur.find(option).sort({nom: 'asc'})
}

// SUBSCRIBE PLAYER
router.route("/subscribe").post(async function(req, res) {
  let searchedJoueur = await Joueur.findOne({nom: req.body.joueur.nom}).catch(err => res.send(err))
  if (searchedJoueur) {
    await Joueur.updateOne(
      {nom: req.body.joueur.nom},
      {$push: {tableaux: req.body.tableaux.map(tableau => tableau._id)}}
    ).catch(err => res.send(err))
  } else {
    const joueur = new Joueur({
      _id: new mongoose.Types.ObjectId(),
      nom: req.body.joueur.nom,
      tableaux: req.body.tableaux.map(tableau => tableau._id),
      classement: (req.body.joueur.classement ? req.body.joueur.classement : 0)
    })
    await joueur.save().catch(err => res.send(err))
  }

  try {
    // Un créé un binôme s'il n'y en a pas assez pour chaque tableau en format double où le joueur s'est inscrit
    for (let i = 0; i < req.body.tableaux.length; i++) {
      if (req.body.tableaux[i].format === 'double'){
        let nbJoueursInscrits = await Joueur.countDocuments({tableaux : {$all: [req.body.tableaux[i]]}}).catch(err => res.send(err))

        if (nbJoueursInscrits % 2 !== 0){
          let poule = new Poule({
            _id: new mongoose.Types.ObjectId(),
            type: req.body.tableaux[i]._id,
            locked: false,
            joueurs: []
          })
          await poule.save().catch(err => res.send(err))
        }
      }
    }
    res.status(200).json({message: 'OK'})
  } catch (err) {
    res.status(500).send(err)
  }
});

// EDIT PLAYER
router.route("/edit/:id_player").put(function(req, res) {
  const joueur = {
    nom: req.body.nom,
    classement: (req.body.classement ? req.body.classement : 0)
  }
  Joueur.updateOne({_id: req.params.id_player}, {$set: joueur}).then(result => res.status(200).json(result)).catch(err => res.send(err))
});

// UNSUBSCRIBE PLAYER
router.route("/unsubscribe/:id_player/:tableau").put(async function(req, res) {
  try {
    // On supprime le tableau du joueur
    await Joueur.updateOne({ _id: req.params.id_player}, {$pull: {tableaux: {$in: [req.params.tableau]}}}).catch(err => res.send(err))

    if (req.body.format === 'double'){
      // On supprime le joueur du double auquel il est assigné
      await Poule.updateMany({type: req.params.tableau}, {$pull: {joueurs: {$in: [req.params.id_player]}}}).catch(err => res.send(err))

      // On supprime le premier binôme vide trouvé si nécessaire
      let nbJoueursInscrits = await Joueur.countDocuments({tableaux : {$all: [req.params.tableau]}}).catch(err => res.send(err))
      let nbBinomes = await Poule.countDocuments({type : req.params.tableau}).catch(err => res.send(err))
      if (nbJoueursInscrits % 2 !== 0) nbJoueursInscrits++
      nbJoueursInscrits /= 2
      if (nbBinomes > nbJoueursInscrits) await Poule.deleteOne({ joueurs: { $exists: true, $size: 0 } })
    }
    res.status(200).json({message: 'No error'})
  } catch (e) {
    res.status(500).send(e)
  }
});

router.route("/delete/:id_player").delete(async function(req, res) {
  // On le supprime des poules existantes
  await Poule.updateMany({}, {$pull: {joueurs: {$in: [req.params.id_player]}}}).catch(err => res.send(err))

  // On le supprime des tableaux existants
  await Tableau.updateMany({objectRef: 'Joueurs'}, {$pull: {'matches.joueurs': {$in: [req.params.id_player]}}}).catch(err => res.send(err))

  // On le supprime définitivement
  Joueur.deleteOne({ _id: req.params.id_player}).then(result => res.status(200).json(result)).catch(err => res.status(500).send(err))
});

module.exports = router
