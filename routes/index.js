var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {

  req.db.collection('locations').find({}).toArray(function (err, results) {
    res.render('index', { errors: null, results: results });
  });
});

router.post('/add', function (req, res, next) {
  var name = req.body.name;
  var category = req.body.category;
  var lon = req.body.lon;
  var lat = req.body.lat;

  req.db.collection('locations').insert(req.body, function (err, results) {
    if (err) return next(err);
    res.redirect('/');
  })
});

module.exports = router;
