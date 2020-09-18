var express = require('express');
var router = express.Router();
const TicTacController = require("../controllers/TicTacController");

router.get('/', TicTacController.getAll);
router.get('/:email',TicTacController.getByEmail);

module.exports = router;
