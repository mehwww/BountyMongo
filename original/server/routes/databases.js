var mongoClient = require('../lib/mongodb/mongo_client');
var mongoDatabase = require('../lib/mongodb/mongo_database')
var respond = require('../lib/respond')
var async = require('async');

exports.list = function (req, res) {
  var serverName = req.param('serverName');
  async.waterfall([
    function (callback) {
      mongoClient.getClient(serverName, callback)
    },
    function (db, callback) {
      mongoDatabase.listDatabases(db, callback)
    }
  ], function (err, result) {
    if (err) res.statusCode = 404;
    res.send(respond(err, result))
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
      mongoDatabase.stats(db.db(databaseName), callback)
    }
  ], function (err, result) {
    if (err) res.statusCode = 404;
    res.send(respond(err, result));
  })
}

exports.delete = function (req, res) {
  var serverName = decodeURIComponent(req.param('serverName'));
  var databaseName = req.param('databaseName');

  async.waterfall([
    function (callback) {
      mongoClient.getClient(serverName, callback)
    },
    function (db, callback) {
      mongoDatabase.dropDatabase(db, databaseName, callback)
    }
  ], function (err, result) {
    if (err) res.statusCode = 404;
    res.send(respond(err, result))
  })
}

exports.update = function (req, res) {
  res.send("TBD");
}