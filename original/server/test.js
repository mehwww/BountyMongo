var MongoClient = require('mongodb').MongoClient;
var urlParser = require('./lib/mongodb/url_parser')
//var serverList = require('./mongodb/serverList.json')
var fs = require('fs');
var util = require('util');
var _ = require('underscore')

//MongoClient.connect('mongodb://root:19910523@localhost', function (err, db) {
//MongoClient.connect('mongodb://testUser:19910523@localhost/test', function (err, db) {
//  db.collectionNames(function (err, items) {
//    if (err)console.log(util.inspect(err));
//    else console.log(util.inspect(items));
//    db.close();
//  })
//})

console.log(urlParser("mongodb://testUser:19923@localhost"))


//fs.writeFile('./mongodb/servers.json', JSON.stringify(servers, null, 2), function (err) {
//})