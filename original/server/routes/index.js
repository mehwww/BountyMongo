/*
 * GET home page.
 */
var util = require('util')
var dump = require('dump')

//var mongoClient = require('../mongodb/client')
// var adminDb = require('../mongodb/adminDb')

exports.index = function (req, res) {
  // adminDb(function(admin) {
  // 	admin.listDatabases(function(err, dbs) {
  // 		res.send(dump(dbs))
  // 	})
  // })

  // mongoClient(function(client) {
  // 	var db = client.db('456');
  // 	db.collectionNames(function(err, items) {
  // 		res.send(items);
  // 		console.dir(items);
  // 	})
  // })

  // mongoClient(function(client) {
  // 	var test = client.db('test')
  // 	var adminDb = test.admin()
  // 	adminDb.buildInfo(function(err, info) {
  // 		// console.log(util.inspect(info, {
  // 		// 	depth: null,
  // 		// 	colors: true
  // 		// }))
  // 		res.send(dump(info))
  // 	})
  // 	// var mydb = client.db('mydb')
  // 	// mydb.collectionNames(function(err,items) {
  // 	// 	console.dir(items);
  // 	// })
  // 	// res.render('index', {
  // 	// 	title: 'Express'
  // 	// });
  // })

  // console.dir(respond.E404())
  // console.dir(respond.E200())
  // console.dir(respond.NotFound())

  res.statusCode = 400;
  res.send('aaa');
//  res.render('index', {
//    title: 'Express'
//  });
};