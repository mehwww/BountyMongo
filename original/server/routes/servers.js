var mongoClient = require('../lib/mongodb/mongo_client');
var mongoServer = require('../lib/mongodb/mongo_server');
var mongoDatabase = require('../lib/mongodb/mongo_database');
var respond = require('../lib/respond')
var async = require('async');
var _ = require('underscore')
var util = require('util')



//exports.list = function (req, res) {
//  try {
//    res.send(respond(null, mongoServer.listServer()))
//    console.log('cookies',req.headers)
//  }
//  catch (err) {
//    res.statusCode = 404;
//    res.send(respond(err, null))
//  }
//}

exports.find = function (req, res) {
//  var serverName = req.param('serverName');
  var serverUrl = req.headers['mongodb-url']
  async.waterfall([
    function (callback) {
      mongoClient.getClient(serverUrl, callback)
    },
    function (db, callback) {
      mongoServer.serverStatus(db, callback)
    }
  ], function (err, result) {
    if (err) res.statusCode = 404;
    res.send(respond(err, result))
  })
}

//exports.add = function (req, res) {
//  var mongodbUrl = req.body.url;
//  try {
//    res.send(respond(null, mongoServer.addServer(mongodbUrl)));
//  }
//  catch (err) {
//    console.log(err)
//    if (err) res.statusCode = 404;
//    res.send(err)
//  }
//}

//exports.update = function (req, res) {
//  var serverName = req.param('serverName');
//  var mongodbUrl = req.body.url;
//  try {
//    res.send(respond(null, mongoServer.updateServer(serverName, mongodbUrl)));
//  }
//  catch (err) {
//    if (err) res.statusCode = 404;
//    res.send(respond(err, null))
//  }
//}
//
//exports.delete = function (req, res) {
//  var serverName = req.param('serverName');
//  try {
//    res.send(respond(null, mongoServer.deleteServer(serverName)));
//  }
//  catch (err) {
//    if (err) res.statusCode = 404;
//    res.send(respond(err, null))
//  }
//}