const express = require('express')
const router = express.Router()
const Open = require('../model/Open')

// ALL MATCHES
router.route("/").get(function(req, res) {
  Open.find().populate('matches.joueurs.joueur').exec().then(matches => res.status(200).json({rounds: matches}))
    .catch(err => res.send(err))
});

// SET WINNER
router.route("/edit/nextRound/:id_next_round/nextMatch/:id_next_match").put(async function(req, res) {

  // On définie :
  // - le joueur cliqué gagnant
  // - le match terminé
  await Open.updateOne(
    {
      round: req.body.actualRound,
      matches: {
        "$elemMatch": {
          id: req.body.actualIdMatch
        }
      }
    },
    {
      $set: {
        "matches.$[match].joueurs.$[joueur].winner": true,
        "matches.$[match].status": "finished"
      }
    },
    {
      arrayFilters: [
        { "match.id": req.body.actualIdMatch },
        { "joueur.joueur": req.body.winnerId }
      ]
    }
  )

  // On définie :
  // - le joueur gagnant dans le prochain match
  Open.updateOne(
    {
      round: req.body.actualRound,
      matches: {
        "$elemMatch": {
          id: req.body.actualIdMatch
        }
      }
    },
    {
      $set: {
        "matches.$[match].joueurs.$[joueur].winner": true,
        "matches.$[match].status": "finished"
      }
    },
    {
      arrayFilters: [
        { "match.id": req.body.actualIdMatch },
        { "joueur.joueur": req.body.winnerId }
      ]
    }
  ).then(result => res.json(result)).catch(err => res.send(err))
});

router.route("/search/nextRound/:id_next_round/nextMatch/:id_next_match").get(function(req, res) {
  console.log(req.params)
  Open.find(
    {
      round: req.params.id_next_round,
      "matches.id": req.params.id_next_match
    }).populate('matches.joueurs.joueur').exec().then(matches => res.status(200).json(matches))
    .catch(err => res.send(err))
});

module.exports = router
