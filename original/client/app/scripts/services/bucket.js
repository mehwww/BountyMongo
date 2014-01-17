bountyMongo.factory('bucket', [function () {
  //app server url
  var serverURL = 'http://localhost:3000/';

  var config = {};

  var server = {};
  server.list = [
    {'host': 'localhost', 'port': '27017'},
    {'host': '127.0.0.1', 'port': '27017'},
    {'host': '192.168.1.100', 'port': '27017'}
  ];
  server.selected = {};
  server.selectServer = function (selected) {
    this.selected = selected;
  };
  config.server = server;

  var database = {};
  database.list = [];
  database.selected = {};
  database.selectDatabase = function (selected) {
    this.selected = selected;
  }
  config.database = database;

  var collection = {};
  collection.list = [];
  collection.selected = {};
  collection.selectCollection = function (selected) {
    this.selected = selected;
  }
  config.collection = collection;

  var queryOptions = {};
  queryOptions.q = {};
  queryOptions.l = 10;
  queryOptions.p = 1;
  queryOptions.init = function(){
    this.q = {};
    this.p = 1;
  }
  config.queryOptions = queryOptions;

  var records = {};


  return {
    serverURL: serverURL,
    config: config,
    records: records
  };
//
//    var database = {
//        list: [],
//        selected: {}
//    }
}])