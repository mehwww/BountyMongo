var MongoClient = require('mongodb').MongoClient;
var serverList = require('./mongodb/serverList.json')
var fs = require('fs');
var urlParser = require('./mongodb/url_parser')

//MongoClient.connect('mongodb://root:19910523@localhost', function (err, db) {
//MongoClient.connect('mongodb://localhost', function (err, db) {
//  db.close();
//  console.log(serverList['localhost'].uri)
////  db.admin().listDatabases(function (err, dbs) {
////    console.log(err)
////    console.log(dbs)
////    db.close();
////  });
////  db.db('test').collectionNames(function (err, items) {
////    console.log(items)
////    db.close();
////  })
//})
//console.log(servers)
//fs.writeFile('./mongodb/servers.json',JSON.stringify(servers,null,2),function(err){
//})

console.log(urlParser('mongodb://192.168.1.100'))