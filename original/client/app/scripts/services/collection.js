bountyMongo.factory('collection', [

  '$http',
  'localStorageService',
  'urlFactory',

  function ($http, localStorageService, urlFactory) {
    return function (serverName, databaseName, collectionName) {

      var serverUrl = serverName !== undefined
        ? localStorageService.get('bounty_servers')[serverName]
        : ''


      var Resource = {};
      Resource.list = function () {
        var url = urlFactory([serverName, databaseName]) + '/collections'
        var config = {headers: {'Mongodb-Url': 'mongodb://' + serverUrl}}
        return $http.get(url, config).then(function (response) {
          return response.data;
        }, function (response) {
          return response.data
        })
      }

      Resource.query = function (queryOptions) {
        var url = urlFactory([serverName, databaseName, collectionName], queryOptions)
        var config = {headers: {'Mongodb-Url': 'mongodb://' + serverUrl}}
        return $http.get(url, config).then(function (response) {
          return response.data
        }, function (response) {
          return response.data
        });
      }

      Resource.add = function (document) {
        var url = urlFactory([serverName, databaseName, collectionName])
        var config = {headers: {'Mongodb-Url': 'mongodb://' + serverUrl}}
        var data = {document: document}
        return $http.post(url, data, config).then(function (response) {
          return response.data;
        }, function (response) {
          return response.data
        })
      }

      Resource.delete = function (queryOptions) {
        var url = urlFactory([serverName, databaseName, collectionName], queryOptions)
        var config = {headers: {'Mongodb-Url': 'mongodb://' + serverUrl}}
        return $http.delete(url, config).then(function (response) {
          return response.data;
        }, function (response) {
          return response.data;
        })
      }

      Resource.count = function (queryOptions) {
        var url = urlFactory([serverName, databaseName, collectionName, '/count'], queryOptions);
        var config = {headers: {'Mongodb-Url': 'mongodb://' + serverUrl}}
        return $http.get(url, config).then(function (response) {
          return response.data;
        }, function (response) {
          return response.data;
        });
      }

      Resource.update = function (document, queryOptions) {
        var url = urlFactory([serverName, databaseName, collectionName], queryOptions);
        var config = {headers: {'Mongodb-Url': 'mongodb://' + serverUrl}};
        var data = {document:angular.copy(document)};
        delete data.document._id;
        return $http.put(url, data, config).then(function (response) {
          return response.data;
        }, function (response) {
          return response.data;
        })
      }


      return Resource;
    }
  }])