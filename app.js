var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var mongo = require('mongoskin');
var db = mongo.db("mongodb://localhost:27017/homework8", { native_parser: true });
db.bind('locations');

var ObjectId = require('mongodb').ObjectId;

var index = require('./routes/index');
var update = require('./routes/update');

var app = express();

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
  req.db = db;
  next();
  // db.close();
});

app.use('/', index);
app.use('/', update);

app.get('/delete/:id', function (req, res, next) {
  db.locations.removeOne({ "_id": new ObjectId(req.params.id) }, function (err, result) {
    if (err) return next(err);
  });
  res.redirect('/');
});

app.get('/edit/:id', function (req, res) {

  db.locations.findOne({ "_id": new ObjectId(req.params.id) }, {}, function (err, result) {
    res.render('edit', { errors: null, csrfToken: req.csrfToken(), location: result });
  });
});

app.post('/update', function (req, res) {
  var _id = req.body.id;
  var name = req.body.fullname;
  var type = req.body.type;
  var lat = req.body.lat;
  var lon = req.body.lon;
  lat = lat * 1.0;
  lon = lon * 1.0;
  var location = { $set: { "name": name, "category": type, loc: { "lat": lat, "long": lon } } };

  db.locations.findOneAndUpdate({ "_id": new ObjectId(_id) }, location);

  res.redirect('/');
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(8000);

module.exports = app;
