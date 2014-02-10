var MongoClient = require('mongodb').MongoClient;
var Server = require('mongodb').Server;
var serverList = require('../serverList.json')

var clientInstance = {};

/**
 *
 * @param serverName
 * @param callback
 */
module.exports = function (serverName, callback) {

  if (clientInstance[serverName]) {
    callback(null, clientInstance[serverName])
  }

  var server = serverList[serverName];
  if (!server) {
    var err = {
      "ok": 0,
      "errmsg": "pls add this server first"
    }
    callback(err, null)
  }
  var serverUri = serverList[serverName].url

  MongoClient.connect(serverUri, function (err, db) {
    if (err)callback(err.client);
    clientInstance[serverName] = db;
    callback(null, db);
  })
};

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