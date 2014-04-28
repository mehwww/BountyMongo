bountyMongo.controller('MainCtrl', [

  '$scope',
  '$location',
  '$routeParams',
  'server',
  'database',
  'collection',

  function ($scope, $location, $routeParams, server, database, collection) {

//    console.log($routeParams)
    
    var serverName = $routeParams.serverName;
    var databaseName = $routeParams.databaseName;
    var collectionName = $routeParams.collectionName;
    if (collectionName) {
      collection(serverName, databaseName, collectionName).count().then(function (response) {
        console.log('count success', response)
      }, function (response) {
        console.log('count fail', response)
      })


      return collection(serverName, databaseName, collectionName).query().then(function (response) {
        $scope.records = response
      }, function (response) {
        $scope.records = response
      })
    }
    if (databaseName) {
      return database(serverName, databaseName).query().then(function (response) {
        $scope.records = response
      }, function (response) {
        $scope.records = response
      })
    }
    if (serverName) {
      return server(serverName).query().then(function (response) {
        $scope.records = response
      }, function (response) {
        $scope.records = response
      })
    }
  }])