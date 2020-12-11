const express = require('express')
const router = express.Router()
const Poule = require('../model/Poule')
const Joueur = require('../model/Joueur')
const mongoose = require('mongoose')

// ALL POULES
router.route("/:tableau").get(function(req, res) {
  Poule.find({type: req.params.tableau}).populate('joueurs').populate('type').then(poules => res.status(200).json(poules)).catch(err => res.send(err))
});

// UPDATE SPECIFIC POULE
router.route("/edit/simple/:id_poule").put(function(req, res) {
  Poule.updateOne({_id: req.params.id_poule}, {
    $set: {
      joueurs: req.body
    }
  }).then(() => res.json({message: "La poule a été mise à jour"})).catch(err => res.send(err))
});

// UPDATE SPECIFIC DOUBLE BINOME
router.route("/edit/double/:oldIdPoule/:newIdPoule").put(async function(req, res) {
  // On supprime le joueur déplacé de son ancien binôme
  await Poule.updateOne({ _id: req.params.oldIdPoule}, {$pull: {joueurs: {$in: [req.body.idJoueur]}}}).catch(err => res.send(err))

  Poule.updateOne({_id: req.params.newIdPoule}, {
    $set: {
      joueurs: req.body.newPlayersList
    }
  }).then(() => res.json({message: "La poule a été mise à jour"})).catch(err => res.send(err))
});

// GENERATE POULES
router.route("/generate/simple/:tableau").put(async function(req, res) {
  try {
    let poules = [[],[],[],[],[],[],[],[]]
    let joueurs = await Joueur.find({tableaux : {$all: [req.params.tableau]}}).sort({classement: 'desc', nom: 'asc'})
    await Poule.deleteMany({ type: req.params.tableau})

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
        type: req.params.tableau,
        locked: false,
        joueurs: poules[i]
      })
      await poule.save()
    }
  }
  catch (err) {
    res.status(500).json(err)
  }
  Poule.find({type: req.params.tableau}).populate('joueurs').populate('type').populate('joueurs.tableaux').then(poules => res.status(200).json(poules)).catch(err => res.send(err))
});

// GENERATE BINOMES
router.route("/generate/double/:tableau").put(async function(req, res) {
  try {
    let binomes = []
    let joueurs = await Joueur.find({tableaux : {$all: [req.params.tableau]}}).sort({nom: 'asc', classement: 'asc'})
    await Poule.deleteMany({ type: req.params.tableau})

    // Formation des binômes
    let j = 0
    let binome = []
    for (let i = 0; i < joueurs.length; i++){
      binome.push(joueurs[i])
      if (j === 1) {
        binomes.push(binome)
        binome = []
        j = 0
      }
      else if (j === 0 && i === joueurs.length-1) binomes.push(binome)
      else j++
    }

    // Formation des documents
    for (let i = 0; i < binomes.length; i++){
      let poule = new Poule({
        _id: new mongoose.Types.ObjectId(),
        type: req.params.tableau,
        locked: false,
        joueurs: binomes[i]
      })
      await poule.save()
    }
  }
  catch (err) {
    res.status(500).json(err)
  }
  Poule.find({type: req.params.tableau}).populate('joueurs').populate('type').populate('joueurs.tableaux').then(binomes => res.status(200).json(binomes)).catch(err => res.send(err))
});

// UPDATE POULE STATUS
router.route("/editStatus/:id_poule").put(function(req, res) {
  Poule.updateOne({_id: req.params.id_poule}, {
    $set: {
      locked: req.body.locked
    }
  }).then((result) => res.json({message: "Le status de la poule a été mis à jour"})).catch(err => res.send(err))
});

module.exports = router
