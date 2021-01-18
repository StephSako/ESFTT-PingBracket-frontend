const express = require('express')
const router = express.Router()
const Poule = require('../model/Poule')
const Joueur = require('../model/Joueur')
const mongoose = require('mongoose')

// ALL POULES
router.route("/:tableau").get(function(req, res) {
  Poule.find({tableau: req.params.tableau}).populate('joueurs').populate('tableau').then(poules => res.status(200).json(poules)).catch(() => res.status(500).send('Impossible de récupérer la poule du tableau'))
});

// UPDATE SPECIFIC POULE
router.route("/edit/simple/:id_poule").put(function(req, res) {
  Poule.updateOne({_id: req.params.id_poule}, {
    $set: {
      joueurs: req.body
    }
  }).then(() => res.json({message: "La poule a été mise à jour"})).catch(() => res.status(500).send('Impossible de modifier la poule'))
});

// UPDATE SPECIFIC DOUBLE BINOME
router.route("/edit/binome/:idJoueur").put(async function(req, res) {
  try {
    // On supprime le joueur déplacé de son ancien binôme s'il s'agit d'un échange entre deux binômes
    if (req.body.oldIdPoule) await Poule.updateOne({ _id: req.body.oldIdPoule}, {$pull: {joueurs: {$in: [req.params.idJoueur]}}})

    // On met à jour le nouveau binôme avec la liste des joueurs s'il s'agit d'un échange entre deux binômes
    if (req.body.newIdPoule) {
      await Poule.updateOne({_id: req.body.newIdPoule}, {
        $set: {
          joueurs: req.body.newPlayersList
        }
      })
    }
    res.status(200).json({message: 'La poule a été mise à jour'})
  } catch (e) {
    res.status(500).send('Impossible de modifier la poule')
  }
});

// GENERATE POULES
router.route("/generate/:tableau").put(async function(req, res) {
  try {
    let poules = [[],[],[],[],[],[],[],[]]
    let joueurs = await Joueur.find({tableaux : {$all: [req.params.tableau]}}).sort({classement: 'desc', nom: 'asc'})
    await Poule.deleteMany({ tableau: req.params.tableau})

    // Formation des poules
    let j = 0
    let mode = 0 // 0 = on monte, 1 = on descend
    let double = false
    for (let i = 0; i < joueurs.length; i++){
      poules[j].push(joueurs[i]._id)

      if (mode === 0){
        if (j === (poules.length-1)){
          if (double){
            mode = 1
            j--
            double = false
          }
          else double = true
        }
        else j++
      } else {
        if (j === 0){
          if (double) {
            mode = 0
            j++
            double = false
          }
          else double = true
        }
        else j--
      }
    }

    // Formation des documents
    for (let i = 0; i < poules.length; i++){
      let poule = new Poule({
        _id: new mongoose.Types.ObjectId(),
        tableau: req.params.tableau,
        locked: false,
        joueurs: poules[i]
      })
      await poule.save()
    }
  }
  catch (err) {
    res.status(500).send('Impossible de générer la poule')
  }
  Poule.find({tableau: req.params.tableau}).populate('joueurs').populate('tableau').populate('joueurs.tableaux').then(poules => res.status(200).json(poules)).catch(() => res.status(500).send('Impossible de récupérer la poule après modification'))
});

// UPDATE POULE STATUS
router.route("/editStatus/:id_poule").put(function(req, res) {
  Poule.updateOne({_id: req.params.id_poule}, {
    $set: {
      locked: req.body.locked
    }
  }).then(() => res.json({message: "Le status de la poule a été mis à jour"})).catch(() => res.status(500).send('Impossible de modifier le statut de la poule'))
});

// REMOVE PLAYER FROM BINOME WHEN DOUBLE CLICKING
router.route("/remove/from/binome/:id_poule/:id_player").delete(function(req, res) {
  Poule.updateOne({ _id: req.params.id_poule}, {$pull: {joueurs: {$in: [req.params.id_player]}}}).then(() => res.json({message: "Joueur dissocié"})).catch(() => res.status(500).send('Impossible de dissocier le joueur du binôme après double-click'))
});

module.exports = router
