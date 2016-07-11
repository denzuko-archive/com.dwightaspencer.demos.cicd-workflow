'use strict';

var express = require('express'),
    router  = express.Router();

router.get('/partials/:name', function (req, res){
   var name = req.params.name;

   res.render('partials/' + name);
});

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', { title: 'CI/CD Demo' });
});

module.exports = router;