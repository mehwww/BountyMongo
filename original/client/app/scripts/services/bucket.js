bountyMongo.factory('bucket', [function () {
  //app server url
  var serverURL = 'http://localhost:3000/';

  var serverConfig = {};
  serverConfig.list = [
    {'host': 'localhost', 'port': '27017'},
    {'host': '127.0.0.1', 'port': '27017'},
    {'host': '192.168.1.100', 'port': '27017'}
  ];
  serverConfig.selected = {};
  serverConfig.selectServer = function (selected) {
    this.selected = selected;
  };

  var databaseConfig = {};
  databaseConfig.list = [];
  databaseConfig.selected = {};
  databaseConfig.selectDatabase = function (selected) {
    this.selected = selected;
  }

  var collectionConfig = {};
  collectionConfig.list = [];
  collectionConfig.selected = {};
  collectionConfig.selectCollection = function (selected) {
    this.selected = selected;
  }


  return {
    serverURL: serverURL,
    serverConfig: serverConfig,
    databaseConfig: databaseConfig,
    collectionConfig: collectionConfig
  };
//
//    var database = {
//        list: [],
//        selected: {}
//    }
}])