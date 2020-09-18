var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');

const url = "mongodb://localhost:27017/tictactrip";
mongoose.connect(url, { useNewUrlParser: true });
// mongoose.set({ usecreateIndexes: true });
var mongo = mongoose.connection;
mongo.on('connected', () => { console.log('Connected !') });
mongo.on('open', () => { console.log('Open !') });
mongo.on('error', (err) => { console.log(err) });
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var ticTacRouter = require('./routes/tictac');


var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api', ticTacRouter);

module.exports = app;
