const Req = require("../models/Request");
var mongoose = require('mongoose');
const {check, validationResult} = require("express-validator/check");
var jwt = require('jsonwebtoken');
const config = require("../config/config");

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

var justify = async (req, res, next) => {
    res.type("text/plain");
    var text = req.body;
    const token = req.header("token");
    const decoded = jwt.verify(token, config.authentification.secret);
    const totalWords = text.trim().split(/\s+/).length;

    var cmp = 80;
    var result = "";
    var j;
    var wordsRemainingAllowed = 0;

    // Check content
    if (!text) {
        res.send('');
        return;
    }
    text = text.replace(/\s\s+/g, ' ');

    //calculate words allowed to be justified
    await Req.findOne({email: decoded.email}).then((data) => {
        wordsRemainingAllowed = 80000 - data.count;
    });

    // if wordsAllowedRemaining >= totalWords in the body  ==> okey , you can justify text
    if (wordsRemainingAllowed >= totalWords) {
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
        res.send(addSpace(result).join('\n'));
    } else {
        res.status(402).send("402 Payment Required");

        /*
        **********************************************************************************
        **    An other solution :
        **    we can allow justifying text only for the remaining allowed number of words,
        **    and sending back the allowed result
        **********************************************************************************

        let lastAllowed = (totalWords - wordsRemainingAllowed) - 1;
        text = text.trim().split(/\s+/).splice(0, totalWords - lastAllowed).join(' ');
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
        res.send(addSpace(result).join('\n'));


         */
    }
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

    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }
    const email = req.body.email;
    //ParserBody
    try {
        // See if request exists
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
                async (err, token) => {
                    if (err) throw err;
                    await Req.create({email: email, token: token});
                    await res.json({token,});
                }
            );
        } else if (diffDate(rq.date, new Date()) > 1) {  // delay > 24h : update (COUNT = 0) && (DATE= now)
            let updatedReq = {
                email: rq.email,
                token: rq.token,
                date: new Date(),
                count: 0
            };
            await Req.update({email: email}, updatedReq);
            res.json({token: rq.token,})
        } else {
            res.json({token: rq.token,}); // else => a request exists with the same email
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).send("server Error");
    }
};

function diffDate(d1, d2) {
    dt1 = new Date(d1);
    dt2 = new Date(d2);
    return Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate())) / (1000 * 60 * 60 * 24));
}

module.exports = {
    getAll,
    getByEmail,
    justify,
    generateToken,
};
