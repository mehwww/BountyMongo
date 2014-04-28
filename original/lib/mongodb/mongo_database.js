exports.collectionNames = function (db, callback) {
  db.collectionNames(function (err, items) {
    callback(err, items)
  })
}

//SO STUPID lol
exports.listDatabases = function (db, callback) {
  db.stats(function (err, stats) {
    if (err) return callback(err,null)
    if (stats.db !== "admin") {
      return callback(err, stats)
    }
    else {
      var admin = db.admin();
      admin.listDatabases(function (err, dbs) {
        return callback(err, dbs.databases)
      })
    }
  })

}

exports.stats = function (db, callback) {
  db.stats(function (err, stats) {
    return callback(err, stats)
  })
}

exports.dropDatabase = function (db, databaseName, callback) {
  db.db(databaseName).dropDatabase(function (err, result) {
    return callback(err, result)
  })
}