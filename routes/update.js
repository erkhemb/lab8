var express = require('express');
var router = express.Router();
var ObjectId = require('mongodb').ObjectId;

router.get('/update/:id', function (req, res, next) {
  req.db.locations.findOne({ "_id": new ObjectId(req.params.id) }, {}, function (err, result) {
    res.render('update', { errors: null, location: result });
  });
});

router.post('/update', function (req, res, next) {
  console.log("id: "+req.body.id)
  var _id = req.body.id;
  var name = req.body.fullname;
  var type = req.body.type;
  var lat = req.body.lat;
  var lon = req.body.lon;
  lat = lat * 1.0;
  lon = lon * 1.0;
  var location = { $set: { "name": name, "category": type, loc: { "lat": lat, "long": lon } } };

  req.db.locations.findOneAndUpdate({ "_id": new ObjectId(_id) }, location);

  res.redirect('/');
});

module.exports = router;
