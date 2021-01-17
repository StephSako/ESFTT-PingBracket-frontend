const express = require('express')
const router = express.Router()
const Account = require('../model/Account')
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

process.env.SECRET_KEY = 'secret'

// LOGIN
router.post('/login', (req, res) => {
  Account.findOne({ username: req.body.username }).then(account => {
    // console.log( bcrypt.hashSync(req.body.password, 12))
    if (bcrypt.compareSync(req.body.password, account.password)) {
      let token = jwt.sign(account.toJSON(), process.env.SECRET_KEY, {
        expiresIn: '1d'
      })
      res.json({ token: token })
    } else res.status(500).send("Le mot de passe est incorrect")
  }).catch(err => res.status(500).send('Ce pseudo n\'existe pas'))
})

module.exports = router
