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

exports.insert = function (collection, doc, callback) {
  collection.insert(doc, function (err, result) {
    callback(err, result)
  })
}

exports.remove = function(collection,selector,options,callback){
  collection.remove(selector,options,function(err,numberOfRemovedDocs){
    callback(err,numberOfRemovedDocs);
  })
}