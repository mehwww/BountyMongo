var mongoClient = require('../mongodb/client'),
	respond = require('../respond'),
	async = require('async');

exports.findAll = function(req, res) {
	mongoClient(req.param('server_name'), function(client) {
		if (!client) return res.send('Connect to mongo server failed')
		var admin = client.db('test').admin();
		admin.listDatabases(function(err, dbs) {
            res.set('Access-Control-Allow-Origin','*')
			res.send(respond(err, dbs));
		});
	})
}


exports.find = function(req, res) {
	mongoClient(req.param('server_name'), function(client) {
		if (!client) return res.send('Connect to mongo server failed')
		var db = client.db(req.param('db_name'));
		async.parallel({
			stats: function(callback) {
				db.stats(function(err, stats) {
					callback(err, stats)
				})
			},
			collectionNames: function(callback) {
				db.collectionNames(function(err, items) {
					callback(err, items)
				})
			},
			users: function(callback) {
				db.collection('system.users').find().toArray(function(err,docs) {
					callback(err,docs)
				})
			}
		}, function(err, result) {
            res.set('Access-Control-Allow-Origin','*')
			res.send(respond(err, result));
		})
	})
}

exports.add = function(req, res) {
	mongoClient(req.param('server_name'), function(client) {
		if (!client) return res.send('Connect to mongo server failed')
		var db = client.db(req.param('db_name'));
		async.parallel({
			stats: function(callback) {
				db.stats(function(err, stats) {
					callback(err, stats)
				})
			},
			collectionNames: function(callback) {
				db.collectionNames(function(err, items) {
					callback(err, items);
				})
			}
		}, function(err, result) {
			res.send(respond(err, result));
		})
	})
}

exports.delete = function(req, res) {
	mongoClient(req.param('server_name'), function(client) {
		if (!client) return res.send('Connect to mongo server failed')
		var db = client.db(req.param('db_name'));
		db.dropDatabase(function(err, result) {
			res.send(respond(err, result));
		})
	})
}

exports.update = function(req, res) {
	res.send("TBD");
}