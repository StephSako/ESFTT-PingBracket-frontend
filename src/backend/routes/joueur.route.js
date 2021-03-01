const express = require("express");
const router = express.Router();
const JoueurController = require("../controller/JoueurController");

router.get('/:id_joueur', JoueurController.getPlayer);

router.get('/', JoueurController.getAllPlayers);

router.get('/unsubscribed/:tableau', JoueurController.unsubscribedPlayers);

router.get('/subscribed/:tableau', JoueurController.subscribedPlayersOfSpecificTableau);

router.get('/unassigned/:tableau', JoueurController.unassignedPlayersBinomes);

router.post('/create', JoueurController.subscribePlayer);

router.put('/edit/:id_player', JoueurController.editPlayer);

router.put('/unsubscribe/:id_player/:tableau', JoueurController.unsubscribedPlayer);

router.delete('/delete/:id_player', JoueurController.deletePlayer);

router.put('/move', JoueurController.movePlayers);

module.exports = router;
