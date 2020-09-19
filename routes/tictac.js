var express = require('express');
var router = express.Router();
const TicTacController = require("../controllers/TicTacController");
const {check, validationResult} = require("express-validator/check");
const TokenExist = require("../middlewares/TokenExist");

router.get('/', TicTacController.getAll);
router.get('/:email', TicTacController.getByEmail);
router.post('/justify',TokenExist , TicTacController.justify);
router.post('/token',
    TicTacController.generateToken
);

module.exports = router;
