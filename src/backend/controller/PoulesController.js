const express = require('express')
const router = express.Router()
const Poule = require('../model/Poule')

// ALL POULES
router.route("/").get(function(req, res) {
  Poule.find().populate('joueurs.id').exec().then(poules => res.status(200).json(poules))
    .catch(err => res.send(err))
});

module.exports = router
