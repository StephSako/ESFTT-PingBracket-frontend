const express = require('express')
const router = express.Router()
const Joueur = require('../model/Joueur')

// ALL MATCHES
router.route("/").get(function(req, res) {
  Joueur.find().exec().then(docs => res.json(docs)).catch(err => res.send(err))
});

module.exports = router
