var mongoClient = require('../mongodb/client');
var respond = require('../respond');
var async = require('async');

exports.find = function (req, res) {
  res.set('Access-Control-Allow-Origin', '*')

  var serverName = req.param('serverName');

  var findServer = function (err, client) {
    if (err) {
      res.statusCode = 404;
      res.send('Connect to mongo server failed');
    }
    var admin = client.db('test').admin();
    admin.listDatabases(function (err, dbs) {
      if (err)res.statusCode = 404;
      res.send(respond(err, dbs));
    });
  };

  mongoClient(serverName, findServer);
}
