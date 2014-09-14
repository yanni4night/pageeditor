var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');

router.get('/', function(req, res) {
    return fs.readdir(path.join(__dirname, '..', 'config'), function(err, files) {
        return res.render('index', {
            profiles: files,
            username:req.username
        });
    });
});

module.exports = router;