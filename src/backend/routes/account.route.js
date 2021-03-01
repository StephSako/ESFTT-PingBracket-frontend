const express = require("express");
const router = express.Router();
const AccountController = require("../controller/AccountController");

router.post('/login', AccountController.login);

router.put('/edit/username', AccountController.editUsername);

router.put('/edit/password', AccountController.editPassword);

module.exports = router;
