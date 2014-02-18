bountyMongo.factory('collection', [

  '$http',
  'bucket',

  function ($http, bucket) {
    return function (serverName, databaseName, collectionName) {
      var queryOptions = arguments[3];
      var serverURL = bucket.serverURL;

      var Resource = {};
      Resource.list = function () {
        var url = serverURL
          + '/servers/' + encodeURIComponent(serverName)
          + '/databases/' + encodeURIComponent(databaseName)
          + '/collections/';
        return $http.get(url).then(function (response) {
          return response.data;
        })
      }
      Resource.query = function () {
        var url = serverURL
          + '/servers/' + encodeURIComponent(serverName)
          + '/databases/' + encodeURIComponent(databaseName)
          + '/collections/' + encodeURIComponent(collectionName) + '?';

        if (queryOptions) {
          if (queryOptions.q)url = url + 'q=' + JSON.stringify(queryOptions.q) + '&';
          if (queryOptions.p)url = url + 'p=' + queryOptions.p + '&';
          if (queryOptions.l)url = url + 'l=' + queryOptions.l;
        }

        return $http.get(url).then(function (response) {
          return response.data
        });
      }
      return Resource;
    }
  }])