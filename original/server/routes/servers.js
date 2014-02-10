var mongoClient = require('../mongodb/client');
var server = require('../mongodb/server');
//var respond = require('../respond');
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

exports.add = function (req, res) {
  var mongodbUrl = req.body.url;
  res.send(server.addServer(mongodbUrl));
}

exports.update = function(req,res){
  var serverName = req.param('serverName');
  var mongodbUrl = req.body.url;
  res.send(server.updateServer(serverName,mongodbUrl));
}

exports.delete = function(req,res){
  var serverName = req.param('serverName');
  res.send(server.deleteServer(serverName));
}