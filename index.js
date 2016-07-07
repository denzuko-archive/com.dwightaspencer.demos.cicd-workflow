'use strict';

var api       = require('./server'),
    ux        = require('./client'),
    config    = require('./config');
    
var api_port  = parseInt(process.env.PORT, 10) || parseInt(config.api.port, 10),
    ux_port   = parseInt(process.env.PORT, 10)+1 || parseInt(config.ux.port, 10)+1,
    bind      = process.env.IP   || config.service.bind;

console.log('[api] listener started on tcp ' + api_port);
api.listen(api_port, bind);

console.log('[ux] listener started on tcp ' + ux_port);
ux.listen(ux_port, bind);
