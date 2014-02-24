bountyMongo.factory('server', [

  '$http',
  '$q',
  'localStorageService',
  'urlParser',
  'API_URL',

  function ($http, $q, localStorageService, urlParser, API_URL) {
    return function (serverName) {

      if (typeof serverName !== undefined) {
        var serverUrl = localStorageService.get('bounty_servers')[serverName]
      }

      var Resource = {};
      Resource.list = function () {
        var serverList = localStorageService.get('bounty_servers');
        return _.map(serverList, function (value, key) {
          return key;
        });

//        var url = serverURL + '/servers/';
//        return $http.get(url).then(
//          function (response) {
//            return _.map(response.data, function (value, key) {
//              return key;
//            });
//          },
//          function (response) {
//            return response.data
//          }
//        );
      };
      Resource.query = function () {
        var url = API_URL
          + '/servers/' + encodeURIComponent(serverName)
        return $http.get(url, {
          headers: {
            mongodbUrl: 'mongodb://' + serverUrl
          }
        }).then(
          function (response) {
            return response.data;
          },
          function (response) {
            return response.data
          }
        );
      };
      Resource.add = function (mongodbUrl) {
        var serverList = localStorageService.get('bounty_servers');
        var server = urlParser(mongodbUrl)
        if (!angular.isObject(serverList) || angular.isArray(serverList)) serverList = {};
        serverList[server.name] = server.url
        localStorageService.add('bounty_servers', serverList)
        return server;
//        var url = serverURL + '/servers/'
//        return $http.post(url, {url: mongodbUrl}).then(
//          function (response) {
//            return _.map(response.data, function (value, key) {
//              return key;
//            });
//          },
//          function (response) {
//            return response.data
//          }
//        );
      }
      Resource.delete = function () {
        var serverList = localStorageService.get('bounty_servers');
        delete serverList[serverName];
        localStorageService.add('bounty_servers', serverList);
        return _.map(serverList, function (value, key) {
          return key;
        });

//        var url = serverURL
//          + '/servers/' + encodeURIComponent(serverName)
//        return $http.delete(url).then(
//          function (response) {
//            return _.map(response.data, function (value, key) {
//              return key;
//            });
//          },
//          function (response) {
//            return response.data
//          }
//        );
      }


      Resource.databases = function () {
        var url = API_URL
          + '/servers/' + encodeURIComponent(serverName)
          + '/databases/'
        return $http.get(url, {
          headers: {
            'Mongodb-Url': 'mongodb://' + serverUrl
          }
        }).then(function (response) {
            var databases = [];
            if (angular.isArray(response.data)) {
              _.map(response.data, function (value, key) {
                databases.push(value.name)
              })
            }
            else {
              databases.push(response.data.db)
            }
            return databases;
          }
        );
      }
      return Resource;
    };
//    return function (server) {
//      var serverURL = bucket.serverURL;
//
//      var url = serverURL + 'servers/' + server.host;
//
////      待研究
////      var Resource = function (data) {
////        angular.extend(this, data);
////      };
//
//      var Resource = {}
//      Resource.query = function () {
//        return $http.get(url).then(function (response) {
//          //返回该服务器上的所有databases
//          return response.data.data;
//        });
//      }
//      return Resource;
//    }
  }])
