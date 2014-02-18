bountyMongo.factory('database', [

  '$http',
  'bucket',

  function ($http, bucket) {
    return function (serverName, databaseName) {
      var serverURL = bucket.serverURL;
      var Resource = {}
//      Resource.list = function(){
//        var url = serverURL + 'servers/' + encodeURIComponent(serverName) + '/databases/';
//        return $http.get(url).then(function(response){
//          return response.data;
//        })
//      }
      Resource.query = function () {
        var url = serverURL
          + '/servers/' + encodeURIComponent(serverName)
          + '/databases/' + encodeURIComponent(databaseName);
        return $http.get(url).then(function (response) {
//          angular.forEach(response.data.data.collectionNames, function (value, key) {
//            value.name = value.name.substr(value.name.indexOf('.') + 1);
//          })
          return response.data;
        });
      }
      Resource.collections = function () {
        var url = serverURL
          + '/servers/' + encodeURIComponent(serverName)
          + '/databases/' + encodeURIComponent(databaseName)
          + '/collections';
        return $http.get(url).then(function (response) {
          return _.map(response.data,function(value,key){
            return value.name.substr(value.name.indexOf('.')+1)
          })
        })
      }
      return Resource;
    }
  }])
