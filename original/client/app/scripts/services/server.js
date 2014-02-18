bountyMongo.factory('server', [

  '$http',
  'bucket',

  function ($http, bucket) {
    return function (serverName) {
      var serverURL = bucket.serverURL;
      var Resource = {};
      Resource.list = function () {
        var url = serverURL + '/servers/';
        return $http.get(url).then(function (response) {
          return _.map(response.data, function (value, key) {
            return key;
          });
        });
      };
      Resource.query = function () {
        var url = serverURL
          + '/servers/' + encodeURIComponent(serverName)
        return $http.get(url).then(function (response) {
          return response.data;
        });
      }
      Resource.databases = function () {
        var url = serverURL
          + '/servers/' + encodeURIComponent(serverName)
          + '/databases/'
        return $http.get(url).then(function (response) {
          var databases = [];
          if (_.isArray(response.data)) {
            _.map(response.data, function (value, key) {
              databases.push(value.name)
            })
          }
          else {
            databases.push(response.data.db)
          }
          return databases;
        })
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
