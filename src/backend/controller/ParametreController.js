const Parametre = require('../model/Parametre')
const jwt = require("jsonwebtoken")

exports.get = (req, res) => {
  jwt.verify(req.headers['authorization'], process.env.SECRET_KEY, function (err, decoded) {
    if (err) {
      res.status(500).send("Vous n'etes pas connecté");
      return;
    }
  Parametre.findOne().then(parametres => res.status(200).json(parametres)).catch(() => res.status(500).send('Impossible de récupérer les champs du formulaire'))
  })
}

exports.edit = (req, res) => {
  Parametre.updateOne({_id: req.params.id_parametres}, {$set: req.body.parametres}).then(() => res.status(200).json({message: 'Paramètres modifiés'})).catch(() => res.status(500).send('Erreur lors de la modification des paramètres'))
}

exports.editStatus = (req, res) => {
  Parametre.updateOne({_id: req.params.id_parametres}, {open: req.body.open}).then(() => res.status(200).json({ message: (req.body.open ? 'Formulaire ouvert aux inscriptions' : 'Formulaire fermé aux inscriptions') })).catch(() => res.status(500).send('Impossible de modifier le statut du formulaire'))
}
