var MongoClient = require('mongodb').MongoClient;
var Server = require('mongodb').Server;
var BountyError = require('../customError').bountyError;
var MongoError = require('../customError').mongoError;
var urlParser = require('./url_parser');

var net = require('net');
var fs = require('fs')
var util = require('util');


var clientInstance = {};

exports.getClient = function (serverUrl, callback) {
  var server = urlParser(serverUrl);

  if (clientInstance[server.name]) {
    return callback(null, clientInstance[server.name])
  }

  var mongoClient = new MongoClient(new Server(server.host, server.port, {
    socketOptions: {
      connectTimeoutMS: 2000
    }
  }));

  mongoClient.open(function (err, client) {
    if (err) {
      console.log(err)
      return callback(new MongoError('connect failed'), client)
    }
    var db = client.db(server.dbName);
    if (server.username) {
      db.authenticate(server.username, server.password, function (err, result) {
        if (err)return callback(err, result)
        console.log('new client instance: ',server.name)
        clientInstance[server.name] = db;
        return callback(null, db)
      })
    }
    else {
      console.log('new client instance: ',server.name)
      clientInstance[server.name] = db;
      return callback(null, db)
    }
  })
};

exports.deleteClient = function (serverUrl) {
  var server = urlParser(serverUrl);

  if (clientInstance[server.name]) {
    clientInstance[server.name].close();
    delete clientInstance[server.name];
  }
}