const express = require('express')
const router = express.Router()
const Open = require('../model/Open')

// ALL MATCHES
router.route("/").get(function(req, res) {
  Open.find().populate('matches.joueurs.joueur').exec().then(matches => res.status(200).json({rounds: matches}))
    .catch(err => res.send(err))
});

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
        { "joueur.joueur": req.body.winnerId }
      ]
    }
  )

  if (Number(req.params.id_round) !== 1){
    // On définie :
    // - le joueur gagnant dans le prochain match
    // - les perdants des demies vont en match pour la 3ème place

    let idNextMatch = req.params.id_match;
    if (idNextMatch % 2 !== 0) { idNextMatch++; }
    idNextMatch = idNextMatch/2
    let idNextRound = req.params.id_round;
    idNextRound--;

    await Open.updateOne(
      {
        round: idNextRound,
        "matches.id": idNextMatch
      },
      {
        $push: {
          "matches.$[match].joueurs": {
            joueur: req.body.winnerId,
            score: 0,
            winner: false
          }
        }
      },
      {
        arrayFilters: [
          { "match.id": idNextMatch }
        ]
      }
    )
  }

  if (Number(req.params.id_round) === 2 ) {
    await Open.updateOne(
      {
        round: 1,
        "matches.id": 2
      },
      {
        $push: {
          "matches.$[match].joueurs": {
            joueur: req.body.looserId,
            score: 0,
            winner: false
          }
        }
      },
      {
        arrayFilters: [
          { "match.id": 2 }
        ]
      }
    )
  }

  res.json('ok')
});


module.exports = router
