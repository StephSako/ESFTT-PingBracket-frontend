const express = require('express')
const router = express.Router()
const Open = require('../model/Open')
const mongoose = require('mongoose')

// ALL MATCHES
router.route("/").get(function(req, res) {
  Open.find().populate('matches.joueurs.id').then(matches => res.status(200).json({rounds: matches})).catch(err => res.send(err))
});

// Push player into a specific match
function setPlayerSpecificMatch(id_round, id_match, id_player){
  Open.updateOne(
    {
      round: id_round,
      "matches.id": id_match
    },
    {
      $push: {
        "matches.$[match].joueurs": {
          id: id_player,
          score: 0,
          winner: false
        }
      }
    },
    {
      arrayFilters: [
        { "match.id": id_match }
      ]
    }
  ).then(/*result => console.log(result)*/).catch(err => console.log(err))
}

// SET WINNER
router.route("/edit/round/:id_round/match/:id_match").put(async function(req, res) {
  // On définie :
  // - le joueur cliqué gagnant
  // - le match terminé
  await Open.updateOne(
    {
      round: req.params.id_round,
      "matches.id": req.params.id_match
    },
    {
      $set: {
        "matches.$[match].joueurs.$[joueur].winner": true
      }
    },
    {
      arrayFilters: [
        { "match.id": req.params.id_match },
        { "joueur.id": req.body.winnerId }
      ]
    }
  )

  if (Number(req.params.id_round) !== 1){
    // On définie :
    // - le joueur gagnant dans le prochain match
    // - les perdants des demies vont en match pour la 3ème place

    let idNextMatch = req.params.id_match
    if (idNextMatch % 2 !== 0) idNextMatch++
    idNextMatch = idNextMatch/2
    let idNextRound = req.params.id_round
    idNextRound--

    await setPlayerSpecificMatch(idNextRound, idNextMatch, req.body.winnerId)
  }

  if (Number(req.params.id_round) === 2 ) await setPlayerSpecificMatch(1, 2, req.body.looserId)

  res.json('ok')
});

// GENERATE BRACKET
router.route("/generate_bracket/:type").put(async function(req, res) {
  let id_match = 1
  for (let i = 0; i < req.body.length; i++) {
    for (let j = 0; j <= 1; j++) {
      console.log(id_match, req.body[i].joueurs[j].id._id)
      await setPlayerSpecificMatch(4, id_match, req.body[i].joueurs[j].id._id)
      if (j === 1) id_match ++
    }
  }
  res.json("ok")
});

module.exports = router
