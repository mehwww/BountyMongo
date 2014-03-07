var MongoClient = require('mongodb').MongoClient;
var Server = require('mongodb').Server;
var Db = require('mongodb').Db;
var BountyError = require('../customError').bountyError;
var MongoError = require('../customError').mongoError;
var urlParser = require('./url_parser');

var events = require('events');
var util = require('util');
var eventEmitter = new events.EventEmitter();

var clientInstance = {};

var clearInstanceClock = function () {
  for (var instance in clientInstance) {
    clientInstance[instance].close(function (err, result) {
      console.log('close', instance, result)
    })
  }
  clientInstance = {};
  console.log('clear instances')
  setTimeout(function () {
    clearInstanceClock()
  }, 5 * 60 * 1000)
}

clearInstanceClock()

exports.getClient = function (serverUrl, callback) {
  var server = urlParser(serverUrl);

  if (clientInstance[server.name] !== undefined) {
    if (clientInstance[server.name] instanceof Db) {
      return callback(null, clientInstance[server.name])
    }
    else {
      return eventEmitter.once('getInstance', function (instance) {
//        clientInstance[server.name] = instance;
        return callback(null, clientInstance[server.name])
      })
    }
  }

  clientInstance[server.name] = {};
  eventEmitter.once('getInstance', function (instance) {
    clientInstance[server.name] = instance;
    return callback(null, clientInstance[server.name])
  })

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
        console.log('new client instance: ', server.name)
        eventEmitter.emit('getInstance', db)

//        clientInstance[server.name] = db;
//        return callback(null, db)
      })
    }
    else {
      console.log('new client instance: ', server.name)
      eventEmitter.emit('getInstance', db)

//      clientInstance[server.name] = db;
//      return callback(null, db)
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