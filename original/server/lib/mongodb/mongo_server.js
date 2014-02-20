var mongoClient = require('./mongo_client');
var urlParser = require('./url_parser');
var BountyError = require('../customError').bountyError;
var path = require('path');
var fs = require('fs');


exports.serverStatus = function (db, callback) {
  var admin = db.admin();
  admin.serverStatus(function (err, info) {
    return callback(err, info)
  })
}

exports.stats = function (db, callback) {
  db.stats(callback)
//  db.stats(function(err,pingResult){
//    return callback(err,pingResult)
//  })
}

exports.listServer = function () {
  var list = JSON.parse(fs.readFileSync('./serverList.json').toString());
  for (var key in list) {
    delete list[key].url
  }
  return list;
}

exports.addServer = function (url) {
  if (!url) {
    throw new BountyError('need mongodb url')
  }
  var server = urlParser(url);
  var serverList = JSON.parse(fs.readFileSync('./serverList.json').toString())
  var newServer = {};

  if (serverList[server.name]) {
    throw new BountyError('record already exists')
  }

  serverList[server.name] = {
    url: server.url,
    dbName: server.dbName
  };
  fs.writeFileSync('./serverList.json', JSON.stringify(serverList, null, 2))
  //no need
  mongoClient.deleteClient(server.name);

  newServer[server.name] = {
    url: server.url,
    dbName: server.dbName
  }
  return newServer;
}

exports.updateServer = function (serverName, url) {
  var server = urlParser(url)
  var serverList = JSON.parse(fs.readFileSync('./serverList.json').toString())
//  if (!server) {
//    throw new BountyError('invaild mongodb url')
//  }
  if (!serverList[serverName]) {
    throw new BountyError('record does not exists')
  }
  if (serverName !== server.name) {
    throw new BountyError('mongodb url does not match')
  }
  serverList[serverName] = {url: server.url};
  fs.writeFileSync('./serverList.json', JSON.stringify(serverList, null, 2))
  mongoClient.deleteClient(serverName);
  return serverList;
}

exports.deleteServer = function (serverName) {
  var serverList = JSON.parse(fs.readFileSync('./serverList.json').toString())
  if (!serverList[serverName]) {
    throw new BountyError('record does not exists')
  }
  delete serverList[serverName];
  fs.writeFileSync('./serverList.json', JSON.stringify(serverList, null, 2))
  mongoClient.deleteClient(serverName);
  return serverList;
}