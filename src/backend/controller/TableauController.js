const express = require('express')
const router = express.Router()
const Tableau = require('../model/Tableau')
const Poule = require('../model/Poule')
const mongoose = require('mongoose')

const NB_MATCHES_ROUND = { "4": 8, "3": 4, "2": 2, "1": 2 }

// GET BRACKET OF SPECIFIC TABLEAU
router.route("/:tableau").get(function(req, res) {
  Tableau.find({tableau: req.params.tableau}).populate('tableau').populate({
    path: 'matches.joueurs._id',
    populate: { path: 'joueurs' }
  }).sort({round: 'desc'}).then(matches => res.status(200).json({rounds: matches})).catch(err => res.send(err))
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
          _id: id_player,
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
        { "joueur._id": req.body.winnerId }
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
  await Tableau.deleteMany({ tableau: req.params.tableau})
  let poules = await Poule.find({type: req.params.tableau})
  let count = 0
  let nbRounds = 0
  poules.forEach(poule => count += poule.joueurs.length); // TODO
  if (count >= 9) nbRounds = 4
  else if (count >= 5) nbRounds = 3
  else nbRounds = 2

  try {
    for (let i = nbRounds; i > 0; i--) {
      let matches = []
      for (let j = 1; j <= NB_MATCHES_ROUND[i]; j++) {
        matches.push({
          id: j,
          round: i,
          joueurs: []
        })
      }

      const tableau = new Tableau({
        _id: new mongoose.Types.ObjectId(),
        type: (i !== 1 ? 'Winnerbracket' : 'Final'),
        objectRef: (req.body.format === 'double' ? 'Poules' : 'Joueurs'),
        tableau: req.params.tableau,
        round: i,
        matches: matches
      })
      await tableau.save()
    }

    let id_match = 1
    for (let i = 0; i < poules.length; i++) {
      if (req.body.format === 'simple') {
        for (let j = 0; j <= 1; j++) { // On prend les 2 premiers de la poule
          if (poules[i].joueurs[j]) await setPlayerSpecificMatch(4, id_match, poules[i].joueurs[j]._id, req.params.tableau).catch(err => res.status(500).json({error: err}))
          if (j === 1) id_match ++ // On incrémente le n° de match tous les 2 joueurs
        }
      }
      else {
        await setPlayerSpecificMatch(4, id_match, poules[i]._id, req.params.tableau).catch(err => res.status(500).json({error: err}))
        if (i % 2 !== 0) id_match ++ // On incrémente le n° de match tous les 2 joueurs/poules
      }
    }
    res.status(200).json({message: "No error"})
  } catch(err) {
    res.status(500).json({error: err})
  }
});

module.exports = router
