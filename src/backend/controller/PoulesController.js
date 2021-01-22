const express = require('express')
const router = express.Router()
const Poule = require('../model/Poule')
const Binome = require('../model/Binome')
const Joueur = require('../model/Joueur')
const mongoose = require('mongoose')

// ALL POULES
router.route("/:tableau").get(function(req, res) {
  Poule.find({tableau: req.params.tableau}).populate('participants').populate('tableau').then(poules => res.status(200).json(poules)).catch(() => res.status(500).send('Impossible de récupérer la poule du tableau'))
});

// UPDATE SPECIFIC POULE
router.route("/edit/:id_poule").put(function(req, res) {
  Poule.updateOne({_id: req.params.id_poule}, {
    $set: {
      participants: req.body
    }
  }).then((result) => res.json({message: "La poule a été mise à jour"})).catch(() => res.status(500).send('Impossible de modifier la poule'))
});

// GENERATE POULES
router.route("/generate").put(async function(req, res) {
  try {
    let poules = [[],[],[],[],[],[],[],[]]
    let participants = []
    if (req.body.format === 'simple') participants = await Joueur.find({ tableaux : {$all: [req.body._id]}}).sort({classement: 'desc', nom: 'asc'})
    else if (req.body.format === 'double') participants = await Binome.find({ tableau : req.body._id}) // TODO SHUFFLE
    await Poule.deleteMany({ tableau: req.body._id})

    // Formation des poules
    let j = 0
    let mode = 0 // 0 = on monte, 1 = on descend
    let double = false
    for (let i = 0; i < participants.length; i++){
      poules[j].push(participants[i]._id)

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
        tableau: req.body._id,
        objectRef: (req.body.format === 'double' ? 'Binomes' : 'Joueurs'),
        locked: false,
        participants: poules[i]
      })
      await poule.save()
    }

    if (req.body.format === 'simple') Poule.find({tableau: req.body._id}).populate('participants').populate('tableau').populate('participants.tableaux').then(poules => res.status(200).json(poules)).catch(() => res.status(500).send('Impossible de récupérer la poule après modification'))
    else if (req.body.format === 'double') Poule.find({tableau: req.body._id}).populate('participants').populate({path: 'participants.joueurs', options: { sort: { nom: 1 } }}).populate('tableau').then(poules => res.status(200).json(poules)).catch(() => res.status(500).send('Impossible de récupérer la poule après modification'))
  }
  catch (err) {
    res.status(500).send('Impossible de générer la poule')
  }
});

// UPDATE POULE STATUS
router.route("/editStatus/:id_poule").put(function(req, res) {
  Poule.updateOne({_id: req.params.id_poule}, {
    $set: {
      locked: req.body.locked
    }
  }).then(() => res.json({message: "Le status de la poule a été mis à jour"})).catch(() => res.status(500).send('Impossible de modifier le statut de la poule'))
});

module.exports = router
