const express = require("express");
const router = express.Router();
const BuffetController = require("../controller/BuffetController");

router.get('/', BuffetController.getBuffet);

router.get('/platsAlreadyCooked', BuffetController.platsAlreadyCooked);

router.get('/register', BuffetController.register);

module.exports = router;
