var MongoClient = require('mongodb').MongoClient;
var urlParser = require('./lib/mongodb/url_parser')
//var serverList = require('./mongodb/serverList.json')
var fs = require('fs');
var util = require('util');
var _ = require('underscore')

//MongoClient.connect('mongodb://root:19910523@localhost', function (err, db) {
console.log(new Date())

MongoClient.connect('mongodb://testUser:19910523@127.0.0.2/test', {
  server: {
    socketOptions: {
//        noDelay:true
//        timeout:2000
//      keepAlive:100,
//      socketTimeoutMS:2000,
      connectTimeoutMS: 2000
    }
  }
}, function (err, db) {
  console.log(new Date())

  db.collectionNames(function (err, items) {
    if (err)console.log(util.inspect(err));
    else console.log(util.inspect(items));
    db.close();
  })
})
