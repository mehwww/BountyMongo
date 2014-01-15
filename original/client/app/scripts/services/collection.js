bountyMongo.factory('collection', [

  '$http',
  'bucket',

  function ($http, bucket) {
    return function () {
      var collection = bucket.config.collection.selected;
      var database = bucket.config.database.selected;
      var server = bucket.config.server.selected;
      var serverURL = bucket.serverURL;
      var url = serverURL + 'servers/' + server.host + '/databases/' + database.name + '/collections/' + collection.name;
      var Resource = function (data) {
        angular.extend(this, data);
      };
      Resource.query = function () {
        return $http.get(url).then(function (response) {
          return response.data.data.find;
        });
      }
      return Resource;
    }
  }])