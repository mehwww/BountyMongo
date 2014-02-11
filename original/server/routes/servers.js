var mongoClient = require('../mongodb/mongo_client');
var mongoServer = require('../mongodb/mongo_server');
var async = require('async');

exports.list = function (req, res) {
  try {
    res.send(mongoServer.listServer())
  }
  catch (err) {
    res.statusCode = 404;
    res.send({
      ok: 0,
      errmsg: err.toString()
    })
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
    if (err) {
      res.statusCode = 404;
      res.send({
        ok:0,
        errmsg:err.toString()
      });
    }
    else {
      res.send(result);
    }
  })
}

exports.add = function (req, res) {
  var mongodbUrl = req.body.url;
  try {
    res.send(mongoServer.addServer(mongodbUrl));
  }
  catch (err) {
    res.statusCode = 404;
    res.send({
      ok: 0,
      errmsg: err.toString()
    })
  }
}

exports.update = function (req, res) {
  var serverName = req.param('serverName');
  var mongodbUrl = req.body.url;
  try {
    res.send(mongoServer.updateServer(serverName, mongodbUrl));
  }
  catch (err) {
    res.statusCode = 404;
    res.send({
      ok: 0,
      errmsg: err.toString()
    })
  }
}

exports.delete = function (req, res) {
  var serverName = req.param('serverName');
  try {
    res.send(mongoServer.deleteServer(serverName));
  }
  catch (err) {
    res.statusCode = 404;
    res.send({
      ok: 0,
      errmsg: err.toString()
    })
  }
}