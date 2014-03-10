bountyMongo.factory('database', [

  '$http',
  'localStorageService',
  'bountyUrl',

  function ($http, localStorageService, bountyUrl) {
    return function (serverName, databaseName) {

      var serverUrl = serverName !== undefined
        ? localStorageService.get('bounty_servers')[serverName]
        : ''

      var Resource = {}
      Resource.query = function () {
        var url = bountyUrl.apiUrl([serverName, databaseName])
        var config = {headers: {'Mongodb-Url': 'mongodb://' + serverUrl}}
        return $http.get(url, config).then(function (response) {
          return response.data;
        });
      }

      Resource.collections = function () {
        var url = bountyUrl.apiUrl([serverName, databaseName]) + '/collections';
        var config = {headers: {'Mongodb-Url': 'mongodb://' + serverUrl}}
        return $http.get(url, config).then(function (response) {
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
