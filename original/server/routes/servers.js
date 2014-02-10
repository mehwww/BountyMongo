var mongoClient = require('../mongodb/client');
var server = require('../mongodb/server');
var async = require('async');

exports.find = function (req, res) {
  var serverName = req.param('serverName');
  async.waterfall([
    function (callback) {
      mongoClient.getClient(serverName, callback)
    },
    function (db, callback) {
      server.serverStatus(db, callback)
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

exports.list = function (req, res) {
  try {
    res.send(server.listServer())
  }
  catch (err) {
    res.statusCode = 404;
    res.send({
      ok: 0,
      errmsg: err.toString()
    })
  }
}

exports.add = function (req, res) {
  var mongodbUrl = req.body.url;
  try {
    res.send(server.addServer(mongodbUrl));
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
    res.send(server.updateServer(serverName, mongodbUrl));
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
    res.send(server.deleteServer(serverName));
  }
  catch (err) {
    res.statusCode = 404;
    res.send({
      ok: 0,
      errmsg: err.toString()
    })
  }
}