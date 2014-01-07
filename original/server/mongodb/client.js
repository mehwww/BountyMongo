var MongoClient = require('mongodb').MongoClient,
	Server = require('mongodb').Server;

var clientInstance = {};

module.exports = function(host, callback) {
	if (clientInstance[host]) {
		callback(clientInstance[host]);
		return
	};
	var mongoServer = new Server(host, 27017, {
		auto_reconnect: true
	})
	var mongoClient = new MongoClient(mongoServer);
	mongoClient.open(function(err, client) {
		if (err) callback(null);
		// if (err) throw err;
		clientInstance[host] = client;
		callback(client);
	})
}

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