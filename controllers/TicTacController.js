const Req = require("../models/Request");
var mongoose = require('mongoose');
const {check, validationResult} = require("express-validator/check");
var jwt = require('jsonwebtoken');
const config = require("../config/config");
const countWords = require("count-words");

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

var justify = (req, res, next) => {
    res.type("text/plain");
    var text = req.body;

    // Check content
    if (!text) {
        res.send('');
        return;
    }
    var cmp = 80;
    var result = "";
    var j;
    // console.log(text.trim().split(/\s+/).length , 'text');
    text = text.replace(/\s\s+/g, ' ');

    for (var i = 0; i < text.length; i++) {
        result += text[i];
        if (i == cmp) {
            if (text[i] == ' ' || text[i] == ',' || text[i] == '.') {
                result += '\n';
                cmp = i + 1 + 80;
            } else {
                j = 0;
                while (text[i] !== ' ' && text[i] !== '.' && text[i] !== ',') {
                    i = i - 1;
                    j++;
                }
                result = result.substr(0, result.length - j);
                result += '\n';
                cmp = i + 80;
            }
        }
    }
    res.send(addSpace(result).join('\n'))
};

function addSpace(text) {
    max = 80;
    var newLines = text.split(/\n/);
    for (var i = 0; i < newLines.length -1; i++) {

        var line = newLines[i].trim();

        if (line.length >= max) {
            continue;
        }
        var k = 1;
        for (var j = 0; j < line.length; j++) {

            if (line[j] == " " && line.length < max) {
                line = addCharAtIndex(line, j, "  ");
                j = j + k;
            } else if (j == line.length - 1 && line.length < max) {
                j = 0;
                k++;
            }
        }
        newLines[i] = line;
    }
    return newLines;
}
function addCharAtIndex(str, index, chr) {
    if (index > str.length - 1) return str;
    return str.substr(0, index) + chr + str.substr(index + 1);
}

var generateToken = async (req, res, next) => {
    //Check errors in  the body

    const errors = validationResult(req);

    //Bad Request
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }
    const {email} = req.body.email;
    //ParserBody
    try {
        // See if user exists
        let rq = await Req.findOne({
            email
        });
        // there is no request with this email, so we will create a new one
        if (!rq) {
            var token = jwt.sign(
                {email: email},
                config.authentification.secret,
                {
                    expiresIn: 360000
                },
                (err, token) => {
                    if (err) throw err;
                    res.json({
                        token,
                    });
                }
            );
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).send("server Error");
    }
};
module.exports = {
    getAll,
    getByEmail,
    justify,
    generateToken,
};
