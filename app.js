var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

//Be user to be logined
app.use('*', function(req, res, next) {
    var err, username;

    //jpassport-sp  {username:yinyong@sogou-inc.com,timebefore:2014-07-25T11:07:10.705Z,notonorafter:2014-08-08T11:08:10.705Z,sign:eJwNj8kRADEIw1oCcz8DCf2XtPvzQyON2bfvWps9hDyXp7C0113oKqvrsOm00ZD2emTHFcpi5naC5KZEIN0KB2j6QVCdtVc7/GCQuPf2zNXcdrQeD1nNE5XKS6ggpN1lOuKPljpdjfbfsjF/HHyn0TlMRFveIkhpDk29MhhzKDos9rym+hvN84b1Wgxx/1KnwujsGh0d1f+28AfgpTmM}    ufo.sogou-inc.com   /   连线时段    336 B       
    if (!req.cookies['jpassport-sp']) {
        err = new Error('Not Logined');
        err.status = 500;
        next(err);
    } else {
        username = (req.cookies['jpassport-sp'].match(/username:([^,@]+)/) || [null, 'anonymous'])[1];
        req.username = username;
        next();
    }
});


app.use('/', routes);
app.use('/users', users);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
