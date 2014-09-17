var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var exec = require('child_process').exec;
var async = require('async');
var Hogan = require('hjs');
var request = require('request');
var mkdirp = require('mkdirp');
var rmdir = require('rmdir');

var TARGET_IP;
var DEV = true;
if (process.env.NODE_ENV == 'development') {
    TARGET_IP = '10.12.143.85';
} else {
    DEV = false;
    TARGET_IP = '10.11.201.212';
}

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

router.all('/loadconfig', function(req, res, next) {
    var f = req.param('f');
    if (!f) {
        var err = new Error('f is required');
        err.status = 500;
        return next(err);
    }
    var fjson = path.join(__dirname, '..', 'config', f);
    return fs.readFile(fjson, {
        encoding: 'utf-8'
    }, function(err, content) {
        var obj = {};
        try {
            obj = JSON.parse(content);
        } catch (e) {}
        obj.f = f;
        return res.render('fields', obj);
    });
});

router.post('/preview', function(req, res, next) {
    var f = req.body.f;

    if (!/([\w-]+)\.json/.test(f)) {
        var err = new Error('f is illegal');
        err.status = 500;
        return next(err);
    }

    delete req.body.f;

    return res.render('tpl/' + RegExp.$1, req.body);
});

router.post('/create', function(req, res) {
    var payload = req.body;

    if (!payload.f || !payload.pageName) {
        return res.json({
            status: -1,
            msg: '缺少参数'
        });
    }

    var f = payload.f.replace(/\.json$/, '');
    var tmpDir = path.join(__dirname, '..', 'tmp', f);
    var destFile = path.join(tmpDir, payload.pageName + '.html');
    var output;
    async.series([

        function(cb) {
            try {
                output = Hogan.compile(fs.readFileSync(path.join(__dirname, '..', 'views/tpl', f + '.hjs'), {
                    encoding: 'utf-8'
                })).render(payload);
                cb(null);
            } catch (e) {
                cb(e);
            }
        },
        function(cb) {
            if (!fs.existsSync(tmpDir)) {
                return mkdirp(tmpDir, cb);
            } else cb(null);
        },
        function(cb) {
            return fs.writeFile(destFile, output, cb);
        },
        function(cb) {
            return exec('rsync -avz ' + tmpDir + ' root@' + TARGET_IP + ':/search/wan/webapp/static/', cb);
        },
        function(cb) {
            if (DEV) {
                return cb(null);
            } else {
                exec("ssh root@10.11.201.212 'sh /search/script/publishscript/rsync_static2m1_new.sh static/" + f + "'", cb);
            }
        },
        function(cb) {
            rmdir(tmpDir, function() {});
            cb();
        }

    ], function(err) {
        return res.json({
            status: err ? -1 : 0,
            msg: err ? err.message : 'success'
        });
    });



});

//Check if a url is 404
router.get('/checkurlexist', function(req, res) {
    if (!/https?:\/\//.test(req.query.url)) {
        return res.json({
            exist: false
        });
    }
    return request(req.query.url, function(err, response) {
        return res.json({
            exist: (!err && response.statusCode == 200)
        });
    });
});

module.exports = router;