var mongoClient = require('../lib/mongodb/mongo_client');
var mongoServer = require('../lib/mongodb/mongo_server');
var respond = require('../lib/respond')
var async = require('async');

exports.list = function (req, res) {
  try {
    res.send(respond(null, mongoServer.listServer()))
  }
  catch (err) {
    res.statusCode = 404;
    res.send(respond(err, null))
  }
}

exports.find = function (req, res) {
  var serverName = req.param('serverName');
  async.waterfall([
    function (callback) {
      mongoClient.getClient(serverName, callback)
    },
    function (db, callback) {
      mongoServer.serverStatus(db, callback)
    }
  ], function (err, result) {
    if (err) res.statusCode = 404;
    res.send(respond(err, result))
//
//    if (err) {
//      res.statusCode = 404;
//      res.send({
//        ok: 0,
//        errmsg: err.toString()
//      });
//    }
//    else {
//      res.send(result);
//    }
  })
}

exports.add = function (req, res) {
  var mongodbUrl = req.body.url;
  try {
    res.send(respond(null, mongoServer.addServer(mongodbUrl)));
  }
  catch (err) {
    if (err) res.statusCode = 404;
    res.send(respond(err, null))
  }
}

exports.update = function (req, res) {
  var serverName = req.param('serverName');
  var mongodbUrl = req.body.url;
  try {
    res.send(respond(null, mongoServer.updateServer(serverName, mongodbUrl)));
  }
  catch (err) {
    if (err) res.statusCode = 404;
    res.send(respond(err, null))
  }
}

exports.delete = function (req, res) {
  var serverName = req.param('serverName');
  try {
    res.send(respond(null, mongoServer.deleteServer(serverName)));
  }
  catch (err) {
    if (err) res.statusCode = 404;
    res.send(respond(err, null))
  }
}