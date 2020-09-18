const Req = require("../models/Request");
var mongoose = require('mongoose');
// var jwt = require('jsonwebtoken');
// var bcrypt = require('bcrypt-nodejs');

var getAll = (req, res, next) => {
    Req.find({}).then((data) => {
            res.status(202).json(data);
        })
        .catch(error => {
            res.status(500).send(error);
        });
};

var getByEmail = (req, res, next) => {
    Req.findOne({"email": req.params.email}).then((data) => {
        res.status(202).json(data);
    }).catch(error => {
        res.status(500).send(error);
    });
};

module.exports = {
    getAll,
    getByEmail,
};
