var express = require('express');
var router = express.Router();

var lastlane1 = Date.now();
var lastlane2 = Date.now();
var fastest = 10000000000000;
var fastestLane2;
var lane1lap =0;
var lane2lap =0;
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'Express'
  });
});

router.get('/lanedata', function(req, res, next) {
  var io = req.app.get('socketio');
  var laptime = 0;
  //console.log(req.query);
  if (req.query.lane == 'lane1') {
    if (req.query.value == '1') {
      laptime = Date.now() - lastlane1;
      if (laptime > 1000) {
        lane1lap++;
        laptime = laptime/1000
        lastlane1 = Date.now();
        var json = {
          lane: req.query.lane,
          laptime: laptime
        }
        //console.log(req.query.lane+" "+laptime);
        io.emit('test', json);
        if (laptime < fastest) {
          fastest = laptime;
        }
      }

    }
  }
  if (req.query.lane == 'lane2') {
    if (req.query.value == '1') {
      laptime = Date.now() - lastlane2;
      if (laptime > 1000) {
        lane2lap++;
        laptime = laptime/1000
        lastlane2 = Date.now();
        var json = {
          lane: req.query.lane,
          laptime: laptime
        }
        //console.log(req.query.lane+" "+laptime);
        io.emit('test', json);
        if (laptime < fastest) {
          fastest = laptime;
        }
      }
    }
  }

  var winner = "lane1";
  if (lane1lap < lane2lap) {
    winner = "lane2";
  }
  if(lane1lap==lane2lap && lastlane1 < lastlane2){
    winner = "lane2"
  }
  var json = {
    winner: winner,
    fastest: fastest
  }
  //console.log(req.query.lane+" "+laptime);
  io.emit('update', json);
  var elem = document.getElementById('content');
  elem.scrollTop = elem.scrollHeight;

  res.send("ok");
});

module.exports = router;
