var path = require('path');
var fs = require('fs');

var express = require('express');
var logger = require('morgan');
var errorHandler = require('errorhandler');
var bodyParser = require('body-parser');

var databases = require('./routes/databases');
var collections = require('./routes/collections')
var servers = require('./routes/servers')

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
//app.set('views', __dirname + '/views');
//app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser());


app.use('/assets', express.static(path.join(__dirname, './assets')))
app.use('/partials', express.static(path.join(__dirname, './app/partials')))

//stupid express lol XD
app.route('/api/servers/:serverName')
  .get(servers.find)
  .delete(servers.delete);
app.route('/api/servers/:serverName/databases')
  .get(databases.list);
app.route('/api/servers/:serverName/databases/:databaseName')
  .get(databases.find)
  .delete(databases.delete);
app.route('/api/servers/:serverName/databases/:databaseName/collections')
  .get(collections.list);
app.route('/api/servers/:serverName/databases/:databaseName/collections/:collectionName')
  .get(collections.find)
  .post(collections.add)
  .put(collections.updateOne)
  .delete(collections.removeOne);
app.route('/api/servers/:serverName/databases/:databaseName/collections/:collectionName/count')
  .get(collections.count);

app.get('*', function (req, res) {
  res.sendfile(path.join(__dirname, './app/index.html'))
});

app.use(errorHandler());
app.listen(app.get('port'), function () {
  console.log('Listening on port %d', app.get('port'));
});


