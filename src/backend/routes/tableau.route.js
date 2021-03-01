const express = require("express");
const router = express.Router();
const TableauController = require("../controller/TableauController");

router.get('/', TableauController.getTableaux);

router.get('/player_count', TableauController.playerCountPerTableau);

router.get('/hostable/:tableauToHostId/:ageMinimum/:format/:poules', TableauController.hostableTableaux);

router.get('/:tableau', TableauController.getSpecific);

router.post('/create', TableauController.createTableau);

router.put('/edit/:id_tableau', TableauController.editTableau);

router.put('/unsubscribe/invalid/:id_tableau', TableauController.unsubscribeInvalidPlayers);

router.delete('/reset', TableauController.resetTournament);

router.delete('/delete/:tableau_id/:format/:poules', TableauController.deleteTableau);

router.put('/unsubscribe_all', TableauController.unsubscribeAllPlayers);

module.exports = router;
