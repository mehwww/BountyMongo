bountyMongo.factory('database', [

  '$http',
  'bucket',

  function ($http, bucket) {
    return function () {
      var database = bucket.config.database.selected;
      var server = bucket.config.server.selected;
      var serverURL = bucket.serverURL;
      var url = serverURL + 'servers/' + server.host + '/databases/' + database.name;
      var Resource = function (data) {
        angular.extend(this, data);
      };
      Resource.query = function () {
        return $http.get(url).then(function (response) {
          //返回该服务器上的所有collections
          var collectionsList = [];
          angular.forEach(response.data.data.collectionNames, function (value, key) {
            value.name = value.name.substr(value.name.indexOf('.') + 1);
            this.push(value);
          }, collectionsList)
          return collectionsList;
        });
      }
      return Resource;
    }
  }])
