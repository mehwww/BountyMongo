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

//
//  var serverConfig = {};
//  serverConfig.list = [
//    {'host': 'localhost', 'port': '27017'},
//    {'host': '127.0.0.1', 'port': '27017'},
//    {'host': '192.168.1.100', 'port': '27017'}
//  ];
//  serverConfig.selected = {};
//  serverConfig.selectServer = function (selected) {
//    this.selected = selected;
//  };
//
//  var databaseConfig = {};
//  databaseConfig.list = [];
//  databaseConfig.selected = {};
//  databaseConfig.selectDatabase = function (selected) {
//    this.selected = selected;
//  }
//
//  var collectionConfig = {};
//  collectionConfig.list = [];
//  collectionConfig.selected = {};
//  collectionConfig.selectCollection = function (selected) {
//    this.selected = selected;
//  }

  var records = {};


  return {
    serverURL: serverURL,
    config:config,
    records: records
  };
//
//    var database = {
//        list: [],
//        selected: {}
//    }
}])