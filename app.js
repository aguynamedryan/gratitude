
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var GratitudeProvider = require('./gratitudeprovider.js').GratitudeProvider;

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('view options', {layout: false});
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.bodyParser());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

var gratitudeProvider = new GratitudeProvider('localhost', 27017)

app.locals.moment = require('moment');

// Routes

app.get('/', function(req, res) {
  gratitudeProvider.findAll(function(error, grats) {
    res.render('index', {
      title: "What You're Grateful For",
      gratitudes: grats.reverse()
    });
  });
});

app.get('/gratitude/new', function(req, res) {
  res.render('gratitude_new', {
    title: 'New Thanks'
  });
});

app.post('/gratitude/new', function(req, res) {
  gratitudeProvider.save({
    what: req.param('what')
  }, function(error, docs) {
    res.redirect('/')
  });
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
