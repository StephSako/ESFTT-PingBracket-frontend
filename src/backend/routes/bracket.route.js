const express = require("express");
const router = express.Router();
const BracketController = require("../controller/BracketController");

router.get('/:tableau/:phase', BracketController.poulesOfSpecificTableau);

router.put('/edit/:tableau/:phase/:id_round/:id_match', BracketController.setWinner);

router.put('/generate/:tableau/:phase', BracketController.generateBracket);

router.delete('/delete/:idTableau', BracketController.deleteBracket_s);

module.exports = router;
