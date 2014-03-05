bountyMongo.factory('collection', [

  '$http',
  'localStorageService',
  'API_URL',

  function ($http, localStorageService, API_URL) {
    return function (serverName, databaseName, collectionName) {
      var serverUrl = ''
      if (typeof serverName !== undefined) {
        serverUrl = localStorageService.get('bounty_servers')[serverName]
      }

      var Resource = {};
      Resource.list = function () {
        var url = API_URL
          + '/servers/' + encodeURIComponent(serverName)
          + '/databases/' + encodeURIComponent(databaseName)
          + '/collections/';
        return $http.get(url, {
          headers: {
            'Mongodb-Url': 'mongodb://' + serverUrl
          }
        }).then(function (response) {
            return response.data;
          })
      }

      Resource.query = function (queryOptions) {
        var url = API_URL
          + '/servers/' + encodeURIComponent(serverName)
          + '/databases/' + encodeURIComponent(databaseName)
          + '/collections/' + encodeURIComponent(collectionName);

        if (queryOptions) {
          url = url + '?';
          if (queryOptions.q)url = url + 'q=' + JSON.stringify(queryOptions.q) + '&';
          if (queryOptions.p)url = url + 'p=' + queryOptions.p + '&';
          if (queryOptions.l)url = url + 'l=' + queryOptions.l + '&';
          if (queryOptions.s)url = url + 's=' + queryOptions.s + '&';
        }

        return $http.get(url, {
          headers: {
            'Mongodb-Url': 'mongodb://' + serverUrl
          }
        }).then(function (response) {
            return response.data
          });
      }

      Resource.add = function (document) {
        var url = API_URL
          + '/servers/' + encodeURIComponent(serverName)
          + '/databases/' + encodeURIComponent(databaseName)
          + '/collections/' + encodeURIComponent(collectionName)
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
        var url = API_URL
          + '/servers/' + encodeURIComponent(serverName)
          + '/databases/' + encodeURIComponent(databaseName)
          + '/collections/' + encodeURIComponent(collectionName)
          + '/count/';

        if (queryOptions) {
          url = url + '?';
          if (queryOptions.q)url = url + 'q=' + JSON.stringify(queryOptions.q) + '&';
          if (queryOptions.p)url = url + 'p=' + queryOptions.p + '&';
          if (queryOptions.l)url = url + 'l=' + queryOptions.l;
        }

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