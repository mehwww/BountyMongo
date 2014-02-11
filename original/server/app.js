/**
 * Module dependencies.
 */

var express = require('express');

var databases = require('./routes/databases');
var collections = require('./routes/collections')
var servers = require('./routes/servers')

var dump = require('dump')

var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));

// app.use(express.json());
// app.use(express.urlencoded());
app.use(express.bodyParser());
app.use(express.methodOverride());
// app.use(express.cookieParser('your secret here'));
// app.use(express.session());
// app.use(app.router);
app.use('/app',express.static(path.join(__dirname, '../client/app/')));
//app.use(express.static(path.join(__dirname, 'public')));

console.log(app.get('env'));
// development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}

//app.get('/', routes.index);
//app.get('/', function(req,res){
//  res.sendfile('client/app/app.html',{
//    root:'../'
//  })
//});
//
//app.get('/test', function(req, res) {
//	var query = eval('(' + req.query.query + ')')
//	// var query = req.query.query
//	// console.dir(req.query)
//	// console.dir(query)
//	res.send(dump(query))
//})

//list server records in serverList.json
app.get('/servers',servers.list)
//get the specified server status
app.get('/servers/:serverName', servers.find)
//add new server record to serverList.json
app.post('/servers',servers.add)
//update the specified server record in serverList.json
app.put('/servers/:serverName',servers.update)
//delete the specified server record in serverList.json
app.delete('/servers/:serverName', servers.delete)

//list databases in the specified server
app.get('/servers/:serverName/databases',databases.list)
//get the specified database status
app.get('/servers/:serverName/databases/:databaseName', databases.find);
/*
app.post('/servers/:serverName/databases/:databaseName', databases.find);
app.put('/servers/:serverName/databases/:databaseName', databases.update);
*/
//drop the specified database
app.delete('/servers/:serverName/databases/:databaseName', databases.delete);

//list collections in the specified database
app.get('/servers/:serverName/databases/:databaseName/collections',collections.list)
//get the specified collection's documents
app.get('/servers/:serverName/databases/:databaseName/collections/:collectionName', collections.find)
//add new document
//app.post('/servers/:serverName/databases/:databaseName/collections/:collectionName', collections.add)
//app.delete('/servers/:serverName/databases/:databaseName/collections/:collectionName', collections.delete)



http.createServer(app).listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port'));
});