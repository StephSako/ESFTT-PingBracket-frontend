const express = require('express')
const router = express.Router()
const Poule = require('../model/Poule')
const Joueur = require('../model/Joueur')
const mongoose = require('mongoose')

// ALL POULES
router.route("/:type").get(function(req, res) {
  Poule.find({type: req.params.type}).populate('joueurs.id').then(poules => res.status(200).json(poules)).catch(err => res.send(err))
});

// UPDATE PLAYERS LIST
router.route("/edit/:id_poule").put(function(req, res) {
  Poule.updateOne({_id: req.params.id_poule}, {
    $set: {
      joueurs: req.body
    }
  }).then(() => res.json({message: "La poule a été mise à jour"})).catch(err => res.send(err))
});

// GENERATE POULES ACCORDING TO A SPECIFIC TYPE
router.route("/generate/:type").put(async function(req, res) {
  let poules = [[],[],[],[],[],[],[],[]]
  let joueurs = await Joueur.find({tableaux : {$all: [req.params.type]}}).sort({classement: 'desc', nom: 'asc'})

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

  try { await Poule.deleteMany({ type: req.params.type}) } catch (err) { res.status(500).json(err) }

  // Formation des poules
  for (let i = 0; i < poules.length; i++){
    // Objetisation des joueurs
    for (let j = 0; j < poules[i].length; j++){
      poules[i][j] = {
        id: poules[i][j],
        points: 0
      }
    }

    try {
      let poule = new Poule({
        _id: new mongoose.Types.ObjectId(),
        type: req.params.type,
        locked: false,
        joueurs: poules[i]
      })
      await poule.save()
    }
    catch (err) {
      res.status(500).json(err)
    }
  }
  res.status(200).json('Les poules ont été générées')
});

// UPDATE POULE STATUS
router.route("/editStatus/:id_poule").put(function(req, res) {
  Poule.updateOne({_id: req.params.id_poule}, {
    $set: {
      locked: req.body.locked
    }
  }).then((result) => /*res.json({message: "Le status de la poule a été mis à jour"})*/ res.json(result)).catch(err => res.send(err))
});

module.exports = router
