var express = require('express');
var router = express.Router();
const TicTacController = require("../controllers/TicTacController");
const {check, validationResult} = require("express-validator/check");
const plainTextParser = require('plainTextParser');

router.get('/', TicTacController.getAll);
router.get('/:email', TicTacController.getByEmail);
router.post('/justify',TicTacController.justify);
router.post('/token',
    [check("email", "Please enter a valid Email").isEmail()],
    TicTacController.generateToken
);

router.post('/post', (req, res) => {
    // try{req.body = JSON.parse(Object.keys(req.body)[0])}catch(err){req.body = req.body}
    // res.set('Content-Type', 'text/text').send(req.body);
    var chunk = '';

    req.on('data', function(data){
        chunk += data; // here you get your raw data.
        console.log(chunk , "22");
    });
    res.send(req.body);

});

module.exports = router;
