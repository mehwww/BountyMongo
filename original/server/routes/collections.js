var mongoClient = require('../mongodb/client');
var respond = require('../respond');
var async = require('async');

exports.find = function (req, res) {
  var serverName = req.param('serverName');
  var databaseName = req.param('databaseName');
  var collectionName = req.param('collectionName');

  var findCollection = function(err,client){
    if (err) return res.send('Connect to mongo server failed');
    var collection = client.db(databaseName).collection(collectionName);
    async.parallel({
      find: function (callback) {
        var query = eval('(' + req.query.query + ')');
        var limit = req.query.limit;
        var page = req.query.page;
        var options = {
          limit: limit ? limit : 20,
          skip: page ? (page - 1) * req.query.limit : 0
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
      res.set('Access-Control-Allow-Origin', '*')
      res.send(respond(err, result));
    })
  }

  mongoClient(serverName,findCollection);
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