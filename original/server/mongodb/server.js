var mongoClient = require('./client');
var serverList = require('./serverList.json')

exports.serverStatus = function (db, callback) {
  var admin = db.admin();
  admin.serverStatus(function (err, info) {
    callback(err,info)
  })
}

exports.listServer = function(){
  return serverList;
}

exports.addServer = function(){

}