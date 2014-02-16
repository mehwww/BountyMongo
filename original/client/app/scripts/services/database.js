bountyMongo.factory('database', [

  '$http',
  'bucket',

  function ($http, bucket) {
    return function (serverName,databaseName) {
      var serverURL = bucket.serverURL;
      var Resource = {}
      Resource.list = function(){
        var url = serverURL + 'servers/' + encodeURIComponent(serverName) + '/databases/';
        return $http.get(url).then(function(response){
          return response.data;
        })
      }
//      Resource.query = function () {
//        var url = serverURL + 'servers/' + encodeURIComponent(serverName) + '/databases/' + encodeURIComponent(databaseName);
//        return $http.get(url).then(function (response) {
//          //返回该服务器上的所有collections
//          angular.forEach(response.data.data.collectionNames, function (value, key) {
//            value.name = value.name.substr(value.name.indexOf('.') + 1);
//          })
//          return response.data.data;
//        });
//      }
      return Resource;
    }
  }])
