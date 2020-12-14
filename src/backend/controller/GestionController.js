const express = require('express')
const router = express.Router()
const Gestion = require('../model/Gestion')
const Joueur = require('../model/Joueur')
const Poule = require('../model/Poule')
const Tableau = require('../model/Tableau')
const mongoose = require('mongoose')

// ALL TABLEAU
router.route("/").get(function(req, res) {
  Gestion.find().sort({nom: 'asc'}).then(tableaux => res.status(200).json(tableaux)).catch(err => res.send(err))
});

// SPECIFIC TABLEAU
router.route("/:tableau").get(function(req, res) {
  Gestion.findById(req.params.tableau).then(tableau => res.status(200).json(tableau)).catch(err => res.send(err))
});

// CREATE TABLEAU
router.route("/create").post(function(req, res) {
  const tableau = new Gestion({
    _id: new mongoose.Types.ObjectId(),
    nom: req.body.nom.toLowerCase(),
    format: req.body.format,
    consolante: req.body.consolante
  })
  tableau.save().then(result => res.status(200).json({message: result})).catch(err => res.status(500).json({error: err}))
});

// EDIT TABLEAU
router.route("/edit/:id_tableau").put(function(req, res) {
  Gestion.update({_id: req.params.id_tableau}, {$set: req.body}).then(result => res.status(200).json({message: result})).catch(err => res.status(500).json({error: err}))
});

// RESET THE TOURNAMENT
router.route("/reset").delete(async function(req, res) {
  try {
    // On désinscrit tous les joueurs de tous les tableaux
    await Joueur.updateMany({}, {$set: {tableaux: []}}, {multi:true})
    await Poule.deleteMany({})
    await Tableau.deleteMany({})
    res.status(200).json({message: 'Tournoi remis à zéro ... prêt pour l\'année prochaine ;)'})
  } catch (e){
    res.status(500).json({message: e})
  }

});

module.exports = router
