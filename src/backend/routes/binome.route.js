const express = require("express");
const router = express.Router();
const BinomeController = require("../controller/BinomeController");

router.get('/:tableau', BinomeController.getBinomesOfSpecificTableau);

router.put('/edit/:idJoueur', BinomeController.editBinome);

router.delete('/remove_player/:id_binome/:id_player', BinomeController.removePlayerInBinome);

router.put('/remove_player/:id_binome/:id_player', BinomeController.generateOfSpecificTableau);

router.delete('/reset/:tableau', BinomeController.deleteAllBinomesOfSpecificTableau);

module.exports = router;
