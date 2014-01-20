bountyMongo.factory('bucket', [function () {
  //app server url
  var serverURL = 'http://localhost:3000/';

  var config = {};
  config.serverList = [
    {'host': 'localhost', 'port': '27017'},
    {'host': '127.0.0.1', 'port': '27017'},
    {'host': '192.168.1.100', 'port': '27017'}
  ];

  var records = {};


  return {
    serverURL: serverURL,
    config: config,
    records: records
  };
}])