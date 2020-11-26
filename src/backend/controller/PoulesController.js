const express = require('express')
const router = express.Router()
const Poule = require('../model/Poule')

// ALL POULES
router.route("/").get(function(req, res) {
  Poule.find().populate('poules.joueurs.joueur').exec().then(matches => res.status(200).json({rounds: matches}))
    .catch(err => res.send(err))
});

module.exports = router
