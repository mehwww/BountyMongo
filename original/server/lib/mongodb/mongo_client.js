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
  console.log(server)

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
      return callback(new MongoError(err.err), client)
    }
    var db = client.db(server.dbName);
    if (server.username) {
      db.authenticate(server.username, server.password, function (err, result) {
        if (err)return callback(err, result)
        clientInstance[server.name] = db;
        return callback(null, db)
      })
    }
    else {
      return callback(null, db)
    }
  })

//  var serverList = JSON.parse(fs.readFileSync('./serverList.json').toString());
//  var server = serverList[serverName];
//  if (!server) return callback(new BountyError('need add first'), null);
//  var serverUrl = server.url
////  setTimeout(function () {
////    callback(new BountyError('connect time out'), null)
////  }, 2000);
//  MongoClient.connect(serverUrl, {
//    server: {
//      socketOptions: {
////        noDelay:true
////        timeout:2000
//        connectTimeoutMS: 2000
//      }
//    }
//  }, function (err, db) {
//    if (err)return callback(err, null);
//    clientInstance[serverName] = db;
//    return callback(null, db);
//  })
};

exports.deleteClient = function (serverName) {
  if (clientInstance[serverName]) {
    clientInstance[serverName].close();
    delete clientInstance[serverName];
  }
}


//module.exports = function (serverName, callback) {
//  var server = serverName.split(':', 2)
//  var host = server[0];
//  var port = server[1];
//
//  if (clientInstance[host + ':' + port]) {
//    callback(null, clientInstance[host + ':' + port]);
//    return
//  }
//  var mongoServer = new Server(host, port ? port : 27017, {
//    auto_reconnect: true
//  });
//  var mongoClient = new MongoClient(mongoServer);
//  mongoClient.open(function (err, client) {
//    if (err) callback(err, null);
//    clientInstance[host + ':' + port] = client;
//    callback(null, client);
//  })
//};
//
// module.exports = function(callback) {
// 	if (clientInstance) {
// 		callback(clientInstance);
// 		return;
// 	};
// 	var mongoServer = new Server('localhost', 27017, {
// 		auto_reconnect: true
// 	})
// 	var mongoClient = new MongoClient(mongoServer);
// 	mongoClient.open(function(err, client) {
// 		if (err) throw err;
// 		clientInstance = client;
// 		callback(client);
// 	})
// }


// MongoClient.connect('mongodb://localhost:27017/admin', function(err, db) {
// 	if (err) throw err;

// 	db.command({
// 		hostInfo: 1
// 	}, function(err, result) {
// 		if (err) throw err;
// 		console.log(util.inspect(result, {
// 			depth: null,
// 			colors: true
// 		}))
// 		db.close();
// 	});
// })