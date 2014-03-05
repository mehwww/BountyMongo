bountyMongo.factory('database', [

  '$http',
  'localStorageService',
  'urlFactory',

  function ($http, localStorageService, urlFactory) {
    return function (serverName, databaseName) {

      var serverUrl = ''
      if (typeof serverName !== undefined) {
        serverUrl = localStorageService.get('bounty_servers')[serverName]
      }

      var Resource = {}

      Resource.query = function () {
        var url = urlFactory([serverName, databaseName])
        return $http.get(url, {
          headers: {
            'Mongodb-Url': 'mongodb://' + serverUrl
          }
        }).then(function (response) {
            return response.data;
          });
      }

      Resource.collections = function () {
        var url = urlFactory([serverName, databaseName]) + '/collections';
        return $http.get(url, {
          headers: {
            'Mongodb-Url': 'mongodb://' + serverUrl
          }
        }).then(function (response) {
            var collectionList = [];
            angular.forEach(response.data, function (value, key) {
              this.push(value.name.substr(value.name.indexOf('.') + 1))
            }, collectionList)
            return collectionList;
          })
      }
      return Resource;
    }
  }])
