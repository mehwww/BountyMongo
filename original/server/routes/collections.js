var mongoClient = require('../mongodb/client');
var respond = require('../respond');
var async = require('async');

exports.find = function (req, res) {
//  res.set('Access-Control-Allow-Origin', '*')

  var serverName = req.param('serverName');
  var databaseName = req.param('databaseName');
  var collectionName = req.param('collectionName');

  //query parameters
  if (req.query.q) {
    try {
      var query = JSON.parse(req.query.q);
    }
    catch (e) {
      res.statusCode = 400;
      res.send(respond('Invaild query string'))
    }
  }

  //limit parameters
  var limit = req.query.l ? req.query.l : 20;
  //skip parameters
  var skip = req.query.p ? (req.query.p - 1) * limit : 0;

  var findCollection = function (err, client) {
    if (err) {
      res.statusCode = 404;
      res.send('Connect to mongo server failed');
    }
    var collection = client.db(databaseName).collection(collectionName);
    async.parallel({
      count: function (callback) {
        collection.count(query, function (err, count) {
          callback(err, count)
        })
      },
      find: function (callback) {
        var options = {
          limit: limit,
          skip: skip
        }
        collection.find(query, options).toArray(function (err, docs) {
          callback(err, docs)
        })
      },
      isCapped: function (callback) {
        collection.isCapped(function (err, capped) {
          callback(err, capped)
        })
      },
      options: function (callback) {
        collection.options(function (err, options) {
          callback(err, options)
        })
      }
    }, function (err, result) {
//      res.set('Access-Control-Allow-Origin', '*')
      if (err)res.statusCode = 404;
      res.send(respond(err, result));
    })
  }

  mongoClient(serverName, findCollection);
}

exports.add = function (req, res) {
  mongoClient(function (client) {
    var collection = client.db(req.param('db_name')).collection(req.param('collection_name'));
    collection.insert(req.body, {
      forceServerObjectId: true
    }, function (err, result) {
      if (err) {
        res.send(respond.error({
          name: err.name,
          err: err.err
        }))
      } else {
        res.send(respond.success(result))
      }
    })
  })
}

exports.delete = function (req, res) {
  mongoClient(function (client) {
    var collection = client.db(req.param('db_name')).collection(req.param('collection_name'));
    collection.remove(function (err, result) {
      if (err) {
        res.send(respond.error({
          name: err.name,
          err: err.err
        }))
      } else {
        res.send(respond.success(result))
      }
    })
  })
}