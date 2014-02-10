//var serverList = require('./serverList.json');
var urlParser = require('./url_parser');
var path = require('path');
var fs = require('fs');


exports.serverStatus = function (db, callback) {
  var admin = db.admin();
  admin.serverStatus(function (err, info) {
    callback(err, info)
  })
}

exports.listServer = function () {
  return JSON.parse(fs.readFileSync('./serverList.json').toString());
}

exports.addServer = function (url) {
  var server = urlParser(url)
  var serverList = JSON.parse(fs.readFileSync('./serverList.json').toString())
  if (serverList[server.name]) {
    return {
      ok: 0,
      errmsg: 'Server record already exists'
    }
  }
  serverList[server.name] = {url: server.url};
  fs.writeFileSync('./serverList.json', JSON.stringify(serverList, null, 2))
  return serverList;
}

exports.updateServer = function (serverName, url) {
  var server = urlParser(url)
  var serverList = JSON.parse(fs.readFileSync('./serverList.json').toString())
  if (!serverList[serverName]) {
    return {
      ok: 0,
      errmsg: 'Server record does not exists'
    }
  }
  if (serverName !== server.name) {
    return {
      ok: 0,
      errmsg: 'mongodb url does not match'
    }
  }
  serverList[serverName] = {url: server.url};
  fs.writeFileSync('./serverList.json', JSON.stringify(serverList, null, 2))
  return serverList;
}

exports.deleteServer = function(serverName){
  var serverList = JSON.parse(fs.readFileSync('./serverList.json').toString())
  if (!serverList[serverName]) {
    return {
      ok: 0,
      errmsg: 'Server record does not exists'
    }
  }
  delete serverList[serverName];
  fs.writeFileSync('./serverList.json', JSON.stringify(serverList, null, 2))
  return serverList;
}