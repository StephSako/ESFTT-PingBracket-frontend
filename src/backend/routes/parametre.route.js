const express = require("express");
const router = express.Router();
const ParametreController = require("../controller/ParametreController");

router.get("/", ParametreController.get);

router.put('/edit/:id_parametres', ParametreController.edit);

router.put('/change_form_state/:id_parametres', ParametreController.editStatus);

module.exports = router;
