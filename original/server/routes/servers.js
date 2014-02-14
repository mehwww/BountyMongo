var mongoClient = require('../lib/mongodb/mongo_client');
var mongoServer = require('../lib/mongodb/mongo_server');
var mongoDatabase = require('../lib/mongodb/mongo_database');
var respond = require('../lib/respond')
var async = require('async');
var _ = require('underscore')
var util = require('util')


exports.list = function (req, res) {
//  try {
//    var serverList = mongoServer.listServer();
//  }
//  catch (err) {
//    res.statusCode = 404;
//    res.send(respond(err, null))
//  }

//  for (var key in serverList) {
//    console.log(key)
//  }

//  for (var key in serverList) {
////    console.log(key)
//    statsFuncList[key] = function (callback) {
//      console.log(util.inspect(this))
//      async.waterfall([
//        function (_callback) {
//          mongoClient.getClient(key, _callback)
//        },
//        function (db, _callback) {
//          mongoDatabase.stats(db, _callback)
//        }
//      ], function (err, result) {
////        console.log('err', err)
////        console.log('result', result)
//        callback(null,result);
//      })
//    }
//  }
//
//  async.parallel(statsFuncList,function(err,result){
//    console.log('---------------------------------')
////    console.log('err', err)
////    console.log('result', result)
//    console.log('---------------------------------')
//  })

//  var listLength = _.size(serverList);
//  var flag = 0;
//  var list = {};
//
//  for (var key in serverList) {
//    async.waterfall([
//      function (callback) {
//        console.log(key)
//        mongoClient.getClient(key, callback)
//      },
//      function (db, callback) {
//        mongoDatabase.stats(db, callback)
//      }
//    ], function (err, result) {
//      flag = flag + 1;
//      console.log(flag)
//      list[key] = respond(err, result)
//      if(flag === listLength){
//        res.send(list)
//      }
//    })
//  }
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
  var dbName = 'admin';
  if (serverName.indexOf("/") != -1) {
    dbName = serverName.split("/")[1];
  }
  if (dbName !== 'admin') {
    res.statusCode = 404;
    res.send(respond("It's not an admin account", null))
    return
  }
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