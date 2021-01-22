const express = require('express')
const router = express.Router()
const Binome = require('../model/Binome')
const Joueur = require('../model/Joueur')
const mongoose = require('mongoose')

// ALL BINOMES
router.route("/:tableau").get(function(req, res) {
  Binome.find({tableau: req.params.tableau}).populate('joueurs').populate('tableau').then(binomes => res.status(200).json(binomes)).catch(() => res.status(500).send('Impossible de récupérer la binome du tableau'))
});

// UPDATE SPECIFIC BINOME
router.route("/edit/:idJoueur").put(async function(req, res) {
  try {
    // On supprime le joueur déplacé de son ancien binôme s'il s'agit d'un échange entre deux binômes
    if (req.body.oldIdBinome) await Binome.updateOne({ _id: req.body.oldIdBinome}, {$pull: {joueurs: {$in: [req.params.idJoueur]}}})

    // On met à jour le nouveau binôme avec la liste des joueurs s'il s'agit d'un échange entre deux binômes
    if (req.body.newIdBinome) {
      await Binome.updateOne({_id: req.body.newIdBinome}, {
        $set: {
          joueurs: req.body.newPlayersList
        }
      })
    }
    res.status(200).json({message: 'La binome a été mise à jour'})
  } catch (e) {
    res.status(500).send('Impossible de modifier la binome')
  }
});

// GENERATE BINOMES
router.route("/generate/:tableau").put(async function(req, res) {
  try {
    let binomes = [[],[],[],[],[],[],[],[]]
    let joueurs = await Joueur.find({tableaux : {$all: [req.params.tableau]}}).sort({classement: 'desc', nom: 'asc'})
    await Binome.deleteMany({ tableau: req.params.tableau})

    // Formation des binomes
    let j = 0
    let mode = 0 // 0 = on monte, 1 = on descend
    let double = false
    for (let i = 0; i < joueurs.length; i++){
      binomes[j].push(joueurs[i]._id)

      if (mode === 0){
        if (j === (binomes.length-1)){
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
    for (let i = 0; i < binomes.length; i++){
      let binome = new Binome({
        _id: new mongoose.Types.ObjectId(),
        tableau: req.params.tableau,
        locked: false,
        joueurs: binomes[i]
      })
      await binome.save()
    }
  }
  catch (err) {
    res.status(500).send('Impossible de générer la binome')
  }
  Binome.find({tableau: req.params.tableau}).populate('joueurs').populate('tableau').populate('joueurs.tableaux').then(binomes => res.status(200).json(binomes)).catch(() => res.status(500).send('Impossible de récupérer la binome après modification'))
});

// UPDATE BINOME STATUS
router.route("/editStatus/:id_binome").put(function(req, res) {
  Binome.updateOne({_id: req.params.id_binome}, {
    $set: {
      locked: req.body.locked
    }
  }).then(() => res.json({message: "Le status de la binome a été mis à jour"})).catch(() => res.status(500).send('Impossible de modifier le statut de la binome'))
});

// REMOVE PLAYER FROM BINOME WHEN DOUBLE CLICKING
router.route("/remove/from/binome/:id_binome/:id_player").delete(function(req, res) {
  Binome.updateOne({ _id: req.params.id_binome}, {$pull: {joueurs: {$in: [req.params.id_player]}}}).then(() => res.json({message: "Joueur dissocié"})).catch(() => res.status(500).send('Impossible de dissocier le joueur du binôme après double-click'))
});

module.exports = router
