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

app.use(express.json());
app.use(express.urlencoded());
//app.use(express.bodyParser());
app.use(express.methodOverride());
// app.use(express.cookieParser('your secret here'));
// app.use(express.session());
// app.use(app.router);

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.use('/vendor',express.static(path.join(__dirname, '../client/app/vendor')))
app.use('/dist',express.static(path.join(__dirname, '../client/app/dist')))
app.use('/partials',express.static(path.join(__dirname, '../client/app/partials')))

//list server records in serverList.json
//app.get('/api/servers',servers.list)
//get the specified server status
app.get('/api/servers/:serverName', servers.find)
//add new server record to serverList.json
//app.post('/api/servers',servers.add)
//update the specified server record in serverList.json
//app.put('/api/servers/:serverName',servers.update)
//delete the specified server record in serverList.json
app.delete('/api/servers/:serverName', servers.delete)

//list databases in the specified server
app.get('/api/servers/:serverName/databases',databases.list)
//get the specified database status
app.get('/api/servers/:serverName/databases/:databaseName', databases.find);
/*
app.post('/api/servers/:serverName/databases/:databaseName', databases.find);
app.put('/api/servers/:serverName/databases/:databaseName', databases.update);
*/
//drop the specified database
app.delete('/api/servers/:serverName/databases/:databaseName', databases.delete);

//list collections in the specified database
app.get('/api/servers/:serverName/databases/:databaseName/collections',collections.list)
//get the specified collection's documents
app.get('/api/servers/:serverName/databases/:databaseName/collections/:collectionName', collections.find)
app.post('/api/servers/:serverName/databases/:databaseName/collections/:collectionName', collections.add)
app.get('/api/servers/:serverName/databases/:databaseName/collections/:collectionName/count', collections.count)
//add new document
//app.post('/api/servers/:serverName/databases/:databaseName/collections/:collectionName', collections.add)
app.delete('/api/servers/:serverName/databases/:databaseName/collections/:collectionName', collections.removeOne)
//app.delete('/api/servers/:serverName/databases/:databaseName/collections/:collectionName', collections.delete)


app.get('*',function(req,res){
  res.sendfile(path.join(__dirname, '../client/app/index.html'))
});


http.createServer(app).listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port'));
});