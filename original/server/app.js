/**
 * Module dependencies.
 */

var express = require('express');

var routes = require('./routes');

var databases = require('./routes/databases');
var collections = require('./routes/collections')
var servers = require('./routes/servers')

var dump = require('dump')

var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));

// app.use(express.json());
// app.use(express.urlencoded());
app.use(express.bodyParser());

app.use(express.methodOverride());
// app.use(express.cookieParser('your secret here'));
// app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

console.log(app.get('env'));
// development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}

app.get('/', routes.index);

app.get('/test', function(req, res) {
	var query = eval('(' + req.query.query + ')')
	// var query = req.query.query
	// console.dir(req.query)
	// console.dir(query)
	res.send(dump(query))
})

app.get('/servers/:server_name', databases.findAll)


app.get('/servers/:server_name/databases/:db_name', databases.find);
app.post('/servers/:server_name/databases/:db_name', databases.add);
app.delete('/servers/:server_name/databases/:db_name', databases.delete);
app.put('/servers/:server_name/databases/:db_name', databases.update);

// app.get('/databases/:db_name/collections',collections.findAll)
app.get('/servers/:server_name/databases/:db_name/collections/:collection_name', collections.find)
app.post('/servers/:server_name/databases/:db_name/collections/:collection_name', collections.add)
app.delete('/servers/:server_name/databases/:db_name/collections/:collection_name', collections.delete)



http.createServer(app).listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port'));
});