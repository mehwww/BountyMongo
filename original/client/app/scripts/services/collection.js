bountyMongo.factory('collection', [

  '$http',
  'bucket',

  function ($http, bucket) {
    return function (server, database, collection) {
      var queryOptions = arguments[3];
      var serverURL = bucket.serverURL;

      var url = serverURL + 'servers/' + server.host + '/databases/' + database.name + '/collections/' + collection.name + '?';

      var Resource = {};
      Resource.query = function () {
        if (queryOptions) {
          if (queryOptions.q)url = url + 'q=' + JSON.stringify(queryOptions.q) + '&';
          if (queryOptions.p)url = url + 'p=' + queryOptions.p + '&';
          if (queryOptions.l)url = url + 'l=' + queryOptions.l;
        }

        return $http.get(url).then(function (response) {
          if (response.data.status === 'error') {
            return response.data.error
          }
          return response.data.data;
        });
      }
      return Resource;
    }
  }])