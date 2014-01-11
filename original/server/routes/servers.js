var mongoClient = require('../mongodb/client');
var respond = require('../respond');
var async = require('async');

exports.find = function (req, res) {
//mongoClient(req.param('serverName'),req.param())
  var serverName = req.param('serverName');
  var server = serverName.split(':', 2);
  var host = server[0];
  var port = server[1];

  var findServer = function (err, client) {
    if (err) return res.send('Connect to mongo server failed');
    var admin = client.db('test').admin();
    admin.listDatabases(function (err, dbs) {
      res.set('Access-Control-Allow-Origin', '*')
      res.send(respond(err, dbs));
    });
  };

  mongoClient(host, port, findServer);
}
