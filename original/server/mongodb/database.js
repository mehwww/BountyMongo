var mongoClient = require('./client');

exports.collectionNames = function(db,callback){
  db.collectionNames(function(err,items){
    callback(err,items)
  })
}

exports.listDatabases = function (db,callback) {
  var admin = db.admin();
  admin.listDatabases(function (err, dbs) {
    return callback(err, dbs)
  })
}

exports.stats = function(db,callback){
  db.stats(function(err,stats){
    return callback(err,stats)
  })
}

exports.dropDatabase = function(db,databaseName,callback){
  db.db(databaseName).dropDatabase(function(err,result){
    return callback(err,result)
  })
}