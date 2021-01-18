const express = require('express')
const router = express.Router()
const Parametre = require('../model/Parametre')

// GET FIELDS
router.route("/").get(function(req, res) {
  Parametre.findOne().then(parametres => res.status(200).json(parametres)).catch(() => res.status(500).send('Impossible de récupérer les champs du formulaire'))
});

// EDIT SETTINGS
router.route("/edit/:id_parametres").put(function(req, res) {
  Parametre.updateOne({_id: req.params.id_parametres}, {$set: req.body.parametres}).then(() => res.status(200).json({message: 'Paramètres modifiés'})).catch(() => res.status(500).send('Erreur lors de la modification des paramètres'))
});

module.exports = router
