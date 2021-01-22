const express = require('express')
const router = express.Router()
const Binome = require('../model/Binome')

// ALL BINOMES
router.route("/:tableau").get(function(req, res) {
  Binome.find({tableau: req.params.tableau}).populate('joueurs').populate('tableau').then(binomes => res.status(200).json(binomes)).catch(() => res.status(500).send('Impossible de récupérer le binôme du tableau'))
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

// REMOVE PLAYER IN BINOME (DOUBLE CLICKING)
router.route("/remove_player/:id_binome/:id_player").delete(function(req, res) {
  Binome.updateOne({ _id: req.params.id_binome}, {$pull: {joueurs: {$in: [req.params.id_player]}}}).then(() => res.json({message: "Joueur dissocié"})).catch(() => res.status(500).send('Impossible de dissocier le joueur du binôme après double-click'))
});

module.exports = router
