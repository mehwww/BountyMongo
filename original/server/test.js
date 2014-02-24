var MongoClient = require('mongodb').MongoClient;
var Server = require('mongodb').Server;
var urlParser = require('./lib/mongodb/url_parser')
//var serverList = require('./mongodb/serverList.json')
var fs = require('fs');
var util = require('util');
var _ = require('underscore')

//MongoClient.connect('mongodb://root:19910523@localhost', function (err, db) {
console.log(new Date())

var mongoClient = new MongoClient(new Server("127.0.0.2", 27017, {
  socketOptions: {
    connectTimeoutMS: 3000
  }
}) );

mongoClient.open(function(err, mongoclient) {
  console.log(err)
  console.log(new Date())
})

//MongoClient.connect('mongodb://testUser:19910523@127.0.0.2/test?connectTimeoutMS=1000', {
//  server: {
//    socketOptions: {
////        noDelay:true
////        timeout:2000
////      keepAlive:100,
////      socketTimeoutMS:2000,
////      connectTimeoutMS: 2000
//    }
//  }
//}, function (err, db) {
//  console.log(new Date())
//
//  db.collectionNames(function (err, items) {
//    if (err)console.log(util.inspect(err));
//    else console.log(util.inspect(items));
//    db.close();
//  })
//})
