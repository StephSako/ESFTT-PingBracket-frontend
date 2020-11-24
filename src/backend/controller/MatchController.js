const express = require('express')
const router = express.Router()
const Open = require('../model/Open')

// ALL MATCHES
router.route("/").get(function(req, res) {
  Open.find().exec().then(docs => res.status(200).json({rounds: docs}))
    .catch(err => res.send(err))
});

module.exports = router
