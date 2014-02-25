bountyMongo.factory('database', [

  '$http',
  'localStorageService',
  'API_URL',

  function ($http, localStorageService,API_URL) {
    return function (serverName, databaseName) {

      var serverUrl = ''
      if (typeof serverName !== undefined) {
        serverUrl = localStorageService.get('bounty_servers')[serverName]
      }

      var Resource = {}

      Resource.query = function () {
        var url = API_URL
          + '/servers/' + encodeURIComponent(serverName)
          + '/databases/' + encodeURIComponent(databaseName);
        return $http.get(url, {
          headers: {
            'Mongodb-Url': 'mongodb://' + serverUrl
          }
        }).then(function (response) {
            return response.data;
          });
      }
      Resource.collections = function () {
        var url = API_URL
          + '/servers/' + encodeURIComponent(serverName)
          + '/databases/' + encodeURIComponent(databaseName)
          + '/collections';
        return $http.get(url, {
          headers: {
            'Mongodb-Url': 'mongodb://' + serverUrl
          }
        }).then(function (response) {
            var collectionList = [];
            angular.forEach(response.data,function(value,key){
              this.push(value.name.substr(value.name.indexOf('.') + 1))
            },collectionList)
            return collectionList;
          })
      }
      return Resource;
    }
  }])
