bountyMongo.factory('collection', [

  '$http',
  'bucket',

  function ($http, bucket) {
    /**
     *  @param1 : query
     *  @param2 : page
     *  @param3 : limit
     */
    return function (server, database, collection, queryOptions) {
//      var collection = bucket.config.collection.selected;
//      var database = bucket.config.database.selected;
//      var server = bucket.config.server.selected;
//      var queryOptions = bucket.config.queryOptions;
      var serverURL = bucket.serverURL;

      var url = serverURL + 'servers/' + server.host + '/databases/' + database.name + '/collections/' + collection.name + '?';

      var Resource = function (data) {
        angular.extend(this, data);
      };
      Resource.query = function () {
        if (queryOptions) {
          if (queryOptions.q)url = url + 'q=' + JSON.stringify(queryOptions.q) + '&';
          if (queryOptions.p)url = url + 'p=' + queryOptions.p + '&';
          if (queryOptions.l)url = url + 'l=' + queryOptions.l;
        }

        return $http.get(url).then(function (response) {
          if (response.data.status === 'error') {
//            bucket.records = response.data;
            return response.data.error
          }
//          bucket.records = response.data.data;
          return response.data.data;
        });
      }
      return Resource;
    }
  }])