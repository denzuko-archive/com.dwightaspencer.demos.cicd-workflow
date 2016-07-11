'use strict';

var express = require('express'),
    index   = express.Router();

index.route('/')
    .get(function (req, res) {
        res.status(200).jsonp({
            meta: {
                status: 200,
                message: 'ok'
            },
            data:[{
                message: 'demo api server',
                state: 'online'
            }],
            links: {
                self: '/v1/',
            }
        });
    });

module.exports = index;