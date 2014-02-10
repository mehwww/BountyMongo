var mongoClient = require('../mongodb/client');
var server = require('../mongodb/server');
var respond = require('../respond');
var async = require('async');

exports.find = function (req, res) {
  var serverName = req.param('serverName');
  async.waterfall([
    function (callback) {
      mongoClient(serverName, callback)
    },
    function (db, callback) {
      server.serverStatus(db, callback)
    }
  ], function (err, result) {
    if (err) {
      res.statusCode = 404;
      res.send(err);
    }
    else {
      res.send(result);
    }
  })
}

exports.list = function (req, res) {
  res.send(server.listServer())
}
