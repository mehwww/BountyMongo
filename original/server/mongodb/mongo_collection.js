exports.find = function (db, collectionName,query, options, callback) {
  db.collection(collectionName,function(err,coll){
    coll.find(query,options).toArray(function(err,docs){
      callback(err,docs)
    })
  })
}