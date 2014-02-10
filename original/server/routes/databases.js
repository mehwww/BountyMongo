var mongoClient = require('../mongodb/client');
var database = require('../mongodb/database')
var async = require('async');

exports.list = function (req, res) {
  var serverName = req.param('serverName');
  async.waterfall([
    function (callback) {
      mongoClient.getClient(serverName, callback)
    },
    function (db, callback) {
      database.listDatabases(db, callback)
    }
  ], function (err, result) {
    if (err) {
      res.statusCode = 404;
      res.send({
        ok: 0,
        errmsg: err.toString()
      });
    }
    else {
      res.send(result.databases);
    }
  })
}


exports.find = function (req, res) {
  var serverName = req.param('serverName');
  var databaseName = req.param('databaseName');

  async.waterfall([
    function (callback) {
      mongoClient.getClient(serverName, callback)
    },
    function (db, callback) {
      database.stats(db, databaseName, callback)
    }
  ], function (err, result) {
    if (err) {
      res.statusCode = 404;
      res.send({
        ok: 0,
        errmsg: err.toString()
      });
    }
    else {
      res.send(result);
    }
  })
}

exports.delete = function (req, res) {
  var serverName = req.param('serverName');
  var databaseName = req.param('databaseName');

  async.waterfall([
    function (callback) {
      mongoClient.getClient(serverName, callback)
    },
    function (db, callback) {
      database.dropDatabase(db, databaseName, callback)
    }
  ], function (err, result) {
    if (err) {
      res.statusCode = 404;
      res.send({
        ok: 0,
        errmsg: err.toString()
      });
    }
    else {
      res.send(result);
    }
  })
}

exports.update = function (req, res) {
  res.send("TBD");
}