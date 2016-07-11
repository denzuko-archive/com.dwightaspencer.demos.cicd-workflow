'use strict';

var config    = require('./config'),
    server    = require('./server'),
    client    = require('./client');

var api       = new server(config),
    ux        = new client(config);