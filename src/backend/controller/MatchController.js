const express = require('express')
const router = express.Router()
const Open = require('../model/Open')

// ALL MATCHES
router.route("/").get(function(req, res) {
  Open.find().exec().then(matches => res.status(200).json({rounds: matches}))
    .catch(err => res.send(err))
});

module.exports = router
