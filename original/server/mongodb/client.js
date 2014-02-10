var MongoClient = require('mongodb').MongoClient;
//var Server = require('mongodb').Server;

var fs = require('fs')
var util = require('util');


var clientInstance = {};

exports.getClient = function (serverName, callback) {
  if (clientInstance[serverName]) {
    return callback(null, clientInstance[serverName])
  }
  var serverList = JSON.parse(fs.readFileSync('./serverList.json').toString());
  var server = serverList[serverName];
  if (!server) {
    var err = new Error('pls add this server first');
    return callback(err, null);
  }
  var serverUrl = serverList[serverName].url

  MongoClient.connect(serverUrl, function (err, db) {
    if (err)return callback(err, db);
    clientInstance[serverName] = db;
    return callback(null, db);
  })
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