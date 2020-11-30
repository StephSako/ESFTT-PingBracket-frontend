const express = require('express')
const router = express.Router()
const Tableau = require('../model/Tableau')

// ALL MATCHES
router.route("/:tableau").get(function(req, res) {
  Tableau.find({tableau: req.params.tableau}).populate('matches.joueurs.id').then(matches => res.status(200).json({rounds: matches})).catch(err => res.send(err))
});

// Push player into a specific match
async function setPlayerSpecificMatch(id_round, id_match, id_player, tableau){
  await Tableau.updateOne(
    {
      round: id_round,
      tableau: tableau,
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
  )
}

// SET WINNER
router.route("/edit/:tableau/round/:id_round/match/:id_match").put(async function(req, res) {
  // On définie :
  // - le joueur cliqué comme gagnant
  // - le match comme "terminé"
  await Tableau.updateOne(
    {
      round: req.params.id_round,
      tableau: req.params.tableau,
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
  ).catch(err => res.status(500).json({error: err}))

  if (Number(req.params.id_round) !== 1){
    // On définie :
    // - le joueur gagnant dans le prochain match
    // - les perdants des demies vont en match pour la 3ème place

    let idNextMatch = req.params.id_match
    if (idNextMatch % 2 !== 0) idNextMatch++
    idNextMatch = idNextMatch/2
    let idNextRound = req.params.id_round
    idNextRound--

    try {
      await setPlayerSpecificMatch(idNextRound, idNextMatch, req.body.winnerId, req.params.tableau)
    } catch(err) {
      res.status(500).json({error: err})
    }
  }

  if (Number(req.params.id_round) === 2 ){
    try {
      await setPlayerSpecificMatch(1, 2, req.body.looserId, req.params.tableau)
    } catch(err) {
      res.status(500).json({error: err})
    }
  }

  res.status(200).json({message: "No error"})
});

// GENERATE BRACKET
router.route("/generate/:tableau").put(async function(req, res) {
  let id_match = 1

  try {
    for (let i = 0; i < req.body.length; i++) {
      for (let j = 0; j <= 1; j++) {
        await setPlayerSpecificMatch(4, id_match, req.body[i].joueurs[j].id._id, req.params.tableau)
        if (j === 1) id_match ++
      }
    }
    res.status(200).json({message: "No error"})
  } catch(err) {
    res.status(500).json({error: err})
  }
});

// RESET BRACKET
router.route("/reset/:tableau").get(function(req, res) {
  Tableau.updateMany(
    {
      tableau: req.params.tableau
    },
    {
      $set: {
        "matches.$[].joueurs": []
      }
    }, {multi:true}
  ).then(result => res.status(200).json(result)).catch(err =>res.status(500).json({error: err}))
});

module.exports = router
