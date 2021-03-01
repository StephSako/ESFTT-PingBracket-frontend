const express = require('express')
const router = express.Router()
const Parametre = require('../model/Parametre')
const jwt = require("jsonwebtoken")

// GET FIELDS
router.route("/").get(function(req, res) {
  jwt.verify(req.headers['authorization'], process.env.SECRET_KEY, function (err, decoded) {
    if (err) {
      res.status(500).send("Vous n'etes pas connecté");
      return;
    }
  Parametre.findOne().then(parametres => res.status(200).json(parametres)).catch(() => res.status(500).send('Impossible de récupérer les champs du formulaire'))
  })
});

// EDIT FORMULAIRE FIELDS
router.route("/edit/:id_parametres").put(function(req, res) {
  Parametre.updateOne({_id: req.params.id_parametres}, {$set: req.body.parametres}).then(() => res.status(200).json({message: 'Paramètres modifiés'})).catch(() => res.status(500).send('Erreur lors de la modification des paramètres'))
});

// CHANGE FORMULAIRE STATE
router.route("/change_form_state/:id_parametres").put(function(req, res) {
  Parametre.updateOne({_id: req.params.id_parametres}, {open: req.body.open}).then(() => res.status(200).json({ message: (req.body.open ? 'Formulaire ouvert aux inscriptions' : 'Formulaire fermé aux inscriptions') })).catch(() => res.status(500).send('Impossible de modifier le statut du formulaire'))
});

module.exports = router
