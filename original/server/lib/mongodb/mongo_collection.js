exports.find = function (collection, query, options, callback) {
  collection.find(query, options).toArray(function (err, docs) {
    callback(err, docs)
  })
}

exports.count = function (collection, query, options, callback) {
  collection.count(query, function (err, count) {
    callback(err, count)
  })
}