bountyMongo.factory('collection', [

  '$http',
  'localStorageService',
  'urlFactory',
  'API_URL',

  function ($http, localStorageService, urlFactory,API_URL) {
    return function (serverName, databaseName, collectionName) {
      var serverUrl = ''
      if (typeof serverName !== undefined) {
        serverUrl = localStorageService.get('bounty_servers')[serverName]
      }

      var Resource = {};
      Resource.list = function () {
        var url = urlFactory([serverName,databaseName])+'/collections'
        return $http.get(url, {
          headers: {
            'Mongodb-Url': 'mongodb://' + serverUrl
          }
        }).then(function (response) {
            return response.data;
          })
      }

      Resource.query = function (queryOptions) {
        var url = urlFactory([serverName,databaseName,collectionName],queryOptions)

        return $http.get(url, {
          headers: {
            'Mongodb-Url': 'mongodb://' + serverUrl
          }
        }).then(function (response) {
            return response.data
          });
      }

      Resource.add = function (document) {
        var url = urlFactory([serverName,databaseName,collectionName])

        return $http.post(url,
          {
            document: document
          },
          {
            headers: {
              'Mongodb-Url': 'mongodb://' + serverUrl
            }
          }).then(function (response) {
            return response.data;
          })

      }

      Resource.count = function (queryOptions) {
        var url = urlFactory([serverName,databaseName,collectionName],queryOptions)+ '/count/';

        return $http.get(url, {
          headers: {
            'Mongodb-Url': 'mongodb://' + serverUrl
          }
        }).then(function (response) {
            return response.data
          }, function (response) {
            return response.data
          });
      }


      return Resource;
    }
  }])