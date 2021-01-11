const express = require('express')
const router = express.Router()
const Buffet = require('../model/Buffet')
const mongoose = require('mongoose')

// GET FIELDS
router.route("/").get(function(req, res) {
  Buffet.findOne().then(parametres => res.status(200).json(parametres)).catch(err => res.send(err))
});

// EDIT SETTINGS
router.route("/edit/:id_parametres").put(function(req, res) {
  Buffet.updateOne({_id: req.params.id_parametres}, {$set: req.body.parametres}).then(() => res.status(200).json({message: 'Paramètres modifiés'})).catch(() => res.status(500).json({error: 'Erreur lors de la modification des paramètres'}))
});

// REGISTER BUFFET'S FIELDS
router.route("/register").post(async function(req, res) {
  let buffet = await Buffet.findOne()
  console.log(req.body.nb_plus_13_ans)
  console.log(req.body.nb_moins_13_ans)
  Buffet.updateOne({ _id: buffet._id},
    {
      $push: { plats: { $each: req.body.plats } },
      $inc: {
        nb_moins_13_ans: req.body.nb_moins_13_ans,
        nb_plus_13_ans: req.body.nb_plus_13_ans
      }
    }).then((result) => res.status(200).json({message: result})).catch(err => res.send(err))
});

module.exports = router
