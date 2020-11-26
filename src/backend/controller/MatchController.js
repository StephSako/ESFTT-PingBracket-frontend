const express = require('express')
const router = express.Router()
const Open = require('../model/Open')

// ALL MATCHES
router.route("/").get(function(req, res) {
  Open.find().populate('matches.joueurs.joueur').exec().then(matches => res.status(200).json({rounds: matches}))
    .catch(err => res.send(err))
});

// SET WINNER
router.route("/edit/nextRound/:id_next_round/nextMatch/:id_next_match").put(function(req, res) {

  // On définie :
  //  - le match terminé
  Open.updateOne(
    {
      round: req.body.actualRound,
      "matches.id": req.body.actualIdMatch
    },
    {
      $set: {
        "matches.$.status": "finished"
      }
    }).exec().then(result => {
      if (result.nModified === 1) res.status(200).json(result)
      else res.send("error")
  }).catch(err => res.send(err))

  // On définie :
  //  - le joueur cliqué gagnant
  //  - l'autre joueur perdant
  Open.updateOne(
    {
      round: req.body.actualRound,
      "matches.id": req.body.actualIdMatch,
      "matches.joueurs.joueur": req.body.actualIdMatch
    },
    {
      $set: {
        "matches.$.status": "finished"
      }
    }).exec().then(result => {
    if (result.nModified === 1) res.status(200).json(result)
    else res.send("error")
  }).catch(err => res.send(err))
});

router.route("/search/nextRound/:id_next_round/nextMatch/:id_next_match").get(function(req, res) {
  Open.find({round: req.params.id_next_round}).populate('matches.joueurs.joueur').exec().then(matches => res.status(200).json({rounds: matches}))
    .catch(err => res.send(err))
});

module.exports = router
