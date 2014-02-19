var mongoClient = require('../lib/mongodb/mongo_client');
var mongoDatabase = require('../lib/mongodb/mongo_database')
var mongoCollection = require('../lib/mongodb/mongo_collection')
var respond = require('../lib/respond')
var async = require('async');

exports.list = function (req, res) {
  var serverName = req.param('serverName');
  var databaseName = req.param('databaseName');

  async.waterfall([
    function (callback) {
      mongoClient.getClient(serverName, callback)
    },
    function (db, callback) {
      mongoDatabase.collectionNames(db.db(databaseName), callback)
    }
  ], function (err, result) {
    if (err) res.statusCode = 404;
    res.send(respond(err, result))
  })

}

exports.find = function (req, res) {
  var serverName = req.param('serverName');
  var databaseName = req.param('databaseName');
  var collectionName = req.param('collectionName');

  var queryString = queryStringParser(req);
  if(!queryString){
    res.statusCode = 400;
    res.send(respond('Invaild query string', null))
  }

  async.waterfall([
    function (callback) {
      mongoClient.getClient(serverName, callback)
    },
    function (db, callback) {
      mongoCollection.find(db.db(databaseName), collectionName, queryString.query, queryString.options, callback)
    }
  ], function (err, result) {
    if (err) res.statusCode = 404;
    res.send(respond(err, result))
  })
}

exports.count = function(req,res){
  res.send('asdf')
}


var queryStringParser = function(req){
  var query;
  var limit;
  var skip;
  //query parameters
  if (req.query.q) {
    try {
      query = JSON.parse(req.query.q);
    }
    catch (err) {
      return null
    }
  }
  //limit parameters
  limit = req.query.l ? req.query.l : 20;
  //skip parameters
  skip = req.query.p ? (req.query.p - 1) * limit : 0;
  return {
    query:query,
    options:{
      limit: limit,
      skip: skip
    }
  }
}
