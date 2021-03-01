const express = require("express");
const router = express.Router();
const PouleController = require("../controller/PoulesController");

router.get('/:tableau/:format', PouleController.getPoules);

router.put('/edit/:id_poule', PouleController.editPoule);

router.put('/generate', PouleController.generatePoule);

router.put('/editStatus/:id_poule', PouleController.updateStatus);

router.delete('/delete/:idTableau', PouleController.deleteAllPoulesOfSpecificTableau);

module.exports = router;
