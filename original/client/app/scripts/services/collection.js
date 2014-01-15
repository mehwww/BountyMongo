bountyMongo.factory('collection', [

  '$http',
  'bucket',

  function ($http, bucket) {
    /**
     *  @param1 : query
     *  @param2 : page
     *  @param3 : limit
     */
    return function () {
      var collection = bucket.config.collection.selected;
      var database = bucket.config.database.selected;
      var server = bucket.config.server.selected;
      var serverURL = bucket.serverURL;

      var url = serverURL + 'servers/' + server.host + '/databases/' + database.name + '/collections/' + collection.name + '?';

      var Resource = function (data) {
        angular.extend(this, data);
      };
      Resource.query = function () {
        if (arguments[0])url = url + 'q=' + JSON.stringify(arguments[0]) + '&';
        if (arguments[1])url = url + 'p=' + arguments[1] + '&';
        if (arguments[2])url = url + 'l=' + arguments[2];

        return $http.get(url).then(function (response) {
          if (response.data.status === 'error') {
            bucket.records = response.data;
            return response.data.error
          }
          bucket.records = response.data.data;
          return response.data.data.find;
        });
      }
      return Resource;
    }
  }])