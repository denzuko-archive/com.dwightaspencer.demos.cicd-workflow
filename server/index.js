'use strict';

var express         = require('express'),
    path            = require('path'),
    url             = require('url'),
    net             = require('net'),
    cookieParser    = require('cookie-parser'),
    bodyParser      = require('body-parser'),
    errorHandler    = require('errorhandler'),
    morgan          = require('morgan'),
    index           = require('./routes/index'),
    config          = require('../config'),
    database_url    = process.env.DB_URL || config.database.url,
    app             = express(),
    server          = require('http').createServer(app);

module.exports = app;

app.set('jsonp callback', true);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({extended: true}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(bodyParser.json({type: 'application/vnd.ioinet+json', strict: true }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(errorHandler());
  app.use(morgan('dev'));
}

// qa only
if ('qa' == app.get('env')) {
  var fs              = require('fs'),
      accessLogStream = fs.createWriteStream(__dirname + '/access.log',{flags: 'a'});

  app.use(errorHandler());
  app.use(morgan('combined', {stream: accessLogStream}));
}

// non-production only
if ('nonprod' == app.get('env')) {
  app.use(errorHandler());
  app.use(morgan('combined'));
}

// production only
if ('production' == app.get('env')) {
  app.use(morgan('combined'));
}


// Make our db accessible to our routers
app.use(function (req,res,next) {
  req.server     = server;
//  req.db         = db;
  next();
});

// Setup routing
app.use('/v1', index);
app.use('/', index);

/// catch 404 and forwarding to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers
app.use(function (err, req, res, next) {
    res.status(err.status || 500).jsonp([{
        meta: {
          status: err.status
        },
      errors: [{
            message: err.message,
            error: err
        }]
    }]);
});