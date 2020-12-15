const express = require('express')
const router = express.Router()
const Tableau = require('../model/Tableau')
const Poule = require('../model/Poule')
const mongoose = require('mongoose')

const NB_MATCHES_ROUND         = { "7": 64, "6": 32, "5": 16, "4": 8, "3": 4, "2": 2, "1": 2 }
const ORDRE_SOIXANTEQUATREIEME = [1, 128, 65, 64, 3, 96, 97, 32, 17, 112, 81, 48, 49, 80, 113, 16, 9, 120, 73, 56, 41, 88, 105, 24, 25, 104, 89, 40, 57, 72, 121, 8, 5, 124, 69, 60, 37, 92, 101, 28, 21, 108, 85, 44, 53, 76, 117, 12, 13, 116, 77, 52, 45, 84, 109, 20, 29, 100, 93, 36, 61, 68, 125, 4, 3, 126, 67, 62, 35, 94, 99, 30, 19, 110, 83, 46, 51, 78, 115, 14, 11, 118, 75, 54, 3, 86, 107, 22, 27, 102, 91, 38, 59, 70, 123, 6, 7, 122, 71, 58, 39, 90, 103, 26, 23, 106, 87, 42, 55, 74, 119, 10, 15, 114, 79, 50, 47, 82, 111, 18, 31, 98, 95, 34, 63, 66, 127, 2]
const ORDRE_TRENTEDEUXIEME     = [1, 64, 33, 32, 17, 48, 49, 16, 9, 56, 41, 24, 25, 40, 57, 8, 5, 60, 37, 28, 21, 44, 53, 12, 13, 52, 45, 20, 29, 36, 61, 4, 3, 62, 35, 30, 19, 46, 51, 14, 11, 54, 43, 22, 27, 38, 59, 6, 7, 58, 39, 26, 23, 42, 55, 10, 15, 50, 47, 18, 31, 34, 63, 2]
const ORDRE_SEIZIEME           = [1, 32, 17, 16, 9, 24, 25, 8, 5, 28, 21, 12, 13, 20, 29, 4, 3, 30, 19, 14, 11, 22, 27, 6, 7, 26, 23, 10, 15, 18, 31, 2]
const ORDRE_HUITIEME           = [1, 16, 9, 8, 5, 12, 13, 4, 3, 14, 11, 6, 7, 10, 15, 2]
const ORDRE_QUART              = [1, 8, 5, 4, 3, 6, 7, 2]
const ORDRE_DEMI               = [1, 4, 3, 2]

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// GET BRACKET OF SPECIFIC TABLEAU
router.route("/:tableau/:phase").get(function(req, res) {
  Tableau.find({tableau: req.params.tableau, phase: req.params.phase}).populate('tableau').populate({
    path: 'matches.joueurs._id',
    populate: { path: 'joueurs' }
  }).sort({round: 'desc'}).then(matches => res.status(200).json({rounds: matches})).catch(err => res.send(err))
});

// Push player into a specific match
async function setPlayerSpecificMatch(id_round, id_match, id_player, tableau, phase){
  await Tableau.updateOne(
    {
      round: id_round,
      tableau: tableau,
      phase: phase,
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
router.route("/edit/:tableau/:phase/:id_round/:id_match").put(async function(req, res) {
  // On définie :
  // - le joueur cliqué comme gagnant
  // - le match comme "terminé"
  await Tableau.updateOne(
    {
      round: req.params.id_round,
      tableau: req.params.tableau,
      phase: req.params.phase,
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
  )

  // Pour tous les matches sauf la finale, le gagnant évolue au prochain match
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
      await setPlayerSpecificMatch(idNextRound, idNextMatch, req.body.winnerId, req.params.tableau, req.params.phase)
    } catch(err) {
      res.status(500).json({error: err})
    }
  }

  // S'il s'agit des demies-finale, on assigne les perdants en petite finale
  if (Number(req.params.id_round) === 2 ){
    try {
      await setPlayerSpecificMatch(1, 2, req.body.looserId, req.params.tableau, req.params.phase)
    } catch(err) {
      res.status(500).json({error: err})
    }
  }

  res.status(200).json({message: "No error"})
});

// GENERATE BRACKET
router.route("/generate/:tableau/:phase").put(async function(req, res) {
  // On supprime tous les matches
  await Tableau.deleteMany({ tableau: req.params.tableau, phase: req.params.phase})

  let option
  if (req.body.format === 'double') option = {type: req.params.tableau, joueurs: { $size: 2 } }
  else option = {type: req.params.tableau}
  let poules = await Poule.find(option)

  // On calcule combien de rounds sont nécessaires en fonction du nombre de joueurs qualifiés / binômes
  let nbQualified = 0, nbRounds, rankOrderer
  if (req.body.format === 'simple') poules.forEach(poule => nbQualified += poule.joueurs.slice((req.params.phase === 'finale' ? 0 : 2), (req.params.phase === 'finale' ? 2 : 4)).length)
  else nbQualified = poules.length

  if (nbQualified > 64){
    nbRounds = 7
    rankOrderer = ORDRE_SOIXANTEQUATREIEME
  }
  else if (nbQualified > 32){
    nbRounds = 6
    rankOrderer = ORDRE_TRENTEDEUXIEME
  }
  else if (nbQualified > 16){
    nbRounds = 5
    rankOrderer = ORDRE_SEIZIEME
  }
  else if (nbQualified > 8){
    nbRounds = 4
    rankOrderer = ORDRE_HUITIEME
  }
  else if (nbQualified > 4){
    nbRounds = 3
    rankOrderer = ORDRE_QUART
  }
  else{
    nbRounds = 2
    rankOrderer = ORDRE_DEMI
  }

  try {
    // On initialise tous les matches du bracket
    for (let i = nbRounds; i > 0; i--) {
      let matches = []
      for (let j = 1; j <= NB_MATCHES_ROUND[i]; j++) {
        matches.push({
          id: j,
          round: i,
          joueurs: []
        })
      }

      // On créé le document de la rencontre
      const tableau = new Tableau({
        _id: new mongoose.Types.ObjectId(),
        type: (i !== 1 ? 'Winnerbracket' : 'Final'),
        objectRef: (req.body.format === 'double' ? 'Poules' : 'Joueurs'),
        tableau: req.params.tableau,
        round: i,
        phase: req.params.phase,
        matches: matches
      })
      await tableau.save()
    }

    let qualified = [], id_match = 1

    // On créé la liste des joueur/binômes qualifiés
    if (req.body.format === 'simple') {
      for (let i = 0; i < poules.length; i++) {
        qualified = qualified.concat(poules[i].joueurs.slice((req.params.phase === 'finale' ? 0 : 2), (req.params.phase === 'finale' ? 2 : 4)))
      }
    } else qualified = shuffle(poules.map(poule => poule._id)) // On mélange les binômes aléatoirement

    // On assigne les matches aux joueurs/binômes
    for (let i = 0; i < rankOrderer.length; i++) {
      await setPlayerSpecificMatch(nbRounds, id_match, qualified[(req.body.format === 'simple' ? rankOrderer[i]-1 : i)], req.params.tableau, req.params.phase)

      if (i % 2 && i !== 0 && req.body.format === 'simple') id_match ++ // On incrémente le n° du match tous les 2 joueurs/binômes
      else if (req.body.format === 'double') {
        id_match ++
        if (i === (rankOrderer.length/2)-1) id_match = 1
      }
    }

    res.status(200).json({message: "No error"})
  } catch(err) {
    res.status(500).json({error: err})
  }
});

module.exports = router
