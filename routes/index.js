var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');

var request = require('request');

router.get('/', function(req, res) {

    var bgIndex = ((Math.random() * 1e6) | 0) % 10;

    return fs.readdir(path.join(__dirname, '..', 'config'), function(err, files) {
        files = Array.isArray(files) ? files : [];
        files = files.filter(function(item) {
            return /\.json$/i.test(item);
        });

        var profiles = files.map(function(f, idx) {
            var json;
            var item = {
                file: f
            };
            try {
                json = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'config', f), {
                    encoding: 'utf-8'
                }));
                item.name = json.name;
                item.date = json.date;
            } catch (e) {
                item.name = 'Anonymous';
                item.date = 'Unknown';
            }

            return item;
        });

        return res.render('index', {
            bgIndex: bgIndex,
            profiles: profiles,
            username: req.username
        });
    });
});

router.all('/loadconfig', function(req, res) {
    var f = req.param('f');
    var fjson = path.join(__dirname, '..', 'config', f);
    return fs.readFile(fjson, {
        encoding: 'utf-8'
    }, function(err, content) {
        var obj = {};
        try {
            obj = JSON.parse(content);
        } catch (e) {}
        return res.render('fields', obj);
    });
});

router.post('/preview', function(req, res) {
    return res.json(req.body);
});

router.get('/checkurlexist', function(req, res) {
    if(!/https?:\/\//.test(req.query.url)){
        return res.json({exist:false});
    }
    return request(req.query.url, function(err, response) {
        return res.json({
            exist: (!err && response.statusCode == 200)
        });
    });
});

module.exports = router;