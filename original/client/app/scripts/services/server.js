bountyMongo.factory('server', [

  '$http',
  'bucket',

  function ($http, bucket) {
    return function (server) {
      var serverURL = bucket.serverURL;

      var url = serverURL + 'servers/' + server.host;

//      待研究
//      var Resource = function (data) {
//        angular.extend(this, data);
//      };

      var Resource = {}
      Resource.query = function () {
        return $http.get(url).then(function (response) {
          //返回该服务器上的所有databases
          return response.data.data;
        });
      }
      return Resource;
    }
  }])
