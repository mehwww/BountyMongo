bountyMongo.factory('bucket', ['$parse', function ($parse) {
  //app server url
  var serverURL = 'http://localhost:3000/';

  var paginationConfig = {
//    itemsPerPage:50,
    maxsize:9
  };

  var serverList = [
    {'host': 'localhost', 'port': '27017'},
    {'host': '127.0.0.1', 'port': '27017'},
    {'host': '192.168.1.100', 'port': '27017'}
  ];

  var queryOptions = {
    p:1,
    l:50
  };

  var records = {};


  return {
    serverURL: serverURL,
    serverList:serverList,
    paginationConfig: paginationConfig,
    queryOptions: function (key, value) {
      if (key === undefined) return queryOptions;
      if (value === undefined) return queryOptions[key];
      queryOptions[key] = value;
    },
    records: records
  };
}])