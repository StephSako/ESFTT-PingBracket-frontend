const express = require('express')
const router = express.Router()
const Tableau = require('../model/Tableau')
const Joueur = require('../model/Joueur')
const Poule = require('../model/Poule')
const Bracket = require('../model/Bracket')
const Buffet = require('../model/Buffet')
const mongoose = require('mongoose')
const _ = require('lodash');

// ALL TABLEAU
router.route("/").get(function(req, res) {
  Tableau.find().sort({nom: 'asc', age_minimum: 'asc'}).then(tableaux => res.status(200).json(tableaux)).catch(() => res.status(500).send('Impossible de récupérer tous les tableaux'))
});

// PLAYER COUNT PER TABLEAUX
router.route("/player_count").get(function(req, res) {
  Joueur.aggregate([
    { $project: { tableaux: 1 } },
    { $unwind: '$tableaux' },
    { $group: { _id: '$tableaux', count: { $sum: 1 } } }
  ]).then(counts => res.status(200).json(_.chain(counts).keyBy('_id').mapValues('count').value())).catch(() => res.status(500).send('Impossible de récupérer les nombre de joueurs par tableau'))
});

// GET TABLEAUX ENABLED TO HOST PLAYERS FROM ANOTHER TABLEAU
router.route("/hostable/:tableauToHostId/:ageMinimum/:format/:poules").get(function(req, res) {
  Tableau.find({age_minimum: { $gte: req.params.ageMinimum}, poules: req.params.poules, format: req.params.format, _id: {$ne: req.params.tableauToHostId } }).sort({nom: 'asc'}).then(tableaux => res.status(200).json(tableaux)).catch(() => res.status(500).send('Impossible de récupérer les tableaux hébergeables de joueurs'))
});

// SPECIFIC TABLEAU
router.route("/:tableau").get(function(req, res) {
  Tableau.findById(req.params.tableau).then(tableau => res.status(200).json(tableau)).catch(() => res.status(500).send('Impossible de récupérer le tableau'))
});

// CREATE TABLEAU
router.route("/create").post(function(req, res) {
  const tableau = new Tableau({
    _id: new mongoose.Types.ObjectId(),
    nom: req.body.nom.toLowerCase(),
    format: req.body.format,
    poules: req.body.poules,
    consolante: req.body.consolante,
    age_minimum: req.body.age_minimum
  })
  tableau.save().then(result => res.status(200).json({message: result})).catch(() => res.status(500).send('Impossible de créer le tableau'))
});

// EDIT TABLEAU
router.route("/edit/:id_tableau").put(function(req, res) {
  Tableau.updateOne({_id: req.params.id_tableau}, {$set: req.body}).then(result => res.status(200).json({message: result})).catch(() => res.status(500).send('Impossible de modifier le tableau'))
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
    res.status(500).send('Impossible de réinitiliaser le tournoi')
  }
});

// DELETE SPECIFIC TABLEAU
router.route("/delete/:tableau_id").delete(async function(req, res) {
  try {
    await Bracket.deleteMany({tableau: req.params.tableau_id})
    await Poule.deleteMany({tableau: req.params.tableau_id})
    await Joueur.updateMany({}, {$pull: {tableaux: {$in: [req.params.tableau_id]}}})
    await Tableau.deleteOne({_id: req.params.tableau_id})
    res.status(200).json({message: 'Tableau supprimé'})
  } catch (e){
    res.status(500).send('Impossible de supprimer le tableau demandé')
  }
});

module.exports = router
