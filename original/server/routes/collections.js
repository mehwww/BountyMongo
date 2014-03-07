var mongoClient = require('../lib/mongodb/mongo_client');
var mongoDatabase = require('../lib/mongodb/mongo_database');
var mongoCollection = require('../lib/mongodb/mongo_collection');
var BountyError = require('../lib/customError').bountyError;
var respond = require('../lib/respond')
var async = require('async');

var queryStringParser = function (queryString) {
  queryString = queryString || {}
  var query;
  var limit;
  var skip;
  var sort;
  //query parameters
  query = queryString.q
    ? JSON.parse(queryString.q)
    : {}
  //sort parameters
  sort = queryString.s
    ? JSON.parse(queryString.s)
    : {}
  //limit parameters
  limit = queryString.l ? queryString.l : 20;
  //skip parameters
  skip = queryString.p ? (queryString.p - 1) * limit : 0;

//console.log(sort)

  return {
    query: query,
    options: {
      limit: limit,
      skip: skip,
      sort: sort
//      fields:{
////        a:1,
//        'b.x':1
//      }
    }
  }
}


exports.list = function (req, res) {
//  var serverName = req.param('serverName');
  var serverUrl = req.headers['mongodb-url']
  var databaseName = req.param('databaseName');

  async.waterfall([
    function (callback) {
      mongoClient.getClient(serverUrl, callback)
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
//  var serverName = req.param('serverName');
  var serverUrl = req.headers['mongodb-url']
  var databaseName = req.param('databaseName');
  var collectionName = req.param('collectionName');
  var queryString;

  try {
    queryString = queryStringParser(req.query);
  }
  catch (e) {
    res.statusCode = 400;
    res.send(respond(new BountyError('Invaild query string'), null))
  }

  async.waterfall([
    function (callback) {
      mongoClient.getClient(serverUrl, callback)
    },
    function (db, callback) {
      db.db(databaseName).collection(collectionName, function (err, collection) {
        callback(err, collection)
      });
    },
    function (collection, callback) {
      mongoCollection.find(collection, queryString.query, queryString.options, callback)
    }
  ], function (err, result) {
    if (err) res.statusCode = 404;
    res.send(respond(err, result))
  })
}

exports.count = function (req, res) {
  var serverUrl = req.headers['mongodb-url'];
  var databaseName = req.param('databaseName');
  var collectionName = req.param('collectionName');

  var queryString = queryStringParser(req);
  if (!queryString) {
    res.statusCode = 400;
    res.send(respond('Invaild query string', null))
  }


  async.waterfall([
    function (callback) {
      mongoClient.getClient(serverUrl, callback)
    },
    function (db, callback) {
      db.db(databaseName).collection(collectionName, function (err, collection) {
        callback(err, collection)
      });
    },
    function (collection, callback) {
      mongoCollection.count(collection, queryString.query, queryString.options, callback)
    }
  ], function (err, result) {
    if (err) res.statusCode = 404;
    res.send(respond(err, {count: result}))
  })
}


exports.add = function (req, res) {
  var serverUrl = req.headers['mongodb-url'];
  var databaseName = req.param('databaseName');
  var collectionName = req.param('collectionName');
  var document = req.body.document;

  async.waterfall([
    function (callback) {
      mongoClient.getClient(serverUrl, callback)
    },
    function (db, callback) {
      db.db(databaseName).collection(collectionName, function (err, collection) {
        callback(err, collection)
      });
    },
    function (collection, callback) {
      mongoCollection.insert(collection, document, callback)
    }
  ], function (err, result) {
    if (err) res.statusCode = 404;
    res.send(respond(err, {count: result}))
  })
}



