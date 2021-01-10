const express = require('express')
const router = express.Router()
const Tableau = require('../model/Tableau')
const Joueur = require('../model/Joueur')
const Poule = require('../model/Poule')
const Bracket = require('../model/Bracket')
const Buffet = require('../model/Buffet')
const mongoose = require('mongoose')

// ALL TABLEAU
router.route("/").get(function(req, res) {
  Tableau.find().sort({nom: 'asc'}).then(tableaux => res.status(200).json(tableaux)).catch(err => res.send(err))
});

// SPECIFIC TABLEAU
router.route("/:tableau").get(function(req, res) {
  Tableau.findById(req.params.tableau).then(tableau => res.status(200).json(tableau)).catch(err => res.send(err))
});

// CREATE TABLEAU
router.route("/create").post(function(req, res) {
  const tableau = new Tableau({
    _id: new mongoose.Types.ObjectId(),
    nom: req.body.nom.toLowerCase(),
    format: req.body.format,
    consolante: req.body.consolante
  })
  tableau.save().then(result => res.status(200).json({message: result})).catch(err => res.status(500).json({error: err}))
});

// EDIT TABLEAU
router.route("/edit/:id_tableau").put(function(req, res) {
  Tableau.update({_id: req.params.id_tableau}, {$set: req.body}).then(result => res.status(200).json({message: result})).catch(err => res.status(500).json({error: err}))
});

// RESET THE TOURNAMENT
router.route("/reset").delete(async function(req, res) {
  try {
    await Bracket.deleteMany({})
    await Poule.deleteMany({})
    await Buffet.updateMany({}, { $set: { nb_moins_13_ans: 0, nb_plus_13_ans: 0, plats: [] } })
    await Joueur.deleteMany({})
    res.status(200).json({message: 'Tournoi remis à zéro ... prêt pour l\'année prochaine ;)'})
  } catch (e){
    res.status(500).json({message: e})
  }

});

module.exports = router
