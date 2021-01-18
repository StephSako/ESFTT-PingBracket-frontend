const express = require('express')
const router = express.Router()
const Buffet = require('../model/Buffet')

// GET FIELDS
router.route("/").get(function(req, res) {
  Buffet.findOne().then(parametres => res.status(200).json(parametres)).catch(() => res.status(500).send('Impossible de récupérer les données du buffet'))
});

// EDIT SETTINGS
router.route("/edit/:id_parametres").put(function(req, res) {
  Buffet.updateOne({_id: req.params.id_parametres}, {$set: req.body.parametres}).then(() => res.status(200).json({message: 'Paramètres modifiés'})).catch(() => res.status(500).send('Erreur lors de la modification des paramètres'))
});

// PLATS ALREADY COOKED
router.route("/platsAlreadyCooked").get(function(req, res) {
  Buffet.findOne().then((buffet) => res.status(200).json(buffet.plats)).catch(() => res.status(500).send('Erreur lors du chargement des plats déjà cuisinés'))
});

// REGISTER BUFFET'S FIELDS
router.route("/register").post(async function(req, res) {
  let buffet = await Buffet.findOne()
  Buffet.updateOne({ _id: buffet._id},
    {
      $push: { plats: { $each: req.body.plats } },
      $inc: {
        nb_moins_13_ans: req.body.nb_moins_13_ans,
        nb_plus_13_ans: req.body.nb_plus_13_ans
      }
    }).then((result) => res.status(200).json({message: result})).catch(() => res.status(500).send('Impossible d\'enregistrer les données du buufet'))
});

module.exports = router
