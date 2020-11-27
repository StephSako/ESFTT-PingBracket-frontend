const express = require('express')
const router = express.Router()
const Poule = require('../model/Poule')

// ALL POULES
router.route("/").get(function(req, res) {
  Poule.find().populate('joueurs.id').exec().then(poules => res.status(200).json(poules))
    .catch(err => res.send(err))
});

// UPDATE PLAYERS LIST
router.route("/edit/:id_poule").put(function(req, res) {
  Poule.update({_id: req.params.id_poule}, {
    $set: {
      joueurs: req.body
    }
  }).then(() => res.json({message: "La poule a été mise à jour"})).catch(err => res.send(err))
});

module.exports = router
