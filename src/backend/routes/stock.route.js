const express = require("express");
const router = express.Router();
const StockController = require("../controller/StockController");

router.get('/', StockController.getStock);

router.post('/create', StockController.create);

router.delete('/delete/:stock_id', StockController.deleteStock);

router.put('/edit/:stock_id', StockController.editStock);

module.exports = router;
